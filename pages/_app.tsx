import React, { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { init } from "@socialgouv/matomo-next"

import { theme } from '../theme'
import { Layout } from '../components/layout'

const URL_ROOT = process.env.VERCEL
  ? `https://${process.env.VERCEL_URL}`
  : ''

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
          images: [
            {
              url: `${URL_ROOT}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmikey.ce92f95a.jpg&w=1080&q=75`,
              alt: 'Mikey (@ahdinosaur)',
              type: 'image/jpeg'
            }
          ]
        }}
        twitter={{
          handle: '@ahdinosaur',
          cardType: 'summary_large_image'
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
