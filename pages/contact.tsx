import React from 'react'
import { Inter } from '@next/font/google'
import Image from 'next/image'
import NextLink from 'next/link'
import { NextSeo } from 'next-seo'
import { Box, Center, Container, Heading, Link, UnorderedList, ListItem, Text } from '@chakra-ui/react'
import { Email } from 'react-obfuscate-email'

const inter = Inter({ subsets: ['latin'] })

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
          <Email email='michael.williams@enspiral.com'>
            <span role='presentation'>
              📧
              {' '}
            </span>
            Email me!
          </Email>
        </Box>

      </Container>
    </>
  )
}
