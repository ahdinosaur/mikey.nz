'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { system } from '@/theme'

export function Provider(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ChakraProvider value={system ?? defaultSystem}>{children}</ChakraProvider>
    </NextThemesProvider>
  )
}
