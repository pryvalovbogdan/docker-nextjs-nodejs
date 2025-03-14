'use client';

import React, { useState } from 'react';

import { createOrder } from '@/entities/order/api';
import { IProductResponse } from '@/entities/product/model/types';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Toaster, toaster } from '@/shared/ui/toaster';
import { getInnerText } from '@/shared/utils';
import { Box, Button, Flex, Heading, Image, Input, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

interface OrderDialogProps {
  product: IProductResponse;
  lng: string;
}

const OrderDialog: React.FC<OrderDialogProps> = ({ product, lng }) => {
  const { t } = useTranslation(lng);

  const [orderData, setOrderData] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmitOrder = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!orderData.name.trim()) newErrors.name = t('nameRequired');

    if (!orderData.phone.trim()) newErrors.phone = t('phoneRequired');

    if (!orderData.email.trim()) newErrors.email = t('emailRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    setIsSubmitting(true);

    const result = await createOrder({ ...orderData, productId: product.id });

    if (result.success) {
      toaster.create({ type: 'success', title: t('orderSuccess') });
      setOrderData({ name: '', phone: '', email: '' });
      setIsOpen(false);
    } else {
      toaster.error({ title: t('orderFailed'), description: result.message });
    }

    setIsSubmitting(false);
  };

  const isMobile = useIsMobile();

  return (
    <>
      <DialogRoot size={isMobile ? 'full' : 'md'} lazyMount open={isOpen} onOpenChange={e => setIsOpen(e.open)}>
        <DialogTrigger asChild>
          <Button
            size='md'
            mt='30px'
            bg='#036753'
            color='white'
            borderRadius='full'
            px={6}
            _hover={{ bg: '#024D3E' }}
            transition='all 0.2s'
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(true);
            }}
          >
            {t('order')}
          </Button>
        </DialogTrigger>

        <DialogContent bg='white' borderRadius='lg' boxShadow='xl' p={6}>
          <DialogHeader>
            <Heading size='md' color='gray.800'>
              {t('confirmOrder')}
            </Heading>
          </DialogHeader>

          <DialogBody>
            <Flex gap={4} mb={4} align='center'>
              <Image
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.title}
                w='80px'
                h='80px'
                objectFit='cover'
                borderRadius='md'
              />
              <Box>
                <Heading size='sm' color='gray.800'>
                  {product.title}
                </Heading>
                <Text fontSize='sm' color='gray.600'>
                  {getInnerText(product.description || '')?.substring(0, 100)}...
                </Text>
              </Box>
            </Flex>

            {['name', 'phone', 'email'].map(field => (
              <Box key={field} mt={4}>
                <label htmlFor={field}>
                  <Text fontSize='sm' fontWeight='bold' color='gray.800'>
                    {t(field as any)}
                  </Text>
                </label>
                <Input
                  id={field}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={t(`enter${field.charAt(0).toUpperCase() + field.slice(1)}` as any)}
                  onChange={handleChange}
                  value={orderData[field as keyof typeof orderData]}
                  mt={2}
                  borderColor={errors[field] ? 'red.500' : 'gray.300'}
                  _focus={{ borderColor: '#036753', boxShadow: '0 0 5px rgba(3, 103, 83, 0.5)' }}
                  bg='gray.50'
                />
                {errors[field] && (
                  <Text color='red.500' fontSize='sm' mt={1}>
                    {errors[field]}
                  </Text>
                )}
              </Box>
            ))}
          </DialogBody>

          <DialogFooter>
            <Button
              color='white'
              bg='#036753'
              _hover={{ bg: '#024D3E' }}
              borderRadius='full'
              px={6}
              onClick={handleSubmitOrder}
              loading={isSubmitting}
            >
              {t('submitOrder')}
            </Button>
            <DialogCloseTrigger asChild>
              <Button variant='ghost' onClick={() => setIsOpen(false)}>
                {t('cancel')}
              </Button>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      <Toaster />
    </>
  );
};

export default OrderDialog;
