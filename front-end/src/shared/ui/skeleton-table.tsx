import React from 'react';

import { HStack, Skeleton, VStack } from '@chakra-ui/react';

const SkeletonTable = (): React.ReactElement => {
  return (
    <div>
      <VStack align='stretch' border='1px solid #ddd' p={4} borderRadius='md'>
        <HStack bg='gray.200' p={2} borderRadius='md'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height='20px' flex={1} borderRadius='md' />
          ))}
        </HStack>

        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <HStack key={rowIndex} p={2} borderBottom='1px solid #ddd'>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <Skeleton key={colIndex} height='16px' flex={1} borderRadius='md' />
            ))}
          </HStack>
        ))}
      </VStack>
    </div>
  );
};

export default SkeletonTable;
