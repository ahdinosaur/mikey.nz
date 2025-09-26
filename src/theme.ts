import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Ubuntu, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
        body: { value: 'Ubuntu, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { base: '{colors.purple.50}', _dark: '{colors.teal.950}' } },
          subtle: { value: { base: '{colors.purple.100}', _dark: '{colors.teal.900}' } },
          muted: { value: { base: '{colors.purple.200}', _dark: '{colors.teal.800}' } },
          emphasized: { value: { base: '{colors.purple.300}', _dark: '{colors.teal.700}' } },
          inverted: { value: { base: '{colors.teal.950}', _dark: '{colors.purple.50}' } },
        },
        fg: {
          DEFAULT: { value: { base: '{colors.teal.800}', _dark: '{colors.purple.50}' } },
          muted: { value: { base: '{colors.teal.600}', _dark: '{colors.purple.400}' } },
          subtle: { value: { base: '{colors.teal.500}', _dark: '{colors.purple.500}' } },
          emphasized: { value: { base: '{colors.teal.900}', _dark: '{colors.purple.200}' } },
          inverted: { value: { base: '{colors.purple.50}', _dark: '{colors.teal.800}' } },
        },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: { base: 'purple', _dark: 'teal' },
    },
    'html, body, body > div': {
      minHeight: '100%',
    },
  },
})

export const system = createSystem(defaultConfig, config)
