import {useEffect} from 'react'
import type {FormPatch} from 'sanity'
import {set, setIfMissing, useWorkspace} from 'sanity'
import {debounce, getSnapshot, loadSnapshot, useEditor} from 'tldraw'

import {TldrawObjectInputProps, TldrawObjectValue} from '../../../types'
import {deepEquals} from './deepEquals'

// Update document value when changes are made in tldraw
export function Value(props: TldrawObjectInputProps) {
  const editor = useEditor()
  const {currentUser} = useWorkspace()

  // Load value and session from document into editor
  useEffect(() => {
    if (props.value) {
      const {document, sessions = []} = props.value

      if (document) {
        const {document: localDocument, session: localSession} = getSnapshot(editor.store)
        const userSession = sessions.find((session) => session.userId === currentUser?.id)

        const documentChanged = !deepEquals(JSON.parse(document), localDocument)
        const sessionChanged =
          userSession?.session && !deepEquals(JSON.parse(userSession.session), localSession)

        if (documentChanged || sessionChanged) {
          loadSnapshot(editor.store, {
            document: JSON.parse(document),
            session: userSession?.session ? JSON.parse(userSession.session) : localSession,
          })
        }
      }
    }
  }, [props.value, editor.store, currentUser])

  const debouncedUpdate = debounce(() => {
    const {document, session} = getSnapshot(editor.store)
    const patches: FormPatch[] = []

    const currentDocument = JSON.parse(props.value?.document || '{}')
    const documentChanged = !deepEquals(document, currentDocument)

    if (documentChanged) {
      const updatedDocument = JSON.stringify(document)
      patches.push(set(updatedDocument, ['document']))
    }

    if (currentUser?.id) {
      const updatedSession = JSON.stringify(session)
      const userSession: Required<TldrawObjectValue>['sessions'][0] = {
        _key: currentUser.id,
        userId: currentUser.id,
        session: updatedSession,
      }
      const currentSession = props.value?.sessions?.find((s) => s.userId === currentUser.id)
      const sessionChanged = !deepEquals(userSession, currentSession)

      if (sessionChanged) {
        patches.push(setIfMissing([], ['sessions']))
        patches.push(set(userSession, ['sessions', {_key: currentUser.id}]))
      }
    }

    if (patches.length) {
      props.onChange(patches)
    }
  }, 250)

  useEffect(() => {
    const unsubscribe = editor.store.listen((update) => {
      if (update.changes.updated && update.source !== 'remote') {
        debouncedUpdate()
      }
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
