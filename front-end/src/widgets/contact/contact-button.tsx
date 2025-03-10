'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

import { contact } from '@/shared/api/contact';
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
import { Box, Button, Heading, IconButton, Input, Text, Textarea } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';

const MotionBox = motion(Box);

const ContactButton = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);
  const [showText, setShowText] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setShowText(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.phone.trim()) newErrors.phone = t('phoneRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    setIsLoading(true);
    const result = await contact({ ...formData, contact: true });

    if (result.success) {
      toaster.create({ type: 'info', title: t('applicationAccepted') });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsOpen(false);
    } else {
      toaster.error({ title: t('applicationFailed') });
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <>
      <DialogRoot size={isMobile ? 'full' : 'md'} lazyMount open={isOpen} onOpenChange={e => setIsOpen(e.open)}>
        <DialogTrigger asChild>
          <Box
            width='100px'
            height='100px'
            position='fixed'
            bottom='12%'
            right={isMobile ? '10%' : '5%'}
            zIndex='1000'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
          >
            <Box
              position='relative'
              width='120%'
              height='120%'
              display='flex'
              alignItems='center'
              justifyContent='center'
              borderRadius='full'
              overflow='hidden'
            >
              <MotionBox
                position='absolute'
                width='100%'
                height='100%'
                borderRadius='full'
                bg='teal.700'
                opacity={0.3}
                zIndex={-1}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <MotionBox
                position='absolute'
                width='80%'
                height='80%'
                borderRadius='full'
                bg='teal.600'
                opacity={0.5}
                zIndex={-1}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              />
              <IconButton
                aria-label='Contact Us'
                color='white'
                bg='teal.700'
                _hover={{ bg: 'teal.800' }}
                _active={{ bg: 'teal.900', transform: 'scale(0.9)' }}
                borderRadius='full'
                fontSize='42px'
                width='85px'
                height='85px'
                boxShadow='0px 0px 12px rgba(0, 119, 113, 0.5)'
              >
                <AnimatePresence mode='wait'>
                  {isHovered || showText ? (
                    <motion.div
                      key='text'
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        padding: '5px',
                      }}
                    >
                      <Text fontSize='14px' fontWeight='bold' color='white' lineHeight='1.2'>
                        {t('order')}
                        <br />
                        {t('call')}
                      </Text>
                    </motion.div>
                  ) : (
                    <motion.div
                      key='icon'
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <FaPhoneAlt size={28} color='white' />
                    </motion.div>
                  )}
                </AnimatePresence>
              </IconButton>
            </Box>
          </Box>
        </DialogTrigger>
        <DialogContent bg='white' borderRadius='lg' boxShadow='xl' p={6}>
          <DialogHeader>
            <Heading size='md' color='gray.800'>
              {t('contactUs')}
            </Heading>
          </DialogHeader>

          <DialogBody>
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
                  value={formData[field as keyof typeof formData]}
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
            <Text fontSize='sm' fontWeight='bold' color='gray.800' mt={3}>
              {t('message')}
            </Text>
            <Textarea
              name='message'
              placeholder={t('yourMessage')}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              mt={3}
              borderColor={errors.message ? 'red.500' : 'gray.300'}
            />
          </DialogBody>

          <DialogFooter>
            <Button onClick={handleSubmit} isLoading={isLoading} bg='#036753' color='white'>
              {t('submit')}
            </Button>
            <DialogCloseTrigger asChild>
              <Button variant='ghost'>{t('cancel')}</Button>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      <Toaster />
    </>
  );
};

export default ContactButton;
