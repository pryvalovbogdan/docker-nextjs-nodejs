'use client';

import React, { FormEvent, useState } from 'react';

import { contact } from '@/shared/api/contact';
import { Toaster, toaster } from '@/shared/ui/toaster';
import { Box, Button, Flex, Grid, Heading, Input, Text, Textarea } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const ContactForm = ({ lng, withMargin }: { lng: string; withMargin?: boolean }) => {
  const { t } = useTranslation(lng);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    message: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', message: '' };

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
      valid = false;
    }

    if (!formData.message?.trim()) {
      newErrors.message = t('messageRequired');
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('messageTooShort');
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  async function onSubmit(event: FormEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await contact(formData);

    if (result.success) {
      toaster.create({ type: 'info', title: t('applicationAccepted') });
    } else {
      toaster.error({ title: t('applicationFailed') });
    }

    setIsLoading(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <Box as='section' id='contact' py={20} mx={withMargin ? 5 : 0} bg='white'>
      <Heading as='h3' fontSize='36px' textAlign='center' mb='52px' color='gray.800'>
        {t('contactUs')}
      </Heading>
      <Box
        as='form'
        maxW='900px'
        mx='auto'
        p={10}
        bg='rgba(3, 103, 83, 0.7)'
        backdropFilter='blur(12px)'
        borderRadius='lg'
        boxShadow='lg'
        onSubmit={onSubmit}
      >
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={6}>
          {['name', 'phone', 'email'].map(field => (
            <Box key={field} mt={4}>
              <Input
                id={field}
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                placeholder={t(`enter${field.charAt(0).toUpperCase() + field.slice(1)}` as any)}
                onChange={handleInputChange}
                value={formData[field as keyof typeof formData]}
                mt={2}
                borderColor={errors[field] ? 'red.500' : 'gray.300'}
                w='100%'
                h='50px'
                fontSize='md'
                bg='white'
                color='gray.800'
                borderRadius='md'
                border='1px solid gray.300'
                px={4}
                _focus={{ borderColor: '#036753', boxShadow: '0 0 5px rgba(3, 103, 83, 0.5)' }}
              />
              {errors[field] && (
                <Text color='red.500' fontSize='sm' mt={1}>
                  {errors[field]}
                </Text>
              )}
            </Box>
          ))}
        </Grid>

        <Box mb={6}>
          <Textarea
            name='message'
            placeholder={t('yourMessage')}
            value={formData.message}
            onChange={handleInputChange}
            w='100%'
            h='150px'
            fontSize='md'
            bg='white'
            color='gray.800'
            borderRadius='md'
            border='1px solid gray.300'
            px={4}
            py={3}
            _focus={{ borderColor: '#036753', boxShadow: '0 0 5px rgba(3, 103, 83, 0.5)' }}
          />
          {errors.message && (
            <Text color='red.500' fontSize='sm' mt={1}>
              {errors.message}
            </Text>
          )}
        </Box>

        <Flex justify='center'>
          <Button
            disabled={isLoading}
            type='submit'
            w={{ base: '100%', md: '250px' }}
            h='50px'
            fontSize='md'
            bg='#036753'
            color='white'
            borderRadius='full'
            px={6}
            _hover={{ bg: '#024D3E' }}
            transition='all 0.2s'
          >
            {t('submit')}
          </Button>
        </Flex>
      </Box>
      <Toaster />
    </Box>
  );
};

export default ContactForm;
