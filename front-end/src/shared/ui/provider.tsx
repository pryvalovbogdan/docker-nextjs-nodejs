'use client';

import theme from '@/shared/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';

import { ColorModeProvider, ColorModeProviderProps } from './color-mode';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
