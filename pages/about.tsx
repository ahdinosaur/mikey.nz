import React from 'react'
import { Inter } from '@next/font/google'
import Image from 'next/image'
import NextLink from 'next/link'
import { NextSeo } from 'next-seo'
import { Box, Center, Container, Heading, Link, UnorderedList, ListItem, Text } from '@chakra-ui/react'

import Profile from '../images/mikey.jpg'

const inter = Inter({ subsets: ['latin'] })

export default function About() {
  return (
    <>
      <NextSeo title="About" />
      <Container
        as="main"
        sx={{
          flexGrow: 1,
          marginY: 8,
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
          About Mikey
        </Heading>

        <Center>
          <Box
            sx={{
              display: 'block',
              position: 'relative',
              width: '50%'
            }}
          >
            <Image
              src={Profile}
              alt={"Photo of Mikey in Glenorchy, New Zealand"}
              priority
              style={{
                objectFit: 'contain',
                width: '100%',
              }}
            />
          </Box>
        </Center>

        <Box as="section" aria-label='Introduction'>
          <Text>
            Hi I'm Mikey. ☀🌱🌙🐈💜
          </Text>

          <Meta
            meta={[
              {
                name: 'Pronouns',
                value: 'he/him',
              },
              {
                name: 'Location',
                value: 'Pōneke (Wellington), Aotearoa 🇳🇿',
              }
            ]}
          />
        </Box>

        <ListSection
          id='networks'
          name='Networks'
          emoji='👪'
          links={[
            { name: 'Art~Hack', href: 'https://arthack.nz' },
            { name: 'Scuttlebutt', href: 'https://scuttlebutt.nz/' },
            { name: 'Enspiral', href: 'https://enspiral.com/' },
            { name: 'Kiwiburn', href: 'https://kiwiburn.com/' },
            { name: 'EHF', href: 'https://ehf.org/' },
          ]}
        />

        <ListSection
          id='projects'
          name='Projects'
          emoji='🎨'
          links={[
            { name: 'Grid Kit', href: 'https://gridkit.nz/' },
            { name: 'Sunrise Choir', href: 'http://sunrisechoir.com/' },
            { name: 'Peach Cloud', href: 'http://peachcloud.org/' },
            { name: 'Value Flows', href: 'http://valueflo.ws/' },
          ]}
        />

        <ListSection
          id='companies'
          name='Companies'
          emoji='🏭'
          links={[
            { name: 'Village Kit', href: 'http://villagekit.com/' },
            { name: '💀 Root Systems', href: 'https://rootsystems.nz/' },
          ]}
        />
      </Container>
    </>
  )
}

interface MetaProps {
  meta: Array<{
    name: string
    value: string
  }>
}

function Meta(props: MetaProps) {
  const { meta } = props
  return (
    <Box
      as="dl"
      aria-label="Personal information"
      sx={{
        marginTop: 4,
        marginLeft: 4,
        display: 'flex',
        flexWrap: 'wrap',

        'dt': {
          width: '25%',
        },
        'dt::after': {
          content: '":"'
        },
        'dd': {
          width: '75%',
        }
      }}
    >
      {meta.map(({ name, value }) => (
        <React.Fragment key={name}>
          <Box as="dt" aria-label={name}>
            {name}
          </Box>
          <Box as="dd" aria-label={value}>
            {value}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  )
}

interface ListSectionProps {
  id: string
  name: string
  emoji: string
  links: Array<{
    name: string
    href: string
  }>
}

function ListSection(props: ListSectionProps) {
  const { id, name, emoji, links } = props
  return (
    <Box
      as="section"
      aria-label={name}
    >
      <Heading>
        <span role="presentation">
          {emoji}
          {' '}
        </span>
        {name}
        :
      </Heading>

      <UnorderedList>
        {links.map(({ name, href }) => (
          <ListItem
            key={href}
            sx={{
              marginY: 1,
            }}
          >
            <Link href={href} isExternal>
              {name}
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  )
}
