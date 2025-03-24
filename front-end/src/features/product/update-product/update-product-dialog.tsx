'use client';

import { TFunction } from 'i18next';
import React, { useState } from 'react';

import { updateProduct } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/shared/ui/dialog';
import { toaster } from '@/shared/ui/toaster';
import { Box, Button, Flex, Heading, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import { PaginatedData, TabKey } from '@features/entitiy';
import { addEntityDashboardFields } from '@features/entitiy/utils/config';

interface IUpdateProductDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  t: TFunction;
  setIsDialogOpen: (isOpen: boolean) => void;
  data: IProductResponse;
  setData: React.Dispatch<React.SetStateAction<Record<TabKey, PaginatedData>>>;
  currentPage: number;
}

const UpdateProductDialog: React.FC<IUpdateProductDialogProps> = ({
  isOpen,
  onClose,
  t,
  setIsDialogOpen,
  data,
  setData,
  currentPage,
}) => {
  const mappedData = { ...data, category: data.category.name, subCategory: data.subCategory?.name || null };
  const [formData, setFormData] = useState<Record<string, any>>(mappedData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProduct = async (formData: any) => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
      const response = await updateProduct(formData, token, data?.id || 1);

      if (response.success) {
        toaster.create({ type: 'success', title: `${t(`tabs.products`)} ${t('addSuccess')}` });

        setData(prev => {
          return {
            ...prev,
            products: {
              ...prev.products,
              pages: {
                ...prev.products.pages,
                [currentPage]: prev.products.pages[currentPage].map(item => {
                  if (item.id === response.data?.id) {
                    return response.data;
                  }

                  return item;
                }),
              },
            },
          };
        });

        setIsDialogOpen(false);
      } else {
        toaster.create({ type: 'error', title: `${t('addError')} ${t(`tabs.products`)}` });
      }
    } catch (error) {
      toaster.create({ type: 'error', title: `${t('addError')} ${t(`tabs.products`)}` });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    const requiredFields = addEntityDashboardFields.products.filter(field => field.required).map(field => field.name);
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

    setIsSubmitting(true);
    await handleUpdateProduct(formDataToSend);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    setIsDialogOpen(false);
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={e => !e.open && handleClose()}>
      <DialogContent bg='white' borderRadius='lg' boxShadow='xl' p={6}>
        <DialogHeader>
          <Heading size='md'>
            {t(`update`)} {t(`tabs.products`)}
          </Heading>
        </DialogHeader>

        <DialogBody>
          <VStack align='stretch'>
            {addEntityDashboardFields.products.map(({ name, type, required, translateKey }) => {
              return (
                <Box key={name}>
                  <Text fontSize='sm' fontWeight='bold' color='gray.800'>
                    {t(translateKey || name)} {required && '*'}
                  </Text>
                  {type === 'textarea' ? (
                    <Textarea
                      name={name}
                      value={formData[name] || mappedData?.[name] || ''}
                      onChange={handleChange}
                      borderColor={errors[name] ? 'red.500' : 'gray.300'}
                      bg='gray.50'
                      mt={1}
                    />
                  ) : (
                    <Input
                      name={name}
                      type={type || 'text'}
                      value={formData[name] || mappedData?.[name] || ''}
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
              );
            })}
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Flex justify='flex-end' w='100%'>
            <Button colorScheme='green' mr={3} loading={isSubmitting} onClick={handleSubmit}>
              {t('update')}
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

export default UpdateProductDialog;
