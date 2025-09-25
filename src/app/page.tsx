import Image from "next/image";
import { Box } from "@chakra-ui/react";

import { Canvas } from "@/components/Canvas";

import Profile from "@/images/mikey-square.jpg";

export default function HomePage() {
  return (
    <Box
      as="main"
      display="flex"
      flexGrow={1}
    >
      <Canvas />

      <Box
        display="flex"
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="block"
          position="relative"
          width="50%"
          maxWidth="50vh"
        >
          <Image
            src={Profile}
            alt={"Photo of Mikey in Glenorchy, New Zealand"}
            priority
            placeholder="blur"
            sizes="50vw"
            style={{
              borderRadius: "50%",
              objectFit: "contain",
              maxHeight: "100%",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
