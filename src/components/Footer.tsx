import { Box, Icon, Link as ChakraLink, List } from "@chakra-ui/react";
import { FaGithub, FaMastodon } from "react-icons/fa";
import { SiBluesky } from "react-icons/si";
import { GiNautilusShell } from "react-icons/gi";
import { IconType } from "react-icons";

type SocialLink = {
  label: string;
  href: string;
  Icon: IconType;
};

const socialLinks: SocialLink[] = [
  { Icon: FaGithub, href: "https://www.github.com/ahdinosaur", label: "Github" },
  { Icon: FaMastodon, href: "https://cloudisland.nz/@dinosaur", label: "Mastodon" },
  { Icon: SiBluesky, href: "https://bsky.app/profile/mikey.nz", label: "Bluesky" },
  { Icon: GiNautilusShell, href: "https://dinosaur.butt.nz", label: "Scuttlebutt" },
];

export function Footer() {
  return (
    <Box
      as="footer"
      id="footer"
      flexShrink={0}
      display="flex"
      justifyContent="center"
      borderTopWidth="1px"
      borderTopStyle="solid"
      borderTopColor="border"
    >
      <Box as="nav" aria-label="Social" paddingTop={2}>
        <List.Root unstyled display="flex" gap={6}>
          {socialLinks.map((item) => (
            <List.Item key={item.href}>
              <ChakraLink
                asChild
                href={item.href}
                rel="me noopener noreferrer"
                target="_blank"
                display="block"
                width={8}
                height={8}
                aria-label={item.label}
              >
                <Icon boxSize={8}><item.Icon /></Icon>
              </ChakraLink>
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Box>
  );
}
