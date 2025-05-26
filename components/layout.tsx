import { Box, List, ListItem, Heading, Text, Icon, Link, LinkProps, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  FaGithub,
  FaMastodon,
} from 'react-icons/fa'
import { SiBluesky } from 'react-icons/si'
import { GiNautilusShell } from 'react-icons/gi'
import { IconType } from 'react-icons'

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
          fontFamily: 'heading',
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
          <Heading as='h1' size='2xl'>
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

interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

const navItems: Array<NavItem> = [
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
  {
    label: 'Blog',
    href: 'https://blog.mikey.nz',
    isExternal: true,
  },
  {
    label: 'CV',
    href: 'https://cv.mikey.nz',
    isExternal: true,
  },
]

interface NavProps {}

function Nav(props: NavProps) {
  const router = useRouter()

  return (
    <Box
      as='nav'
      aria-label="Main"
      sx={{
        fontSize: '2xl'
      }}
    >
      <List
        sx={{
          display: 'flex',
          gap: 4,
        }}
      >
        {navItems.map(navItem => {
          const { label, href, isExternal } = navItem

          return (
            <ListItem key={href}>
              <Link
                as={NextLink}
                href={href}
                isExternal={isExternal}
                aria-current={router.pathname === href ? 'page' : undefined}
                _activeLink={{
                  fontWeight: 'bold'
                }}
              >
                {label}
              </Link>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

interface SocialLinkDescriptor {
  label: string
  href: string
  Icon: IconType
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
    Icon: SiBluesky,
    href: `https://bsky.app/profile/mikey.nz`,
    label: `Bluesky`,
  },
  {
    Icon: GiNautilusShell,
    href: `https://dinosaur.butt.nz`,
    label: `Scuttlebutt`,
  },
]

export function Socials() {
  return (
    <Box
      as='nav'
      aria-label="Social"
      sx={{
        paddingTop: 2,
      }}
    >
      <List
        sx={{
          display: 'flex',
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
