'use client';

import React from 'react';

import { Flex, Spinner } from '@chakra-ui/react';
import { Layout } from '@widgets/layout';

export default function Loading() {
  return (
    <Layout lng='ua'>
      <Flex direction='column' align='center' p={6} maxW='6xl' mx='auto'>
        <Flex w='100%' h='300px' alignItems='center' justifyContent='center'>
          <Spinner size='xl' color='#036753' />
        </Flex>
      </Flex>
    </Layout>
  );
}
