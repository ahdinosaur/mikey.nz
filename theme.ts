import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    global: {
      'html, body, body > div': {
        height: '100%',
      }
    }
  }
})
