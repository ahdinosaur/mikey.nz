import React from 'react'
import { NextSeo } from 'next-seo'
import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { Email } from 'react-obfuscate-email'

export default function Contact() {
  return (
    <>
      <NextSeo title="Contact" />
      <Container
        as="main"
        sx={{
          flexGrow: 1,
          marginTop: 8,
          gap: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
        aria-labelledby='main-heading'
      >

        <Heading
          as='h1'
          id='main-heading'
          sx={{ textAlign: 'center' }}
        >
          Contact Mikey
        </Heading>

        <Box
          as='section'
          aria-label='Email'
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Text>
            <Email email='hello@mikey.nz'>
                <span role='presentation'>
                  📧
                  {' '}
                </span>
                Email me!
            </Email>
          </Text>
        </Box>

      </Container>
    </>
  )
}
