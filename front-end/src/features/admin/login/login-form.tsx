'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { login } from '@/entities/admin/api';
import { toaster } from '@/shared/ui/toaster';
import { Box, Button, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const LoginForm = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', passwordHash: '' });
  const [errors, setErrors] = useState<{ username?: string; passwordHash?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { username?: string; passwordHash?: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = t('login.errorUsername');
    }

    if (!formData.passwordHash.trim()) {
      newErrors.passwordHash = t('login.errorPassword');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    const result = await login(formData);

    console.log('result', result);

    if (result.success && result.token) {
      toaster.create({ type: 'info', title: t('login.loginSuccess') });
      sessionStorage.setItem('token', result.token);

      router.push(`/${lng}/admin/dashboard`);
    } else {
      toaster.error({ title: t('login.loginFailed') });
    }

    console.log('Login Data:', formData);
  };

  return (
    <Flex height='100vh' alignItems='center' justifyContent='center'>
      <Box maxW='400px' w='full' p='6' borderWidth='1px' borderRadius='lg' boxShadow='lg'>
        <Heading size='lg' mb='6' textAlign='center'>
          {t('login.title')}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing='4'>
            <Input
              placeholder={t('login.username')}
              name='username'
              value={formData.username}
              onChange={handleChange}
              borderColor={errors.username ? 'red.500' : 'gray.300'}
              mb={errors.username ? 0 : '29px'}
            />
            {errors.username && (
              <Text color='red.500' fontSize='sm'>
                {errors.username}
              </Text>
            )}

            <Input
              placeholder={t('login.password')}
              name='passwordHash'
              type='password'
              value={formData.password}
              onChange={handleChange}
              borderColor={errors.password ? 'red.500' : 'gray.300'}
              mb={errors.password ? 0 : '29px'}
            />
            {errors.password && (
              <Text color='red.500' fontSize='sm'>
                {errors.password}
              </Text>
            )}

            <Button colorScheme='blue' type='submit' width='full'>
              {t('login.submit')}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginForm;
