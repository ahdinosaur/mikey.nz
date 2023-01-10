import React, { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { init } from "@socialgouv/matomo-next"

import { theme } from '../theme'
import { Layout } from '../components/layout'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (MATOMO_URL && MATOMO_SITE_ID) {
      init({
        url: MATOMO_URL,
        siteId: MATOMO_SITE_ID,
      })
    }
  }, [])

  return (
    <>
      <DefaultSeo
        titleTemplate='Mikey (@ahdinosaur) : %s'
        defaultTitle='Mikey (@ahdinosaur)'
        description="Hi I'm Mikey. ☀🌱🌙🐈💜"
        openGraph={{
          type: 'website',
          images: [
            {
              url: 'https://mikey.nz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmikey-opengraph.bae71f57.jpg&w=1200&q=75',
              alt: 'Photo of Mikey in Glenorchy, New Zealand',
              type: 'image/jpeg'
            }
          ]
        }}
        twitter={{
          handle: '@ahdinosaur',
          cardType: 'summary'
        }}
      />
      <ChakraProvider theme={theme} resetCSS>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </>
  )
}
