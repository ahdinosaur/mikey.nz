import { Box } from "@chakra-ui/react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

export function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <Box
      padding={4}
      display="flex"
      flexDirection="column"
      minH="100dvh"
      bg="teal.50"
      color="teal.900"
    >
      <Header />

      {children}

      <Footer />
      <Analytics />
    </Box>
  );
}
