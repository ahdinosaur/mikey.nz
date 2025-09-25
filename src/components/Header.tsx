"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Heading,
  Link as ChakraLink,
  List,
  Text,
  Flex,
  BoxProps,
} from "@chakra-ui/react";
import { ColorModeToggle } from "./ColorModeToggle";

const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "https://blog.mikey.nz", isExternal: true },
  { label: "CV", href: "https://cv.mikey.nz", isExternal: true },
];

export function Header() {
  return (
    <Box
      as="header"
      id="header"
      display={{ base: "flex", md: "grid" }}
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="baseline"
      gridTemplateColumns="1fr auto 1fr"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="border"
      fontFamily="heading"
    >
      <ChakraLink
        asChild
        href="/"
        display="flex"
      order={0}
        alignItems="baseline"
        gap={2}
        textDecoration="none"
        marginRight={8}
      >
        <NextLink href="/">
          <Heading as="h1" size="5xl">
            Mikey
          </Heading>
          <Text>@ahdinosaur</Text>
        </NextLink>
      </ChakraLink>


      <Nav order={{ base: 2, md: 1 }} width={{ base: 'full', md: 'auto' }} />

      <Flex justify="flex-end" order={{ base: 1, md: 2 }}>
        <ColorModeToggle />
      </Flex>
    </Box>
  );
}

interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

type NavProps = BoxProps

function Nav(props: NavProps) {
  const pathname = usePathname();

  return (
      <Box as="nav" aria-label="Main" fontSize="2xl" {...props}>
        <List.Root unstyled display="flex" alignItems="flex-end" gap={4}>
          {navItems.map((navItem) => {
          const { label, href, isExternal } = navItem
            const isActive = !isExternal && (pathname === href || pathname?.startsWith(href));
            const commonProps = isExternal
              ? {
                  href,
                  rel: "noopener noreferrer",
                  target: "_blank",
                }
              : { href };

            return (
              <List.Item key={href}>
                <ChakraLink
                  asChild
                  aria-current={isActive ? "page" : undefined}
                  fontWeight={isActive ? "bold" : undefined}
                  textDecorationColor="currentColor"
                >
                  <NextLink {...commonProps}>{label}</NextLink>
                </ChakraLink>
              </List.Item>
            );
          })}

        </List.Root>
      </Box>
  )
}
