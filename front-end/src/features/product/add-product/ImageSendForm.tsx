'use client';

import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';

import { Box, Button, Input, Stack, Textarea } from '@chakra-ui/react';

function ImageSendForm() {
  const [images, setImages] = useState<File[] | null>(null);
  const [caption, setCaption] = useState('');
  const imagesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!images || images.length === 0) {
      return;
    }

    const formData = new FormData();

    images.forEach(f => formData.append('image', f));
    formData.append('title', 'title');
    formData.append('description', caption);
    formData.append('country', 'country');

    try {
      await axios.post('/api/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImages(null);
      setCaption('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box p={6} w='100%' maxW='md' borderWidth={1} borderRadius='lg' boxShadow='lg'>
      <form onSubmit={onSubmit} encType='multipart/form-data'>
        <Stack>
          <Input type='text' placeholder='Назва' />
          <Input type='text' placeholder='Бренд' />
          <Input type='file' placeholder='Країна' />
          <Textarea
            value={caption}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
            placeholder='Опис'
            size='md'
          />
          <Button type='submit' colorScheme='blue' size='lg'>
            Добавить
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default ImageSendForm;
