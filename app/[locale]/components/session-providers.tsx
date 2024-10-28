'use client'

import { SessionProvider } from "next-auth/react"

export function ProviderSession({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}