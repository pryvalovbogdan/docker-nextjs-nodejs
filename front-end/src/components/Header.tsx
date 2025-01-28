'use client';

import React from 'react';

import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    // <Box
    //   as='header'
    //   position='sticky'
    //   top='0'
    //   zIndex='1000'
    //   bg='rgba(238, 238, 238, 0.08)'
    //   backdropFilter='blur(20px)'
    //   boxShadow='sm'
    //   width='100%'
    // >
    //   <Flex align='center' maxW='1200px' mx='auto' py={3} px={4}>
    //     <Text fontSize='xl' fontWeight='bold' color='primary.500'>
    //       MyWebsite
    //     </Text>
    //     <Spacer />
    //     <Button colorScheme='blue' variant='solid' size='sm' mr={3}>
    //       Login
    //     </Button>
    //     <Button colorScheme='blue' variant='outline' size='sm'>
    //       Sign Up
    //     </Button>
    //   </Flex>
    // </Box>
    <Box
      as='header'
      position='sticky'
      top='0'
      zIndex='1000'
      bg='rgba(15, 151, 181, 0.04)'
      backdropFilter='blur(20px)'
      // boxShadow='sm'
      width='100%'
      py={4}
      color='black'
    >
      <Flex maxW='container.xl' mx='auto' justify='space-between' align='center'>
        <Heading as='h1' size='lg' ml={4}>
          MediCare Solutions
        </Heading>
        <Flex flex={1} justify='space-around'>
          {['Home', 'Brands', 'Categories', 'Top Sales', 'Contact'].map(item => (
            <Text key={item}>
              <Link
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                _hover={{ textDecoration: 'underline' }}
                color='rgba(6, 33, 38, 0.60)'
              >
                {item}
              </Link>
            </Text>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
