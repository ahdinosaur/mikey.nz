"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Heading,
  Link as ChakraLink,
  List,
  Text,
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
      display="flex"
      flexShrink={0}
      flexGrow={0}
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="baseline"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="border"
      fontFamily="heading"
    >
      <ChakraLink
        asChild
        textDecoration="none"
        display="flex"
        alignItems="baseline"
        gap={2}
        href="/"
      >
        <NextLink href="/">
          <Heading as="h1" size="5xl">
            Mikey
          </Heading>
          <Text>@ahdinosaur</Text>
        </NextLink>
      </ChakraLink>


      <Nav />

      <ColorModeToggle />
    </Box>
  );
}

interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

interface NavProps {}

function Nav(_props: NavProps) {
  const pathname = usePathname();

  return (
      <Box as="nav" aria-label="Main" fontSize="2xl">
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
