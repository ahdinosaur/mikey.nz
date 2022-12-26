import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    global: {
      'html, body, body > div': {
        minHeight: '100%',
      },
    }
  }
})
