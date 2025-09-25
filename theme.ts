import { theme as defaultTheme, extendBaseTheme } from '@chakra-ui/react'
import { Ubuntu } from '@next/font/google'

const headingFont = Ubuntu({ subsets: ['latin'], weight: '400' })

const { List, Heading, Link, Container } = defaultTheme.components

export const theme = extendBaseTheme({
  components: {
    List,
    Heading,
    Link,
    Container,
  },
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
    },
  },
})
