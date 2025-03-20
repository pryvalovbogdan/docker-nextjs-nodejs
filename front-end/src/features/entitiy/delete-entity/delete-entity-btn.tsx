import { TFunction } from 'i18next';
import React from 'react';

import { deleteOrder } from '@/entities/order/api';
import { deleteProduct } from '@/entities/product/api';
import { toaster } from '@/shared/ui/toaster';
import { Button } from '@chakra-ui/react';
import { PaginatedData, TabKey } from '@features/entitiy/utils/types';

interface IDeleteEntityBtn {
  t: TFunction;
  selectedTab: TabKey;
  setData: React.Dispatch<React.SetStateAction<Record<TabKey, PaginatedData>>>;
  currentPage: number;
  id: string;
}
const DeleteEntityBtn = ({ t, selectedTab, setData, currentPage, id }: IDeleteEntityBtn) => {
  const deleteFunctions: Record<TabKey, (token: string, id: string) => Promise<any>> = {
    orders: deleteOrder,
    products: deleteProduct,
  };

  const handleDelete = async (id: string) => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
      const { success } = await deleteFunctions[selectedTab](token, id);

      if (success) {
        toaster.create({ type: 'success', title: `${t(`tabs.${selectedTab}`)} ${t('deleteSuccess')}` });
      } else {
        toaster.create({ type: 'error', title: `${t('deleteError')} ${t(`tabs.${selectedTab}`)}` });

        return;
      }

      setData(prev => ({
        ...prev,
        [selectedTab]: {
          ...prev[selectedTab],
          pages: {
            ...prev[selectedTab].pages,
            [currentPage]: prev[selectedTab].pages[currentPage]?.filter(item => item.id !== id) || [],
          },
        },
      }));
    } catch (error) {
      toaster.create({ type: 'error', title: `${t('deleteError')} ${t(`tabs.${selectedTab}`)}` });
      console.error(`Error deleting ${selectedTab}:`, error);
    }
  };

  return (
    <Button size='sm' colorScheme='red' onClick={() => handleDelete(id)}>
      {t('delete')}
    </Button>
  );
};

export default DeleteEntityBtn;
