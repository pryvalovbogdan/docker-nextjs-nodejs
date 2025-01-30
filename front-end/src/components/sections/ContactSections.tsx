'use client';

import axios from 'axios';
import React, { FormEvent, useState } from 'react';

import { Box, Button, Heading, Input, Textarea } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const ContactSection = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);

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

    try {
      await axios.post('/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error when user starts typing
  };

  return (
    <Box as='section' id='contact' py={20} bg='white'>
      <Heading as='h3' fontSize='48px' textAlign='center' mb='52px' color='#062126'>
        {t('contactUs')}
      </Heading>
      <Box as='form' maxW='lg' mx='auto' display='flex' alignItems='center' flexDirection='column' onSubmit={onSubmit}>
        <Input
          name='name'
          placeholder={t('yourName')}
          value={formData.name}
          onChange={handleInputChange}
          mb={4}
          bg='FCFCFC'
          color='rgba(6, 33, 38, 0.50)'
          borderRadius='10px'
          border='1px solid rgba(0, 0, 0, 0.05)'
        />

        <div style={{ width: '100%', marginBottom: '16px' }}>
          <Input
            name='email'
            type='email'
            placeholder={t('yourEmail')}
            value={formData.email}
            onChange={handleInputChange}
            bg='FCFCFC'
            color='rgba(6, 33, 38, 0.50)'
            borderRadius='10px'
            border='1px solid rgba(0, 0, 0, 0.05)'
            style={errors.email ? { borderColor: 'red' } : {}}
          />
          {errors.email && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.email}</div>}
        </div>

        <Input
          name='phone'
          type='tel'
          placeholder={t('yourPhone')}
          value={formData.phone}
          onChange={handleInputChange}
          mb={4}
          bg='FCFCFC'
          color='rgba(6, 33, 38, 0.50)'
          borderRadius='10px'
          border='1px solid rgba(0, 0, 0, 0.05)'
        />

        <div style={{ width: '100%', marginBottom: '16px' }}>
          <Textarea
            name='message'
            placeholder={t('yourMessage')}
            value={formData.message}
            onChange={handleInputChange}
            color='rgba(6, 33, 38, 0.50)'
            borderRadius='10px'
            border='1px solid rgba(0, 0, 0, 0.05)'
            style={errors.message ? { borderColor: 'red' } : {}}
          />
          {errors.message && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.message}</div>}
        </div>

        <Button type='submit' bg='#24BEE0' color='white' borderRadius='47px' display='inline-flex' w='auto'>
          {t('submit')}
        </Button>
      </Box>
    </Box>
  );
};

export default ContactSection;
