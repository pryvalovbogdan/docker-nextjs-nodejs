'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Box, Button, Flex, Heading, Image } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const images = [
  '2025-03-14 17.02.18.jpg',
  'GE HealthCare Image (2).webp',
  'olympus-europa_press-release_easysuite_or_img_1200.png',
  'main3.jpeg',
  'cardiovit-at-180-resting-ecg-in-practice.jpg',
  '2025-03-20 09.09.15.jpg',
];

interface GalleryImagesProps {
  lng: string;
}
const GalleryImages: React.FC<GalleryImagesProps> = ({ lng }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const { t } = useTranslation(lng);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <Box position='relative' width='100%' height={{ base: '300px', md: '600px' }} overflow='hidden'>
      <Image
        src={images[prevIndex]}
        alt='Previous Image'
        width='100%'
        height='100%'
        objectFit='cover'
        position='absolute'
        transition='opacity 2s ease-in-out'
      />

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <Image src={images[currentIndex]} alt='Product Image' width='100%' height='100%' objectFit='cover' />
      </motion.div>

      <Flex
        direction='column'
        align='center'
        position='absolute'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        zIndex={2}
        textAlign='center'
      >
        <Heading
          fontSize={{ base: '3xl', md: '5xl' }}
          fontWeight='bold'
          color='white'
          textTransform='uppercase'
          letterSpacing='2px'
          mb={4}
          textShadow='2px 4px 6px rgba(0, 0, 0, 0.3)'
        >
          MediX
        </Heading>
        <Button
          size='md'
          mt='10px'
          bg='emerald.600'
          color='white'
          borderRadius='full'
          px={6}
          _hover={{ bg: '#024D3E' }}
          transition='all 0.2s'
          onClick={() => router.push(`/${lng}/about/`)}
        >
          {t('details')}
        </Button>
      </Flex>
    </Box>
  );
};

export default GalleryImages;
