'use client';

import theme from '@/shared/theme/theme';
import { ColorModeProvider, ColorModeProviderProps } from '@/shared/ui/color-mode';
import { ChakraProvider } from '@chakra-ui/react';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
