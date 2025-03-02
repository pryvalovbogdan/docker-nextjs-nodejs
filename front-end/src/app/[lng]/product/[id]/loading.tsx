'use client';

import React from 'react';

import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { Layout } from '@widgets/layout';

export default function Loading() {
  return (
    <Layout lng='ua'>
      <Flex direction='column' align='center' p={6} maxW='6xl' mx='auto'>
        <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} gap={8} width='100%'>
          <Box flex='1' maxW='500px'>
            <Skeleton height='350px' width='100%' borderRadius='lg' />
            <Flex gap={2} mt={4} overflowX='auto'>
              <Skeleton height='80px' width='80px' borderRadius='md' />
              <Skeleton height='80px' width='80px' borderRadius='md' />
              <Skeleton height='80px' width='80px' borderRadius='md' />
            </Flex>
          </Box>
          <Box flex='1'>
            <Skeleton height='32px' width='60%' mb={4} />
            <Skeleton height='16px' width='80%' mb={2} />
            <Skeleton height='16px' width='90%' mb={2} />
            <Skeleton height='16px' width='85%' mb={2} />
            <Skeleton height='16px' width='70%' mb={2} />
            <Skeleton height='40px' width='120px' mt={6} />
          </Box>
        </Box>
      </Flex>
    </Layout>
  );
}
