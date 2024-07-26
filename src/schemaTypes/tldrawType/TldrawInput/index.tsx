import 'tldraw/tldraw.css'

import {Box, Button, Card, Flex, Spinner, Stack} from '@sanity/ui'
import {useCallback, useState} from 'react'
import {unset, useFormValue} from 'sanity'
import type {Editor} from 'tldraw'
import {Tldraw} from 'tldraw'

import {TldrawObjectInputProps} from '../types'
import {ColorSchemeSwitcher} from './ColorSchemeSwticher'
import {Value} from './Value'

export function TldrawInput(props: TldrawObjectInputProps) {
  const {onChange} = props
  const height = props.schemaType.options?.height || 600
  const id = useFormValue(['_id'])
  const persistenceKey = [`tldraw`, id, JSON.stringify(props.path)].join('-')

  // Hide UI when tldraw is not focused
  const [focused, setFocused] = useState(Boolean(props.focused))
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleFocus = useCallback(() => {
    setFocused(true)
    if (editor) {
      editor.focus()
    }
  }, [editor])

  const handleBlur = useCallback(() => {
    setFocused(false)
    if (editor) {
      editor.blur()
      editor.selectNone()
      editor.setCurrentTool('hand')
    }
  }, [editor])

  const handleMount = useCallback((mountedEditor: Editor) => {
    setEditor(mountedEditor)
    mountedEditor.setCurrentTool('hand')
    mountedEditor.user.updateUserPreferences({edgeScrollSpeed: 0})
    mountedEditor.updateInstanceState({isDebugMode: false})
  }, [])

  const handleClear = useCallback(() => {
    onChange(unset())
  }, [onChange])

  return (
    <Stack space={4}>
      <Box onFocus={handleFocus} onBlur={handleBlur} style={{height}}>
        {id ? (
          <Tldraw
            persistenceKey={persistenceKey}
            autoFocus={false}
            hideUi={!focused}
            components={{
              HelpMenu: null,
              NavigationPanel: null,
              MainMenu: null,
              PageMenu: null,
            }}
            onMount={handleMount}
          >
            <Value {...props} />
            <ColorSchemeSwitcher />
          </Tldraw>
        ) : (
          <Card __unstable_checkered>
            <Flex align="center" justify="center">
              <Spinner />
            </Flex>
          </Card>
        )}
      </Box>
      <Button onClick={handleClear} text="Clear" tone="critical" />
    </Stack>
  )
}
