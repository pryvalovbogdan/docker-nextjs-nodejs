'use client';

import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { createCategory, createSubCategory } from '@/entities/category/api';
import { createOrder } from '@/entities/order/api';
import { createProduct } from '@/entities/product/api';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/shared/ui/dialog';
import { toaster } from '@/shared/ui/toaster';
import { Box, Button, Flex, Heading, IconButton, Image, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import { addEntityDashboardFields } from '@features/entitiy/utils/config';
import { PaginatedData, TabKey } from '@features/entitiy/utils/types';

interface IAddEntityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: TabKey;
  tab: 'orders' | 'products' | 'admins' | 'categories' | 'subcategories';
  t: TFunction;
  setData: React.Dispatch<React.SetStateAction<Record<TabKey, PaginatedData>>>;
  currentPage: number;
  setIsDialogOpen: (isOpen: boolean) => void;
}

type CreateFunction = (formData: any, token?: string) => Promise<any>;

const createFunctions: Record<TabKey, CreateFunction> = {
  orders: (formData, token = '') => createOrder(formData, token),
  products: (formData, token = '') => createProduct(formData, token),
  categories: (body, token = '') => createCategory(body, token),
  subcategories: (body, token = '') => createSubCategory(body, token),
};

const AddEntityDialog: React.FC<IAddEntityDialogProps> = ({
  isOpen,
  onClose,
  tab,
  t,
  selectedTab,
  currentPage,
  setData,
  setIsDialogOpen,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleAddEntity = async (formData: any) => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
      const response = await createFunctions[selectedTab](formData, token);

      console.log('response', response);

      if (response.success) {
        toaster.create({ type: 'success', title: `${t(`tabs.${selectedTab}`)} ${t('addSuccess')}` });

        setData(prev => ({
          ...prev,
          [selectedTab]: {
            ...prev[selectedTab],
            pages: {
              ...prev[selectedTab].pages,
              [currentPage]: [response.data, ...(prev[selectedTab].pages[currentPage] || [])],
            },
          },
        }));

        setIsDialogOpen(false);
      } else {
        toaster.create({ type: 'error', title: `${t('addError')} ${t(`tabs.${selectedTab}`)}` });
      }
    } catch (error) {
      toaster.create({ type: 'error', title: `${t('addError')} ${t(`tabs.${selectedTab}`)}` });
    }
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

  const handleSubmit = async () => {
    const requiredFields = addEntityDashboardFields[tab].filter(field => field.required).map(field => field.name);
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
        } else if (key === 'subCategory') {
          formDataToSend.append(key, JSON.stringify({ name: value }));
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    selectedImages.forEach(image => formDataToSend.append('image', image));

    setIsSubmitting(true);
    await handleAddEntity(tab === 'products' ? formDataToSend : Object.fromEntries(formDataToSend.entries()));
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
          <VStack align='stretch'>
            {addEntityDashboardFields[tab].map(({ name, type, required, translateKey }) => (
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
                    rows={6}
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
            <Button colorScheme='green' mr={3} loading={isSubmitting} onClick={handleSubmit}>
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
