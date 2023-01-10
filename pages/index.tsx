import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { Box } from '@chakra-ui/react'

import Profile from '../images/mikey-square.jpg'
import { Canvas } from '../components/canvas'

export default function Home() {
  return (
    <>
      <NextSeo />
      <Box
        as="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <Canvas />

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'block',
              position: 'relative',
              width: '50%',
              maxWidth: '50vh',
            }}
          >

            <Image
              src={Profile}
              alt={"Photo of Mikey in Glenorchy, New Zealand"}
              priority
              placeholder='blur'
              sizes='50vw'
              style={{
                borderRadius: '50%',
                objectFit: 'contain',
                maxHeight: '100%',
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}
