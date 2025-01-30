'use client';

import { Box, Flex, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as='footer' bg='primary.300' p={4} color='white' mt='auto'>
      <Flex justify='center' align='center' flexDir='column'>
        <Text textAlign='center'>&copy; 2025 MediCare Solutions. All rights reserved.</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
