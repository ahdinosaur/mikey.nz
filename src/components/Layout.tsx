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
      height="100dvh"
    >
      <Header />

      {children}

      <Footer />
      <Analytics />
    </Box>
  );
}
