import React from 'react';

import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { DialogBody, DialogContent, DialogRoot } from '@/shared/ui/dialog';
import { IconButton, Image } from '@chakra-ui/react';
import { ImageButtons } from '@widgets/image-dialog/ui';

interface ImageDialogProps {
  images: string[];
  currentIndex: number;
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  goToPreviousImage: () => void;
  goToNextImage: () => void;
  selectedImage: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  images,
  currentIndex,
  isDialogOpen,
  setDialogOpen,
  goToPreviousImage,
  goToNextImage,
  selectedImage,
}) => {
  const isMobile = useIsMobile();

  return (
    <DialogRoot
      size={isMobile ? 'full' : 'md'}
      lazyMount
      open={isDialogOpen}
      onOpenChange={e => !e.open && setDialogOpen(false)}
    >
      <DialogContent
        position='relative'
        bg='transparent'
        boxShadow='none'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <DialogBody display='flex' alignItems='center' justifyContent='center' position='relative'>
          {images.length > 1 && (
            <ImageButtons
              images={images}
              goToNextImage={goToNextImage}
              goToPreviousImage={goToPreviousImage}
              currentIndex={currentIndex}
            />
          )}
          <Image
            src={selectedImage}
            alt='Expanded Image'
            maxH='85vh'
            maxW='85vw'
            minH='80vh'
            objectFit='contain'
            borderRadius='md'
          />
          <IconButton
            aria-label='Next image'
            position='absolute'
            right={isMobile ? '8%' : '4%'}
            top={isMobile ? '35%' : '5%'}
            transform='translateY(-50%)'
            bg='emerald.700'
            color='white'
            boxShadow='md'
            _hover={{ bg: 'emerald.500' }}
            transition='all 0.3s'
            cursor='pointer'
            onClick={() => setDialogOpen(false)}
          >
            ✖
          </IconButton>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default ImageDialog;
