import {ExpandIcon, ResetIcon} from '@sanity/icons'
import {Box, Button, Grid, Stack, useClickOutsideEvent} from '@sanity/ui'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {unset, useFormValue} from 'sanity'
import type {Editor} from 'tldraw'
import {Tldraw} from 'tldraw'

import {DialogWrapper} from '../../../components/DialogWrapper'
import {Filler} from '../../../components/Filler'
import {useTldrawModal} from '../../../components/TldrawModal'
import {createPersistenceKey} from '../../../lib/createPersistenceKey'
import {type TldrawObjectInputProps} from '../../../types'
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

  const style = useMemo(
    () =>
      schemaType.options?.height
        ? {height: schemaType.options.height}
        : {aspectRatio: '16 / 9', width: '100%'},
    [schemaType],
  )

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

  const centerContent = useCallback((editorInstance: Editor) => {
    // Only zoom to fit if there are shapes, otherwise reset to default view
    const hasShapes = editorInstance.getCurrentPageShapeIds().size > 0
    if (hasShapes) {
      editorInstance.zoomToFit({animation: {duration: 0}})
    } else {
      editorInstance.resetZoom()
    }
  }, [])

  const handleMount = useCallback(
    (mountedEditor: Editor) => {
      setEditor(mountedEditor)
      mountedEditor.setCurrentTool('hand')
      mountedEditor.user.updateUserPreferences({edgeScrollSpeed: 0})
      mountedEditor.updateInstanceState({isDebugMode: false})
      // Center content on initial load
      setTimeout(() => centerContent(mountedEditor), 100)
    },
    [centerContent],
  )

  const handleClear = useCallback(() => {
    onChange(unset([]))
  }, [onChange])

  const handleOpen = useCallback(() => {
    toggleTldrawModal(persistenceKey)
  }, [persistenceKey, toggleTldrawModal])

  // Focus the editor when fullscreen modal opens
  useEffect(() => {
    if (!tldrawModalIsOpen || !editor) {
      return
    }
    setFocused(true)
    // Delay to allow the dialog animation to complete
    const timer = setTimeout(() => {
      editor.getContainer().focus()
      editor.focus()
    }, 200)
    return () => clearTimeout(timer)
  }, [tldrawModalIsOpen, editor])

  const handleClose = useCallback(() => {
    toggleTldrawModal()
    if (editor) {
      editor.blur()
      // Re-centre on content after modal closes
      setTimeout(() => centerContent(editor), 100)
    }
  }, [toggleTldrawModal, editor, centerContent])

  return (
    <Stack space={2}>
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
          mode="ghost"
        />
        <Button onClick={handleClear} icon={ResetIcon} text="Clear" tone="critical" mode="ghost" />
      </Grid>
    </Stack>
  )
}
