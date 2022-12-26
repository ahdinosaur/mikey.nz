import { Ubuntu } from '@next/font/google'
import { extendTheme, theme as defaultTheme } from '@chakra-ui/react'

const headingFont = Ubuntu({ subsets: ['latin'], weight: '400', })

export const theme = extendTheme({
  fonts: {
    heading: `${headingFont.style.fontFamily}, ${defaultTheme.fonts.heading}`,
  },
  styles: {
    global: {
      'html, body, body > div': {
        minHeight: '100%',
        backgroundColor: 'teal.50',
        color: 'teal.900',
      },
    }
  }
})
