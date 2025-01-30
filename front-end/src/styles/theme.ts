import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
      colors: {
        red: {
          DEFAULT: { value: '#EE0F0F' },
          100: { value: '#EE0F0F' },
        },
        blue: {
          50: { value: '#e0f7ff' },
          100: { value: '#b3e5fc' },
          200: { value: '#81d4fa' },
          300: { value: '#4fc3f7' },
          400: { value: '#29b6f6' },
          500: { value: '#03a9f4' },
          600: { value: '#039be5' },
          700: { value: '#0288d1' },
          800: { value: '#0277bd' },
          900: { value: '#01579b' },
        },
        cyan: {
          50: { value: '#e0ffff' },
          100: { value: '#b3ffff' },
          200: { value: '#80ffff' },
          300: { value: '#4dffff' },
          400: { value: '#1affff' },
          500: { value: '#00e5ff' },
          550: { value: '#24BEE0' },
          600: { value: '#00b3cc' },
          700: { value: '#0088a3' },
          800: { value: '#005f7a' },
          900: { value: '#003a4d' },
        },
      },
    },
  },
});

export default system;
