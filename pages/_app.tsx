import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'

import { theme } from '../theme'
import { Layout } from '../components/layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate='Mikey (@ahdinosaur) : %s'
        defaultTitle='Mikey (@ahdinosaur)'
        description='Solarpunk artist, developer, and teacher.'
        openGraph={{
          images: [
            {
              url: '/images/mikey-large.jpg',
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
