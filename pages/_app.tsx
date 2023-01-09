import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'

import { theme } from '../theme'
import { Layout } from '../components/layout'

const URL_ROOT = process.env.VERCEL
  ? `https://${process.env.VERCEL_URL}`
  : ''

export default function App({ Component, pageProps }: AppProps) {
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
