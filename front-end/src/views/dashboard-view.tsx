'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { createOrder, deleteOrder, exportOrders, fetchOrders } from '@/entities/order/api';
import {
  createProduct,
  deleteProduct,
  exportProducts,
  fetchProductsOffSet,
  fetchSearchProducts,
} from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import Pagination from '@/shared/ui/pagination';
import SkeletonTable from '@/shared/ui/skeleton-table';
import { Toaster, toaster } from '@/shared/ui/toaster';
import { Box, Button, Flex, HStack, Input, Skeleton, Text, VStack } from '@chakra-ui/react';
import AddEntityDialog from '@features/entitiy/add-entity/add-entity-dialog';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

const PAGE_SIZE = 10;

type TabKey = 'orders' | 'products';

type FetchFunction = (token: string, page: number, pageSize: number) => Promise<any>;
type CreateFunction = (formData: any, token?: string) => Promise<any>;

const fetchDataFunctions: Record<TabKey, FetchFunction> = {
  orders: fetchOrders,
  products: fetchProductsOffSet,
};

const deleteFunctions: Record<TabKey, (token: string, id: string) => Promise<any>> = {
  orders: deleteOrder,
  products: deleteProduct,
};

const createFunctions: Record<TabKey, CreateFunction> = {
  orders: createOrder,
  products: (formData, token = '') => createProduct(formData, token),
};

const exportCSvFunctions: Record<TabKey, (token: string) => Promise<any>> = {
  orders: exportOrders,
  products: exportProducts,
};

type PaginatedData = {
  pages: Record<number, any[]>;
  totalPages: number;
};

const columns = {
  orders: [
    { columnName: 'name', translateKey: 'columns.name' },
    { columnName: 'product.title', translateKey: 'tabs.products' },
    { columnName: 'phone', translateKey: 'columns.phone' },
    { columnName: 'email', translateKey: 'columns.email' },
    { columnName: 'date', translateKey: 'columns.date' },
  ],
  products: [
    { columnName: 'title', translateKey: 'columns.title' },
    { columnName: 'description', translateKey: 'columns.description' },
    { columnName: 'brand', translateKey: 'columns.brand' },
    { columnName: 'category', translateKey: 'columns.category' },
    { columnName: 'country', translateKey: 'columns.country' },
    { columnName: 'subCategory', translateKey: 'columns.subcategory' },
  ],
};

