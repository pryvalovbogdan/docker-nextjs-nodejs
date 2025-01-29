'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Flex, Spinner } from '@chakra-ui/react';
import { Provider } from '@components/ui/provider';

function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/uk');
  }, [router]);

  return (
    <Provider>
      <Flex justify='center' align='center' w='100%' h='100vh' bg='#F7FCFD'>
        <Spinner size='xl' color='cyan.550' borderWidth='4px' />
      </Flex>
    </Provider>
  );
}

export default Page;
