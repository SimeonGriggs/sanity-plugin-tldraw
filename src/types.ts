import {type ObjectInputProps, type ObjectOptions as DefaultObjectOptions} from 'sanity'

export type TldrawObjectValue = {
  document?: string
  sessions?: {
    _key: string
    userId?: string
    session?: string
  }[]
}

export type TldrawObjectInputProps = ObjectInputProps<TldrawObjectValue>

/**
 * @public
 */
export type TldrawInputOptions = {
  height: number
}

export interface TldrawDefinition extends DefaultObjectOptions {
  options?: TldrawInputOptions & DefaultObjectOptions
}

declare module 'sanity' {
  export interface ObjectDefinition extends TldrawDefinition {}
}
