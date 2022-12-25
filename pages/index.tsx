import { Inter } from '@next/font/google'
import Head from 'next/head'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { Box } from '@chakra-ui/react'

import Profile from '../images/mikey.jpg'
import { Canvas } from '../components/canvas'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <NextSeo />
      <main>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'block',
              position: 'relative',
              width: '50%',
              maxHeight: '80vh'
            }}
          >
            <Canvas />

            <Image
              src={Profile}
              alt={"Photo of Mikey in Glenorchy, New Zealand"}
              priority
              style={{
                objectFit: 'contain',
                maxHeight: '100%',
              }}
            />
          </Box>
        </Box>
      </main>
    </>
  )
}
