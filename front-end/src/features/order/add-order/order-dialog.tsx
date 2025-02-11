'use client';

import React, { useState } from 'react';

import { submitOrder } from '@/entities/order/api';
import { Product } from '@/entities/product/model/types';
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
import { Box, Button, Flex, Heading, Image, Input, Text } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

interface OrderDialogProps {
  product: Product;
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

    const result = await submitOrder({ ...orderData, productId: product.id });

    if (result.success) {
      toaster.create({ type: 'info', title: t('orderSuccess') });
    } else {
      toaster.error({ title: t('orderFailed'), description: result.message });
    }

    setOrderData({ name: '', phone: '', email: '' });
    setIsSubmitting(false);
    setIsOpen(false);
  };

  const isMobile = useIsMobile();

  return (
    <>
      <DialogRoot size={isMobile ? 'full' : 'md'} lazyMount open={isOpen} onOpenChange={e => setIsOpen(e.open)}>
        <DialogTrigger asChild>
          <Button
            size='sm'
            mt='30px'
            bg='#24BEE0'
            color='white'
            borderRadius='27px'
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(true);
            }}
          >
            {t('order')}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <Heading size='md'>{t('confirmOrder')}</Heading>
          </DialogHeader>
          <DialogBody>
            <Flex gap={4} mb={4}>
              <Image
                src={product.images[0] || '/placeholder.png'}
                alt={product.title}
                w='80px'
                h='80px'
                objectFit='cover'
                borderRadius='md'
              />
              <Box>
                <Heading size='sm'>{product.title}</Heading>
                <Text fontSize='sm'>{product.description.substring(0, 50)}...</Text>
              </Box>
            </Flex>

            <Box>
              <label htmlFor='name'>{t('name')}</label>
              <Input
                id='name'
                name='name'
                placeholder={t('enterName')}
                onChange={handleChange}
                value={orderData.name}
                mt={2}
                borderColor={errors.name ? 'red.500' : 'gray.200'}
              />
              {errors.name && (
                <Text color='red.500' fontSize='sm'>
                  {errors.name}
                </Text>
              )}
            </Box>

            <Box mt={4}>
              <label htmlFor='phone'>{t('phone')}</label>
              <Input
                id='phone'
                type='tel'
                name='phone'
                placeholder={t('enterPhone')}
                onChange={handleChange}
                value={orderData.phone}
                mt={2}
                borderColor={errors.phone ? 'red.500' : 'gray.200'}
              />
              {errors.phone && (
                <Text color='red.500' fontSize='sm'>
                  {errors.phone}
                </Text>
              )}
            </Box>

            <Box mt={4}>
              <label htmlFor='email'>{t('email')}</label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder={t('enterEmail')}
                onChange={handleChange}
                value={orderData.email}
                mt={2}
                borderColor={errors.email ? 'red.500' : 'gray.200'}
              />
              {errors.email && (
                <Text color='red.500' fontSize='sm'>
                  {errors.email}
                </Text>
              )}
            </Box>
          </DialogBody>
          <DialogFooter>
            <Button colorScheme='blue' onClick={handleSubmitOrder} disabled={isSubmitting}>
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
