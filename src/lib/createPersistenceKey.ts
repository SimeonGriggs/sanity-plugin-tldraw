import {Path, pathToString} from 'sanity'

export function createPersistenceKey(props: {documentId: string; path: Path}) {
  const pathString = pathToString(props.path)
  return [`tldraw`, props.documentId, pathString].join('-')
}
