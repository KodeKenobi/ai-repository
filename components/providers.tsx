
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Always render SessionProvider, but conditionally render ThemeProvider
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {mounted ? (
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      ) : (
        <div suppressHydrationWarning>{children}</div>
      )}
    </SessionProvider>
  )
}
