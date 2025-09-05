import {Dialog, DialogProvider} from '@sanity/ui'
import {type CSSProperties, type PropsWithChildren, useRef} from 'react'

import {Filler} from './Filler'

type DialogWrapperProps = PropsWithChildren<{
  header: string
  isOpen: boolean
  onActivate: () => void
  onClose: () => void
}>

const style: CSSProperties = {width: '100%', height: '80vh'}

export function DialogWrapper({children, header, isOpen, onActivate, onClose}: DialogWrapperProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)

  return isOpen ? (
    <>
      {/* DialogProvider is required so the Dialog is not scoped to the form editor */}
      <DialogProvider zOffset={100000}>
        {/* TODO: Make sure tldraw editor gets focus on open (why is there no onOpen?) */}
        <Dialog
          __unstable_autoFocus={false}
          animate
          header={header}
          id="tldraw-modal"
          onActivate={onActivate}
          onClose={onClose}
          width={5}
          contentRef={contentRef}
        >
          <div ref={contentRef} style={style}>
            {children}
          </div>
        </Dialog>
      </DialogProvider>

      <Filler spinner={false} />
    </>
  ) : (
    children
  )
}
