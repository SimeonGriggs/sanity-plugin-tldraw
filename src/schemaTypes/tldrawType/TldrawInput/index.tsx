import {ExpandIcon} from '@sanity/icons'
import {Box, Button, Grid, Stack, useClickOutsideEvent} from '@sanity/ui'
import {useCallback, useMemo, useRef, useState} from 'react'
import {unset, useFormValue} from 'sanity'
import type {Editor} from 'tldraw'
import {Tldraw} from 'tldraw'

import {DialogWrapper} from '../../../components/DialogWrapper'
import {Filler} from '../../../components/Filler'
import {useTldrawModal} from '../../../components/TldrawModal'
import {createPersistenceKey} from '../../../lib/createPersistenceKey'
import {TldrawObjectInputProps} from '../../../types'
import {ColorSchemeSwitcher} from './ColorSchemeSwticher'
import {Value} from './Value'

const components = {
  HelpMenu: null,
  NavigationPanel: null,
  MainMenu: null,
  PageMenu: null,
}

export function TldrawInput(props: TldrawObjectInputProps) {
  const {onChange, schemaType} = props

  const id = useFormValue(['_id']) as string
  const documentId = id.replace(/^drafts\./, '')
  const persistenceKey = createPersistenceKey({documentId, path: props.path})
  const {tldrawModal, toggleTldrawModal} = useTldrawModal()
  const tldrawModalIsOpen = tldrawModal === persistenceKey

  const style = useMemo(() => ({height: schemaType.options?.height || 600}), [schemaType])

  const [focused, setFocused] = useState(Boolean(props.focused))
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleFocus = useCallback(() => {
    setFocused(true)
    if (editor) {
      editor.focus()
    }
  }, [editor])

  const handleClickOutside = useCallback(() => {
    if (tldrawModalIsOpen) {
      return
    }
    setFocused(false)
    if (editor) {
      editor.blur()
      editor.selectNone()
      editor.setCurrentTool('hand')
    }
  }, [editor, tldrawModalIsOpen])

  const containerRef = useRef<HTMLDivElement | null>(null)
  useClickOutsideEvent(handleClickOutside, () => [containerRef.current])

  const handleMount = useCallback((mountedEditor: Editor) => {
    setEditor(mountedEditor)
    mountedEditor.setCurrentTool('hand')
    mountedEditor.user.updateUserPreferences({edgeScrollSpeed: 0})
    mountedEditor.updateInstanceState({isDebugMode: false})
  }, [])

  const handleClear = useCallback(() => {
    onChange(unset([]))
  }, [onChange])

  const handleOpen = useCallback(() => {
    toggleTldrawModal(persistenceKey)
    if (editor) {
      editor.focus()
    }
  }, [editor, persistenceKey, toggleTldrawModal])

  // TODO: Re-centre on content after modal closes
  const handleClose = useCallback(() => {
    toggleTldrawModal()
    if (editor) {
      editor.blur()
    }
  }, [toggleTldrawModal, editor])

  return (
    <Stack space={4}>
      <Box ref={containerRef} onFocus={handleFocus} style={style}>
        {id ? (
          <DialogWrapper
            header={props.schemaType.title || props.schemaType.name}
            onClose={handleClose}
            onActivate={handleOpen}
            isOpen={tldrawModalIsOpen}
          >
            <Tldraw
              persistenceKey={persistenceKey}
              autoFocus={false}
              hideUi={!focused}
              components={components}
              onMount={handleMount}
            >
              <Value {...props} />
              <ColorSchemeSwitcher />
            </Tldraw>
          </DialogWrapper>
        ) : (
          <Filler />
        )}
      </Box>
      <Grid columns={2} gap={2}>
        <Button
          onClick={handleOpen}
          icon={ExpandIcon}
          text={tldrawModalIsOpen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        />
        <Button onClick={handleClear} text="Clear" tone="critical" />
      </Grid>
    </Stack>
  )
}
