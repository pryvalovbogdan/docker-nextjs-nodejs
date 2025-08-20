import { TFunction } from 'i18next';
import React from 'react';

import { exportOrders } from '@/entities/order/api';
import { exportProducts } from '@/entities/product/api';
import { toaster } from '@/shared/ui/toaster';
import { Button } from '@chakra-ui/react';

const exportCSvFunctions: Record<'orders' | 'products', (token: string) => Promise<any>> = {
  orders: exportOrders,
  products: exportProducts,
};

interface IDownloadEntityBtn {
  selectedTab: 'orders' | 'products';
  t: TFunction;
}
const DownloadEntityBtn = ({ selectedTab, t }: IDownloadEntityBtn) => {
  const handleDownloadCsv = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
      const response = await exportCSvFunctions[selectedTab](token);

      if (response.success && response.data) {
        // Convert CSV string to a Blob
        const csvBlob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });

        // Create a URL for the Blob and trigger download
        const url = window.URL.createObjectURL(csvBlob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${selectedTab}_export.csv`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toaster.create({ type: 'success', title: `${t(`tabs.${selectedTab}`)} ${t('downloadSuccess')}` });
      } else {
        toaster.create({ type: 'error', title: `${t('downloadError')} ${t(`tabs.${selectedTab}`)}` });
      }
    } catch (error) {
      console.error(`Error downloading ${selectedTab} CSV:`, error);
      toaster.create({ type: 'error', title: `${t('downloadError')} ${t(`tabs.${selectedTab}`)}` });
    }
  };

  return (
    <Button colorScheme='blue' onClick={handleDownloadCsv} mr={2}>
      {t('downloadCsv')} {t(`tabs.${selectedTab}`)}
    </Button>
  );
};

export default DownloadEntityBtn;
