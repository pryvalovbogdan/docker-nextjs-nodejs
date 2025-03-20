import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { IconButton } from '@chakra-ui/react';

interface ImageButtonsProps {
  currentIndex: number;
  goToPreviousImage: () => void;
  goToNextImage: () => void;
  images: string[];
}
const ImageButtons: React.FC<ImageButtonsProps> = ({ currentIndex, goToPreviousImage, images, goToNextImage }) => {
  return (
    <>
      <IconButton
        aria-label='Previous image'
        position='absolute'
        left='15px'
        top='50%'
        transform='translateY(-50%)'
        bg='emerald.700'
        color='white'
        boxShadow='md'
        _hover={{ bg: 'emerald.500' }}
        transition='all 0.3s'
        disabled={currentIndex === 0}
        opacity={currentIndex === 0 ? 0.4 : 1}
        cursor={currentIndex === 0 ? 'not-allowed' : 'pointer'}
        onClick={goToPreviousImage}
      >
        <FaChevronLeft />
      </IconButton>
      <IconButton
        aria-label='Next image'
        position='absolute'
        right='15px'
        top='50%'
        transform='translateY(-50%)'
        bg='emerald.700'
        color='white'
        boxShadow='md'
        _hover={{ bg: 'emerald.500' }}
        transition='all 0.3s'
        disabled={currentIndex === images.length - 1}
        opacity={currentIndex === images.length - 1 ? 0.4 : 1}
        cursor={currentIndex === images.length - 1 ? 'not-allowed' : 'pointer'}
        onClick={goToNextImage}
      >
        <FaChevronRight />
      </IconButton>
    </>
  );
};

export default ImageButtons;
