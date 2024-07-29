import {AddIcon} from '@sanity/icons'
import {useCallback} from 'react'
import {defineDocumentFieldAction, DocumentFieldActionItem} from 'sanity'

import {useTldrawModal} from './components/TldrawModal'
import {createPersistenceKey} from './lib/createPersistenceKey'

export const tldrawAction = defineDocumentFieldAction({
  name: 'tldraw',
  // @ts-expect-error icons don't match for some reason
  useAction(props) {
    const {schemaType} = props
    const isTldrawField = schemaType.type?.name === 'tldraw'
    const {toggleTldrawModal} = useTldrawModal()

    // this should be in props.documentId but it often returns as `root`
    const id = props.documentId

    const onAction = useCallback(() => {
      if (!id) {
        return
      }
      const documentId = id.replace(/^drafts\./, '')
      const persistenceKey = createPersistenceKey({documentId, path: props.path})
      toggleTldrawModal(persistenceKey)
    }, [id, props.path, toggleTldrawModal])

    const item: DocumentFieldActionItem = {
      type: 'action',
      onAction,
      title: 'Full screen',
    }

    return {
      type: 'group',
      icon: AddIcon,
      title: 'Tldraw',
      renderAsButton: true,
      children: [item],
      hidden: isTldrawField,
    }
  },
})
