import { Box, Container, Heading, Text } from '@chakra-ui/react'
import type { Metadata } from 'next'
import { useId } from 'react'
import { Email } from 'react-obfuscate-email'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  const headingId = useId()

  return (
    <Container
      as="main"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      gap={8}
      marginTop={8}
      aria-labelledby={headingId}
      maxW="xl"
    >
      <Heading as="h1" id={headingId} textAlign="center">
        Contact Mikey
      </Heading>

      <Box as="section" aria-label="Email" display="flex" justifyContent="center">
        <Text>
          <Email email="hello@mikey.nz">
            <span role="presentation">📧 </span>Email me!
          </Email>
        </Text>
      </Box>
    </Container>
  )
}
