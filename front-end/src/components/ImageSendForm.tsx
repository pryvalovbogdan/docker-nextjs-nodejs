'use client';

import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';

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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} encType='multipart/form-data'>
        <input onChange={imagesSelected} type='file' accept='image/*' multiple />
        <input
          value={caption}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCaption(e.target.value)}
          type='text'
          placeholder='Caption'
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default ImageSendForm;
