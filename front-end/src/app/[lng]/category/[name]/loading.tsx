'use client';

import React from 'react';

import { Box, Flex, Grid, Skeleton, VStack } from '@chakra-ui/react';
import { Layout } from '@widgets/layout';

export default function Loading() {
  return (
    <Layout lng='ua'>
      <Box maxW='6xl' mx='auto' py={8} px={6}>
        <Skeleton height='32px' width='50%' mb={6} mx='auto' />
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(300px, 1fr))' }}
          gap={6}
          w='100%'
          alignItems='stretch'
          justifyContent='center'
          gridAutoRows='min-content'
        >
          {[...Array(9)].map((_, index) => (
            <Flex
              key={index}
              direction='column'
              p={4}
              borderRadius='lg'
              bg='white'
              border='1px solid'
              borderColor='gray.300'
              boxShadow='sm'
              height='100%'
              maxHeight='300px'
              display='flex'
              justifyContent='space-between'
              overflow='hidden'
            >
              <Skeleton height='180px' borderRadius='md' mb={3} />

              <VStack align='start' spacing={2} width='100%'>
                <Skeleton height='20px' width='80%' />
                <Skeleton height='14px' width='100%' />
                <Skeleton height='14px' width='90%' />
                <Skeleton height='14px' width='85%' />
                <Skeleton height='16px' width='50%' />
              </VStack>
            </Flex>
          ))}
        </Grid>
        <Flex justify='center' align='center' mt={6} gap={2}>
          <Skeleton height='36px' width='36px' borderRadius='full' />
          <Skeleton height='36px' width='36px' borderRadius='full' />
          <Skeleton height='36px' width='36px' borderRadius='full' />
          <Skeleton height='36px' width='36px' borderRadius='full' />
          <Skeleton height='36px' width='36px' borderRadius='full' />
          <Skeleton height='36px' width='36px' borderRadius='full' />
        </Flex>
      </Box>
    </Layout>
  );
}
