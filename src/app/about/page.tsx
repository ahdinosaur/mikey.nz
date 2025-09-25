import { Metadata } from "next";
import Image from "next/image";
import {
  Box,
  Link as ChakraLink,
  Center,
  Container,
  Heading,
  List,
  Text,
} from "@chakra-ui/react";

import Profile from "@/images/mikey.jpg";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Container
      as="main"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      gap={8}
      marginY={8}
      aria-labelledby="about-heading"
      maxW="container.md"
    >
      <Heading as="h1" id="about-heading" textAlign="center">
        About Mikey
      </Heading>

      <Center>
        <Image
          src={Profile}
          alt={"Photo of Mikey in Glenorchy, New Zealand"}
          width={512}
          priority
          style={{
            objectFit: "contain",
            width: "100%",
            borderRadius: "2rem",
          }}
        />
      </Center>

      <Box as="section" aria-label="Introduction">
        <Text>Hi I&apos;m Mikey. ☀🌱🌙🐈💜</Text>
        <Meta
          meta={[
            { name: "Pronouns", value: "he/him" },
            {
              name: "Location",
              value: "Pōneke (Wellington), Aotearoa 🇳🇿",
            },
          ]}
        />
      </Box>

      <ListSection
        id="networks"
        name="Networks"
        emoji="👪"
        links={[
          { name: "Art~Hack", href: "https://arthack.nz" },
          { name: "Scuttlebutt", href: "https://scuttlebutt.nz/" },
          { name: "Enspiral", href: "https://enspiral.com/" },
          { name: "Kiwiburn", href: "https://kiwiburn.com/" },
          { name: "EHF", href: "https://ehf.org/" },
        ]}
      />

      <ListSection
        id="projects"
        name="Projects"
        emoji="🎨"
        links={[
          { name: "Grid Kit", href: "https://gridkit.nz/" },
          { name: "Sunrise Choir", href: "http://sunrisechoir.com/" },
          { name: "Peach Cloud", href: "http://peachcloud.org/" },
          { name: "Value Flows", href: "http://valueflo.ws/" },
        ]}
      />

      <ListSection
        id="companies"
        name="Companies"
        emoji="🏭"
        links={[
          { name: "Village Kit", href: "http://villagekit.com/" },
          { name: "💀 Root Systems", href: "https://rootsystems.nz/" },
        ]}
      />
    </Container>
  );
}

interface MetaProps {
  meta: Array<{ name: string; value: string }>;
}

function Meta(props: MetaProps) {
  const { meta } = props;

  return (
    <Box
      as="dl"
      aria-label="Personal information"
      marginTop={4}
      marginLeft={4}
      display="flex"
      flexDirection="column"
      css={{
        "div": { display: "flex", gap: 8, alignItems: "baseline" },
        "dt": { fontWeight: "bold" },
        "dt::after": { content: '":"', marginLeft: 2 },
      }}
    >
      {meta.map(({ name, value }) => (
        <Box key={name}>
          <Box as="dt" aria-label={name}>
            {name}
          </Box>
          <Box as="dd" aria-label={value}>
            {value}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

interface ListSectionProps {
  id: string;
  name: string;
  emoji: string;
  links: Array<{ name: string; href: string }>;
}

function ListSection(props: ListSectionProps) {
  const { id, name, emoji, links } = props;
  return (
    <Box as="section" aria-label={name} id={id}>
      <Heading size="lg">
        <span role="presentation">{emoji} </span>
        {name}
      </Heading>
      <List.Root>
        {links.map(({ name: label, href }) => (
          <List.Item key={href} my={1}>
            <ChakraLink
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {label}
            </ChakraLink>
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
}
