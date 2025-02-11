'use client';

import theme from '@/shared/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';

import { ColorModeProvider } from './color-mode';

export function Provider(props) {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
