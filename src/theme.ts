import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Ubuntu, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
        body: { value: 'Ubuntu, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
      },
    },
  },
  globalCss: {
    'html, body, body > div': {
      minHeight: '100%',
    },
  },
})

export const system = createSystem(defaultConfig, config)
