'use client';

import React, { useState } from 'react';

import { Badge, Box, Button, Flex, Heading, Image, Input, Text } from '@chakra-ui/react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@components/ui/dialog';
import { useTranslation } from '@i18n/client';

export interface Product {
  id: number;
  title: string;
  description: string;
  characteristics?: string | null;
  images: string[];
  brand?: string;
  country?: string;
  category?: string;
  price?: number | null;
}

interface ProductProps {
  product: Product;
  lng: string;
}

const ProductView: React.FC<ProductProps> = ({ product, lng }) => {
  const { t } = useTranslation(lng);
  const [orderData, setOrderData] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });

    // Remove error message when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => setShowMore(!showMore);

  const handleSubmitOrder = async () => {
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!orderData.name.trim()) newErrors.name = t('nameRequired');

    if (!orderData.phone.trim()) newErrors.phone = t('phoneRequired');

    if (!orderData.email.trim()) newErrors.email = t('emailRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    console.log('Submitting Order:', orderData);

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          productId: product.id,
          status: 'active',
        }),
      });

      if (response.ok) {
        alert('Order placed successfully!');
      } else {
        alert('Error placing order.');
      }
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  return (
    <Box py={8} px={6} maxW='6xl' mx='auto'>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        {/* Product Images */}
        <Box flex='1' maxW='500px'>
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.title}
            objectFit='contain'
            w='100%'
            h='300px'
            borderRadius='md'
            mb={4}
          />
          {product.images.length > 1 && (
            <Flex gap={2} overflowX='auto'>
              {product.images.map(img => (
                <Image
                  key={img}
                  src={img}
                  alt='Thumbnail'
                  w='80px'
                  h='80px'
                  objectFit='cover'
                  borderRadius='md'
                  cursor='pointer'
                  _hover={{ opacity: 0.8 }}
                />
              ))}
            </Flex>
          )}
        </Box>

        {/* Product Info */}
        <Box flex='1'>
          <Heading size='lg'>{product.title}</Heading>
          <Text fontSize='md' color='gray.600' mt={2}>
            {product.brand && (
              <Badge colorScheme='blue' mr={2}>
                {product.brand}
              </Badge>
            )}
            {product.country && <Badge colorScheme='green'>{product.country}</Badge>}
          </Text>
          <Text mt={4} fontSize='lg'>
            {product.description}
          </Text>
          {product.price && (
            <Text fontSize='xl' fontWeight='bold' color='teal.500' mt={3}>
              ${product.price.toFixed(2)}
            </Text>
          )}

          {/* Order Dialog Trigger */}
          <DialogRoot>
            <DialogTrigger asChild>
              <Button size='sm' mt='30px' bg='#24BEE0' color='white' borderRadius='27px'>
                {t('order')}
              </Button>
            </DialogTrigger>

            {/* Order Dialog */}
            <DialogContent>
              <DialogHeader>
                <Heading size='md'>{t('confirmOrder')}</Heading>
              </DialogHeader>
              <DialogBody>
                {/* Product Preview */}
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

                {/* Order Form */}
                <Box>
                  <label>{t('name')}</label>
                  <Input
                    name='name'
                    placeholder={t('enterName')}
                    onChange={handleChange}
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
                  <label>{t('phone')}</label>
                  <Input
                    type='tel'
                    name='phone'
                    placeholder={t('enterPhone')}
                    onChange={handleChange}
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
                  <label>{t('email')}</label>
                  <Input
                    type='email'
                    name='email'
                    placeholder={t('enterEmail')}
                    onChange={handleChange}
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
                <Button colorScheme='blue' onClick={handleSubmitOrder}>
                  {t('submitOrder')}
                </Button>
                <DialogCloseTrigger>
                  <Button variant='ghost'>{t('cancel')}</Button>
                </DialogCloseTrigger>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Flex>

      {/* Show More Toggle */}
      <Box mt={6} borderTop='1px solid' borderColor='gray.300' pt={4}>
        <Button size='sm' onClick={toggleShowMore} variant='outline' colorScheme='blue'>
          {showMore ? t('hideDetails') : t('showMore')}
        </Button>

        {showMore && (
          <Box mt={4}>
            <Heading size='md' mb={2}>
              {t('detailedDescription')}
            </Heading>
            <Text>{product.description}</Text>
            {product.characteristics && (
              <>
                <Heading size='md' mt={4} mb={2}>
                  {t('characteristics')}
                </Heading>
                <Text>{product.characteristics}</Text>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductView;