export default function Dashboard({ lng }: { lng: string }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('orders');
  const [data, setData] = useState<Record<TabKey, PaginatedData>>({
    orders: { pages: {}, totalPages: 1 },
    products: { pages: {}, totalPages: 1 },
  });

  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation(lng);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const fetchData = async (tab: TabKey, page = 1): Promise<void> => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      router.push(`/${lng}/admin/login`);

      return;
    }

    if (data[tab].pages[page]) {
      setCurrentPage(page);

      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchDataFunctions[tab](token, page, PAGE_SIZE);

      if (response.success) {
        setData(prev => ({
          ...prev,
          [tab]: {
            ...prev[tab],
            pages: {
              ...prev[tab].pages,
              [page]: response[tab],
            },
            totalPages: response.totalPages,
          },
        }));

        setCurrentPage(page);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData('orders');
  }, []);

  const handlePageChange = (nextPage: number) => {
    if (!data[selectedTab].pages[nextPage]) {
      fetchData(selectedTab, nextPage);
    } else {
      setCurrentPage(nextPage);
    }
  };

  const handleTabChange = (tab: TabKey) => {
    setSelectedTab(tab);
    setCurrentPage(1);

    if (Object.keys(data[tab].pages).length === 0) fetchData(tab);
  };

  const handleSearch = async () => {
    try {
      const response: IProductResponse[] = await fetchSearchProducts(searchTerm);

      setCurrentPage(1000);

      setData(prev => ({
        ...prev,
        [selectedTab]: {
          ...prev[selectedTab],
          pages: {
            ...prev[selectedTab].pages,
            1000: response || [],
          },
        },
      }));
    } catch (error) {
      console.error(`Error search ${searchTerm}:`, error);
    }
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

  const renderCellValue = (row: any, columnName: string) => {
    const keys = columnName.split('.');

    const value: any = keys.reduce((acc, key) => acc && acc[key], row);

    if (typeof value === 'object' && value !== null && 'name' in value) {
      return value.name;
    }

    return value ?? '-';
  };

  const handleAddEntity = async (formData: any) => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
      const response = await createFunctions[selectedTab](formData, token);

      if (response.success) {
        toaster.create({ type: 'success', title: `${t(`tabs.${selectedTab}`)} ${t('addSuccess')}` });

        setData(prev => ({
          ...prev,
          [selectedTab]: {
            ...prev[selectedTab],
            pages: {
              ...prev[selectedTab].pages,
              [currentPage]: [response.data, ...(prev[selectedTab].pages[currentPage] || [])],
            },
          },
        }));

        setIsDialogOpen(false);
      } else {
        toaster.create({ type: 'error', title: `${t('addError')} ${t(`tabs.${selectedTab}`)}` });
      }
    } catch (error) {
      toaster.create({ type: 'error', title: `${t('addError')} ${t(`tabs.${selectedTab}`)}` });
    }
  };

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
    <Layout lng={lng}>
      <Toaster />
      <Box p={5}>
        <HStack mb={4} display='flex' justifyContent='space-between'>
          <Box>
            {(Object.keys(columns) as TabKey[]).map((tab, index) =>
              isLoading ? (
                <Skeleton key={index} height='40px' width='120px' borderRadius='md' />
              ) : (
                <Button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  fontWeight='bold'
                  bg={selectedTab === tab ? 'orange.400' : 'gray.200'}
                  color={selectedTab === tab ? 'white' : 'gray.700'}
                  mr={2}
                  _hover={{ bg: selectedTab === tab ? 'orange.500' : 'gray.300' }}
                >
                  {t(`tabs.${tab}` as any)}
                </Button>
              ),
            )}
          </Box>

          {!isLoading && (
            <Flex>
              {selectedTab === 'products' && (
                <HStack mr={2}>
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Button onClick={handleSearch}>{t('searchProduct')}</Button>
                </HStack>
              )}
              <Flex justifyContent='flex-end'>
                <Button colorScheme='blue' onClick={handleDownloadCsv} mr={2}>
                  {t('downloadCsv')} {t(`tabs.${selectedTab}`)}
                </Button>
              </Flex>
              <Button colorScheme='green' onClick={() => setIsDialogOpen(true)}>
                {t('add')} {t(`tabs.${selectedTab}`)}
              </Button>

              <AddEntityDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleAddEntity}
                tab={selectedTab}
                t={t}
              />
            </Flex>
          )}
        </HStack>

        {isLoading ? (
          <SkeletonTable />
        ) : (
          <VStack align='stretch' border='1px solid #ddd' p={4} borderRadius='md'>
            <HStack bg='gray.200' p={2} borderRadius='md'>
              {columns[selectedTab].map(column => (
                <Text key={column.translateKey} flex={1} fontWeight='bold'>
                  {t(column.translateKey as any)}
                </Text>
              ))}
              <Text fontWeight='bold'>{t('actionsText')}</Text>
            </HStack>

            {(data[selectedTab].pages[currentPage] || []).map(row => (
              <HStack key={row?.id || row.phone} p={2} borderBottom='1px solid #ddd'>
                {columns[selectedTab].map(column => (
                  <Text key={column.columnName} flex={1}>
                    {renderCellValue(row, column.columnName)}
                  </Text>
                ))}
                <HStack>
                  <Button size='sm' colorScheme='red' onClick={() => handleDelete(row.id)}>
                    {t('delete')}
                  </Button>
                </HStack>
              </HStack>
            ))}
          </VStack>
        )}

        <Pagination
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={data[selectedTab].totalPages}
        />
      </Box>
    </Layout>
  );
}
