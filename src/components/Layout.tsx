import { Box } from '@chakra-ui/react'
import { Analytics } from '@/components/Analytics'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <Box padding={4} display="flex" flexDirection="column" height="100dvh">
      <Header />

      {children}

      <Footer />
      <Analytics />
    </Box>
  )
}
