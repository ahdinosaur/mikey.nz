import { Box, Link as ChakraLink, Icon, List } from '@chakra-ui/react'
import type { IconType } from 'react-icons'
import { FaGithub, FaMastodon } from 'react-icons/fa'
import { GiNautilusShell } from 'react-icons/gi'
import { SiBluesky } from 'react-icons/si'

/* ---------- Data ---------- */
const socialLinks: SocialLinkProps[] = [
  {
    Icon: FaGithub,
    href: 'https://www.github.com/ahdinosaur',
    label: 'Github',
  },
  {
    Icon: FaMastodon,
    href: 'https://cloudisland.nz/@dinosaur',
    label: 'Mastodon',
  },
  {
    Icon: SiBluesky,
    href: 'https://bsky.app/profile/mikey.nz',
    label: 'Bluesky',
  },
  {
    Icon: GiNautilusShell,
    href: 'https://dinosaur.butt.nz',
    label: 'Scuttlebutt',
  },
]

export function Footer() {
  return (
    <Box
      as="footer"
      flexShrink={0}
      display="flex"
      justifyContent="center"
      borderTopWidth="1px"
      borderTopStyle="solid"
      borderTopColor="border"
    >
      <Box as="nav" aria-label="Social" paddingTop={2}>
        <SocialLinks links={socialLinks} />
      </Box>
    </Box>
  )
}

type SocialLinksProps = {
  links: SocialLinkProps[]
}

function SocialLinks({ links }: SocialLinksProps) {
  return (
    <List.Root unstyled display="flex" gap={6}>
      {links.map((link) => (
        <SocialLink key={link.href} {...link} />
      ))}
    </List.Root>
  )
}

type SocialLinkProps = {
  label: string
  href: string
  Icon: IconType
}

function SocialLink({ href, label, Icon: IconComponent }: SocialLinkProps) {
  return (
    <List.Item _hover={{ colorPalette: { base: 'purple', _dark: 'teal' } }}>
      <ChakraLink
        asChild
        href={href}
        rel="me noopener noreferrer"
        target="_blank"
        display="block"
        width={8}
        height={8}
        aria-label={label}
      >
        <Icon boxSize={8}>
          <IconComponent />
        </Icon>
      </ChakraLink>
    </List.Item>
  )
}
