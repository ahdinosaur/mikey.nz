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

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "https://blog.mikey.nz", external: true },
  { label: "CV", href: "https://cv.mikey.nz", external: true },
];

export function Header() {
  const pathname = usePathname();

  return (
    <Box
      as="header"
      id="header"
      flexShrink={0}
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="baseline"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="gray.200"
      fontFamily="heading"
      paddingBottom={2}
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
          <Heading as="h1" size="2xl">
            Mikey
          </Heading>
          <Text>@ahdinosaur</Text>
        </NextLink>
      </ChakraLink>

      <Box as="nav" aria-label="Main" fontSize="2xl">
        <List.Root display="flex" gap={4}>
          {navItems.map((item) => {
            const isActive =
              !item.external && (pathname === item.href || pathname?.startsWith(item.href));
            const commonProps = item.external
              ? {
                  href: item.href,
                  rel: "noopener noreferrer",
                  target: "_blank",
                }
              : { href: item.href };

            return (
              <List.Item key={item.href}>
                <ChakraLink
                  asChild
                  aria-current={isActive ? "page" : undefined}
                  fontWeight={isActive ? "bold" : undefined}
                >
                  <NextLink {...commonProps}>{item.label}</NextLink>
                </ChakraLink>
              </List.Item>
            );
          })}
        </List.Root>
      </Box>
    </Box>
  );
}
