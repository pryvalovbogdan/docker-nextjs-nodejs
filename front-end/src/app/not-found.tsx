'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.push('/uk');
  }, [router]);
}

export default Custom404;
