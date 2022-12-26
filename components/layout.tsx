import { Box, List, ListItem, Heading, Text, Icon, Link, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import {
  FaGithub,
  FaTwitter,
  FaMastodon,
  FaHatWizard,
} from 'react-icons/fa'

export interface LayoutProps {
  children: React.ReactNode
}

export function Layout(props: LayoutProps) {
  const { children } = props

  return (
    <Box
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Box
        as='header'
        id='header'
        sx={{
          flexGrow: 0,
          flexShrink: 0,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'rgb(230, 230, 230)',
        }}
      >
        <Link
          as={NextLink}
          href='/'
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'baseline',
            gap: 2,
          }}
        >
          <Heading as='h1'>
            Mikey
          </Heading>
          <Text>
            @ahdinosaur
          </Text>
        </Link>
        <Nav />
      </Box>
    
      {children}

      <Box
        as='footer'
        id='footer'
        sx={{
          flexGrow: 0,
          flexShrink: 0,
          padding: 2, 
          display: 'flex',
          justifyContent: 'center',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: 'rgb(230, 230, 230)',
        }}
      >
        <Socials />
      </Box>
    </Box>
  )
}

interface NavProps {}

function Nav(props: NavProps) {
  return (
    <Box as='nav' sx={{ fontSize: '2xl' }}>
      <List sx={{ display: 'flex', gap: 4 }}>
        <ListItem>
          <Link as={NextLink} href='/about'>
            About
          </Link>
        </ListItem>
        <ListItem>
          <Link as={NextLink} href='/contact'>
            Contact
          </Link>
        </ListItem>
        <ListItem>
          <Link as={NextLink} href='https://blog.dinosaur.is' isExternal>
            Blog
          </Link>
        </ListItem>
      </List>
    </Box>
  )
}

interface SocialLinkDescriptor {
  label: string
  href: string
  Icon: React.ComponentType
}

const socialLinks: Array<SocialLinkDescriptor> = [
  {
    Icon: FaGithub,
    href: `https://www.github.com/ahdinosaur`,
    label: `Github`,
  },
  {
    Icon: FaMastodon,
    href: `https://cloudisland.nz/@dinosaur`,
    label: `Mastodon`,
  },
  {
    Icon: FaHatWizard,
    href: `https://dinosaur.butt.nz`,
    label: `Scuttlebutt`,
  },
  {
    Icon: FaTwitter,
    href: `https://twitter.com/ahdinosaur`,
    label: `Twitter`,
  },
]

export function Socials() {
  return (
    <Box as='nav'>
      <List
        sx={{
          display: 'flex',
          paddingY: 2,
          gap: 6,
        }}>
        {socialLinks.map((socialLink) => (
          <ListItem key={socialLink.href}>
            <SocialLink  {...socialLink} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

interface SocialLinkProps extends SocialLinkDescriptor {}

function SocialLink(props: SocialLinkProps) {
  const { label, href, Icon: SocialIcon } = props

  return (
    <Link
      href={href}
      rel="me"
      isExternal
      sx={{
        display: 'block',
        width: 8,
        height: 8,
      }}
    >
      <Icon as={SocialIcon} aria-label={label} boxSize={8} />
    </Link>
  )
}