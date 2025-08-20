'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { fetchCategoriesDashboard, fetchSubCategoriesDashboard } from '@/entities/category/api';
import { fetchOrders } from '@/entities/order/api';
import { fetchProductsOffSet, fetchSearchProducts } from '@/entities/product/api';
import { IProductResponse } from '@/entities/product/model/types';
import { Pagination, SkeletonTable, Toaster } from '@/shared/ui';
import { Box, Button, Flex, HStack, Input, Skeleton, Text, VStack } from '@chakra-ui/react';
import {
  AddEntityDialog,
  DeleteEntityBtn,
  DownloadEntityBtn,
  PaginatedData,
  TabKey,
  dashBoardColumns,
} from '@features/entitiy';
import { UpdateProductDialog } from '@features/product';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

const PAGE_SIZE = 10;

const fetchDataFunctions = {
  orders: fetchOrders,
  products: fetchProductsOffSet,
  categories: fetchCategoriesDashboard,
  subcategories: fetchSubCategoriesDashboard,
} as const;

export default function Dashboard({ lng }: { lng: string }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('orders');
  const [data, setData] = useState<Record<TabKey, PaginatedData>>({
    orders: { pages: {}, totalPages: 1 },
    products: { pages: {}, totalPages: 1 },
    categories: { pages: {}, totalPages: 1 },
    subcategories: { pages: {}, totalPages: 1 },
  });

  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation(lng);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();

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
      const response: any = await fetchDataFunctions[tab](token as never, page, PAGE_SIZE);

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

  const renderCellValue = (row: any, columnName: string) => {
    const keys = columnName.split('.');

    const value: any = keys.reduce((acc, key) => acc && acc[key], row);

    if (typeof value === 'object' && value !== null && 'name' in value) {
      return value.name;
    }

    return value ?? '-';
  };

  return (
    <Layout lng={lng}>
      <Toaster />
      <Box p={5}>
        <HStack mb={4} display='flex' justifyContent='space-between'>
          <Box>
            {(Object.keys(dashBoardColumns) as TabKey[]).map((tab, index) =>
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
              {selectedTab === 'orders' ||
                (selectedTab === 'products' && (
                  <Flex justifyContent='flex-end'>
                    <DownloadEntityBtn t={t} selectedTab={selectedTab} />
                  </Flex>
                ))}
              <Button colorScheme='green' onClick={() => setIsDialogOpen(true)}>
                {t('add')} {t(`tabs.${selectedTab}`)}
              </Button>

              <AddEntityDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                tab={selectedTab}
                t={t}
                selectedTab={selectedTab}
                currentPage={currentPage}
                setIsDialogOpen={setIsDialogOpen}
                setData={setData}
              />
            </Flex>
          )}
        </HStack>

        {isLoading ? (
          <SkeletonTable />
        ) : (
          <VStack align='stretch' border='1px solid #ddd' p={4} borderRadius='md'>
            <HStack bg='gray.200' p={2} borderRadius='md'>
              {dashBoardColumns[selectedTab].map(column => (
                <Text key={column.translateKey} flex={1} fontWeight='bold'>
                  {t(column.translateKey as any)}
                </Text>
              ))}
              <Text fontWeight='bold'>{t('actionsText')}</Text>
            </HStack>

            {(data[selectedTab].pages[currentPage] || []).map(row => (
              <HStack key={row?.id || row.phone} p={2} borderBottom='1px solid #ddd'>
                {dashBoardColumns[selectedTab].map(column => (
                  <Text key={column.columnName} flex={1}>
                    {renderCellValue(row, column.columnName)}
                  </Text>
                ))}
                {(selectedTab === 'products' || selectedTab === 'categories' || selectedTab === 'subcategories') && (
                  <HStack>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setSelectedId(row.id);
                        setIsUpdateDialogOpen(true);
                      }}
                    >
                      {t('update')}
                    </Button>
                  </HStack>
                )}
                <HStack>
                  <DeleteEntityBtn
                    id={row.id}
                    setData={setData}
                    t={t}
                    selectedTab={selectedTab}
                    currentPage={currentPage}
                  />
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

        {isUpdateDialogOpen && (
          <UpdateProductDialog
            setIsDialogOpen={setIsUpdateDialogOpen}
            t={t}
            isOpen={isUpdateDialogOpen}
            data={data[selectedTab].pages[currentPage].find(item => item.id === selectedId)}
            setData={setData}
            currentPage={currentPage}
            selectedTab={selectedTab as 'products' | 'categories' | 'subcategories'}
          />
        )}
      </Box>
    </Layout>
  );
}
