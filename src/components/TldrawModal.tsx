import {createContext, type PropsWithChildren, useContext, useState} from 'react'

interface TldrawModalContextType {
  tldrawModal: string | null
  toggleTldrawModal: (modalName?: string) => void
}

const TldrawModalContext = createContext<TldrawModalContextType | undefined>(undefined)

export function TldrawModalProvider({children}: PropsWithChildren) {
  const [tldrawModal, setTldrawModal] = useState<string | null>(null)

  const toggleTldrawModal = (modalName?: string) => {
    setTldrawModal((prev) => (prev ? null : modalName || 'default'))
  }

  const value: TldrawModalContextType = {
    tldrawModal,
    toggleTldrawModal,
  }

  return <TldrawModalContext.Provider value={value}>{children}</TldrawModalContext.Provider>
}

export function useTldrawModal(): TldrawModalContextType {
  const context = useContext(TldrawModalContext)
  if (context === undefined) {
    throw new Error('useTldrawModal must be used within a TldrawModalProvider')
  }
  return context
}
