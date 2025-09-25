import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { Metadata } from "next";
// @ts-ignore
import { Email } from "react-obfuscate-email";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <Container
      as="main"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      gap={8}
      marginTop={8}
      aria-labelledby="contact-heading"
      maxW="xl"
    >
      <Heading as="h1" id="contact-heading" textAlign="center">
        Contact Mikey
      </Heading>

      <Box
        as="section"
        aria-label="Email"
        display="flex"
        justifyContent="center"
      >
        <Text>
          <Email email="hello@mikey.nz">
            <span role="presentation">📧 </span>Email me!
          </Email>
        </Text>
      </Box>
    </Container>
  );
}
