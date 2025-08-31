'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

import { Box, Button, Flex, Text } from '@chakra-ui/react';

type Locale = 'uk' | 'ru';

const LOCALE_SHORT: Record<Locale, string> = { uk: 'УКР', ru: 'РУ' };

export default function LangSwitcher({ locales = ['uk', 'ru'] as Locale[] }: { locales?: Locale[] }) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const current: Locale = useMemo(() => {
    const seg = (pathname.split('/')[1] || '').toLowerCase();

    return seg === 'ru' || seg === 'uk' ? (seg as Locale) : 'uk';
  }, [pathname]);

  const buildUrl = (nextLocale: Locale) => {
    const parts = pathname.split('/');

    if (parts.length > 1 && (parts[1] === 'uk' || parts[1] === 'ru')) parts[1] = nextLocale;
    else parts.splice(1, 0, nextLocale);

    const base = parts.join('/') || '/';
    const qs = searchParams.toString();

    return qs ? `${base}?${qs}` : base;
  };

  const switchTo = (nextLocale: Locale) => {
    if (nextLocale === current) return;

    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    router.replace(buildUrl(nextLocale), { scroll: false });
    router.refresh();
    setOpen(false);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;

      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <Flex ref={rootRef} alignItems='center' ml={{ base: 2, md: 6 }}>
      <Button
        onClick={() => setOpen(v => !v)}
        variant='outline'
        size='sm'
        px={3}
        position='relative'
        bg='transparent'
        color='white'
        borderColor='gray.300'
        _hover={{ textDecoration: 'underline', borderColor: 'gray.100' }}
        _active={{ bg: 'gray.100' }}
        _focusVisible={{ boxShadow: '0 0 0 2px', borderColor: 'emerald.600' }}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-label='Change language'
      >
        <Text as='span' fontWeight='semibold'>
          {LOCALE_SHORT[current]}
        </Text>
        {open ? <LuChevronUp /> : <LuChevronDown />}

        {open && (
          <Box
            role='listbox'
            aria-label='Languages'
            position='absolute'
            top='100%'
            mt='2'
            minW='100%'
            bg='white'
            borderColor='gray.300'
            borderRadius='sm'
            boxShadow='md'
            zIndex={10}
          >
            {locales.map(loc => {
              const active = loc === current;

              return (
                <Box
                  as='button'
                  cursor='pointer'
                  key={loc}
                  borderRadius='sm'
                  role='option'
                  aria-selected={active}
                  onClick={() => switchTo(loc)}
                  display='block'
                  w='100%'
                  textAlign='left'
                  px='3'
                  py='2'
                  bg={active ? 'emerald.100' : 'white'}
                  color={active ? 'black' : 'gray.900'}
                  borderLeft={active ? '3px solid' : '3px solid transparent'}
                  borderLeftColor={active ? 'emerald.600' : 'transparent'}
                  _hover={{ bg: 'gray.100', color: 'black' }}
                  _focusVisible={{ outline: '2px solid', outlineColor: 'emerald.600' }}
                >
                  {LOCALE_SHORT[loc]}
                </Box>
              );
            })}
          </Box>
        )}
      </Button>
    </Flex>
  );
}
