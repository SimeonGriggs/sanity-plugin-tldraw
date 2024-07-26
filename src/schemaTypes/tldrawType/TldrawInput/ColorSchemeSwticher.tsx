import {useTheme} from '@sanity/ui'
import {useEffect} from 'react'
import {useEditor} from 'tldraw'

// Update color scheme preference in tldraw based on Studio theme
export function ColorSchemeSwitcher() {
  const colorScheme = useTheme().sanity.v2?.color._dark ? 'dark' : 'light'
  const editor = useEditor()

  useEffect(() => {
    editor.user.updateUserPreferences({colorScheme})
  }, [colorScheme, editor.user])

  return null
}
