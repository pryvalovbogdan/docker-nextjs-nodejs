import { TFunction } from 'i18next';
import React from 'react';

import { exportProductsJson } from '@/entities/product/api';
import { toaster } from '@/shared/ui/toaster';
import { Button } from '@chakra-ui/react';

interface IDownloadEntityJsonBtn {
  selectedTab?: 'orders' | 'products';
  t: TFunction;
}

const DownloadEntityJsonBtn = ({ selectedTab = 'products', t }: IDownloadEntityJsonBtn) => {
  const handleDownloadJson = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
      const response = await exportProductsJson(token);

      if (response.success && response?.data) {
        const jsonBlob = new Blob([response.data], { type: 'application/json;charset=utf-8;' });

        const url = window.URL.createObjectURL(jsonBlob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${selectedTab}_export.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toaster.create({
          type: 'success',
          title: `${t(`tabs.${selectedTab}`)} ${t('downloadSuccess')}`,
        });
      } else {
        toaster.create({
          type: 'error',
          title: `${t('downloadError')} ${t(`tabs.${selectedTab}`)}`,
        });
      }
    } catch (error) {
      console.error(`Error downloading ${selectedTab} JSON:`, error);

      toaster.create({
        type: 'error',
        title: `${t('downloadError')} ${t(`tabs.${selectedTab}`)}`,
      });
    }
  };

  return (
    <Button colorScheme='green' onClick={handleDownloadJson} mr={2}>
      {t('downloadJson')}
    </Button>
  );
};

export default DownloadEntityJsonBtn;
