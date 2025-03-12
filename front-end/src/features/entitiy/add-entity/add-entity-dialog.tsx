'use client';

import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/shared/ui/dialog';
import { Box, Button, Flex, Heading, IconButton, Image, Input, Text, Textarea, VStack } from '@chakra-ui/react';

interface AddEntityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any, token: string) => void;
  tab: 'orders' | 'products' | 'admins';
  t: (key: string) => string;
}

const AddEntityDialog: React.FC<AddEntityDialogProps> = ({ isOpen, onClose, onSubmit, tab, t }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const fieldConfigs: Record<
    'orders' | 'products' | 'admins',
    { name: string; type?: string; required?: boolean; translateKey?: string }[]
  > = {
    orders: [
      { name: 'name', required: true },
      { name: 'phone', required: true },
      { name: 'email', type: 'email' },
      { name: 'date', type: 'date' },
      { name: 'productId' },
    ],
    products: [
      { name: 'title', required: true, translateKey: 'columns.title' },
      { name: 'description', type: 'textarea', translateKey: 'columns.description' },
      { name: 'brand', translateKey: 'columns.brand' },
      { name: 'category', required: true, translateKey: 'columns.category' },
      { name: 'subcategory', translateKey: 'columns.subcategory' },
      { name: 'country', translateKey: 'columns.country' },
    ],
    admins: [
      { name: 'columns.username', required: true },
      { name: 'columns.password', type: 'password', required: true },
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const token = sessionStorage.getItem('token');

  const handleSubmit = async () => {
    const requiredFields = fieldConfigs[tab].filter(field => field.required).map(field => field.name);
    const newErrors: Record<string, string> = {};

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = t('fieldRequired');
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'category') {
          formDataToSend.append(key, JSON.stringify({ name: value }));
        } else if (key === 'subcategory') {
          formDataToSend.append(key, JSON.stringify({ name: value }));
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    selectedImages.forEach(image => formDataToSend.append('image', image));

    setIsSubmitting(true);
    await onSubmit(tab === 'products' ? formDataToSend : Object.fromEntries(formDataToSend.entries()), token);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    setSelectedImages([]);
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={e => !e.open && handleClose()}>
      <DialogContent bg='white' borderRadius='lg' boxShadow='xl' p={6}>
        <DialogHeader>
          <Heading size='md'>
            {t(`add`)} {t(`tabs.${tab}`)}
          </Heading>
        </DialogHeader>

        <DialogBody>
          <VStack spacing={4} align='stretch'>
            {fieldConfigs[tab].map(({ name, type, required, translateKey }) => (
              <Box key={name}>
                <Text fontSize='sm' fontWeight='bold' color='gray.800'>
                  {t(translateKey || name)} {required && '*'}
                </Text>
                {type === 'textarea' ? (
                  <Textarea
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    borderColor={errors[name] ? 'red.500' : 'gray.300'}
                    bg='gray.50'
                    mt={1}
                  />
                ) : (
                  <Input
                    name={name}
                    type={type || 'text'}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    borderColor={errors[name] ? 'red.500' : 'gray.300'}
                    bg='gray.50'
                    mt={1}
                  />
                )}
                {errors[name] && (
                  <Text color='red.500' fontSize='sm'>
                    {errors[name]}
                  </Text>
                )}
              </Box>
            ))}

            {tab === 'products' && (
              <Box>
                <Text fontSize='sm' fontWeight='bold' color='gray.800'>
                  {t('images')}
                </Text>
                <Input type='file' multiple accept='image/*' onChange={handleImageUpload} />
                {errors.images && (
                  <Text color='red.500' fontSize='sm'>
                    {errors.images}
                  </Text>
                )}
                <Flex mt={2} gap={2} flexWrap='wrap'>
                  {selectedImages.map((file, index) => (
                    <Box key={index} position='relative' border='1px solid gray' borderRadius='md' p={1}>
                      <Image src={URL.createObjectURL(file)} alt='preview' boxSize='80px' objectFit='cover' />
                      <IconButton
                        size='xs'
                        aria-label='Remove image'
                        color='white'
                        bg='emerald.800'
                        position='absolute'
                        top='-6px'
                        right='-6px'
                        onClick={() => handleRemoveImage(index)}
                      >
                        <AiOutlineCloseCircle />
                      </IconButton>
                    </Box>
                  ))}
                </Flex>
              </Box>
            )}
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Flex justify='flex-end' w='100%'>
            <Button colorScheme='green' mr={3} isLoading={isSubmitting} onClick={handleSubmit}>
              {t('create')}
            </Button>
            <DialogCloseTrigger asChild>
              <Button variant='outline' onClick={onClose}>
                {t('cancel')}
              </Button>
            </DialogCloseTrigger>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddEntityDialog;
