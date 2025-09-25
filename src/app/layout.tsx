import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Provider } from '@/components/Provider'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mikey.nz'),
  title: {
    default: 'Mikey (@ahdinosaur)',
    template: 'Mikey (@ahdinosaur) : %s',
  },
  description: "Hi I'm Mikey. ☀🌱🌙🐈💜",
  applicationName: 'Mikey',
  openGraph: {
    type: 'website',
    siteName: 'Mikey',
    images: [
      {
        url: '/images/mikey-opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Photo of Mikey in Glenorchy, New Zealand',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ahdinosaur',
    creator: '@ahdinosaur',
    images: ['/images/mikey-opengraph.jpg'],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={ubuntu.className} suppressHydrationWarning>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  )
}
