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
          DEFAULT: { value: { _light: '{colors.purple.100}', _dark: '{colors.teal.900}' } },
          subtle: { value: { _light: '{colors.purple.50}', _dark: '{colors.teal.900}' } },
          muted: { value: { _light: '{colors.purple.100}', _dark: '{colors.teal.800}' } },
          emphasized: { value: { _light: '{colors.purple.200}', _dark: '{colors.teal.700}' } },
          inverted: { value: { _light: '{colors.teal.950}', _dark: '{colors.purple.50}' } },
          panel: { value: { _light: '{colors.purple.50}', _dark: '{colors.teal.950}' } },
        },
        fg: {
          DEFAULT: { value: { _light: '{colors.teal.800}', _dark: '{colors.purple.50}' } },
          muted: { value: { _light: '{colors.teal.600}', _dark: '{colors.purple.400}' } },
          subtle: { value: { _light: '{colors.teal.500}', _dark: '{colors.purple.500}' } },
          emphasized: { value: { _light: '{colors.teal.900}', _dark: '{colors.purple.200}' } },
          inverted: { value: { _light: '{colors.purple.50}', _dark: '{colors.teal.800}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.purple.200}', _dark: '{colors.teal.800}' } },
          muted: { value: { _light: '{colors.purple.100}', _dark: '{colors.teal.900}' } },
          subtle: { value: { _light: '{colors.purple.50}', _dark: '{colors.teal.950}' } },
          emphasized: { value: { _light: '{colors.purple.300}', _dark: '{colors.teal.700}' } },
          inverted: { value: { _light: '{colors.teal.800}', _dark: '{colors.purple.200}' } },
        },
      },
    },
  },
  globalCss: {
    'html.light': {
      colorPalette: 'teal',
    },
    'html.dark': {
      colorPalette: 'purple',
    },
    'html, body, body > div': {
      minHeight: '100%',
    },
  },
})

export const system = createSystem(defaultConfig, config)
