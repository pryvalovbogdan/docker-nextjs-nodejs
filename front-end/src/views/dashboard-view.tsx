'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { fetchAdmins } from '@/entities/admin/api';
import { fetchOrders } from '@/entities/order/api';
import { fetchProductsOffSet } from '@/entities/product/api';
import Pagination from '@/shared/ui/pagination';
import SkeletonTable from '@/shared/ui/skeleton-table';
import { Box, Button, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

const PAGE_SIZE = 10;

type TabKey = 'orders' | 'products' | 'admins';

type FetchFunction = (token: string, page: number, pageSize: number) => Promise<any>;

const fetchDataFunctions: Record<TabKey, FetchFunction> = {
  orders: fetchOrders,
  products: fetchProductsOffSet,
  admins: fetchAdmins,
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
    { columnName: 'status', translateKey: 'columns.status' },
  ],
  products: [
    { columnName: 'title', translateKey: 'columns.title' },
    { columnName: 'description', translateKey: 'columns.description' },
    { columnName: 'brand', translateKey: 'columns.brand' },
    { columnName: 'category', translateKey: 'columns.category' },
    { columnName: 'country', translateKey: 'columns.country' },
    { columnName: 'subCategory', translateKey: 'columns.subcategory' },
  ],
  admins: [
    { columnName: 'username', translateKey: 'columns.username' },
    { columnName: 'passwordHash', translateKey: 'columns.password' },
    { columnName: 'role', translateKey: 'columns.role' },
    { columnName: 'adminIps', translateKey: 'columns.adminIp' },
    { columnName: 'createdAt', translateKey: 'columns.createdAt' },
  ],
};

export default function Dashboard({ lng }: { lng: string }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('orders');
  const [data, setData] = useState<Record<TabKey, PaginatedData>>({
    orders: { pages: {}, totalPages: 1 },
    products: { pages: {}, totalPages: 1 },
    admins: { pages: {}, totalPages: 1 },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation(lng);
  const [isLoading, setIsLoading] = useState(true);
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
      <Box p={5}>
        <HStack mb={4}>
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
                _hover={{ bg: selectedTab === tab ? 'orange.500' : 'gray.300' }}
              >
                {t(`tabs.${tab}` as any)}
              </Button>
            ),
          )}
        </HStack>

        {isLoading ? (
          <SkeletonTable />
        ) : (
          <VStack align='stretch' border='1px solid #ddd' p={4} borderRadius='md'>
            <HStack bg='gray.200' p={2} borderRadius='md'>
              {columns[selectedTab].map(column => (
                <Text
                  key={column.translateKey}
                  flex={1}
                  fontWeight='bold'
                  textAlign='left'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  textOverflow='ellipsis'
                >
                  {t(column.translateKey as any)}
                </Text>
              ))}
            </HStack>

            {(data[selectedTab].pages[currentPage] || []).map(row => (
              <HStack key={row.id} p={2} borderBottom='1px solid #ddd'>
                {columns[selectedTab].map(column => (
                  <Text key={column.columnName} flex={1} textAlign='left' whiteSpace='normal' wordBreak='break-word'>
                    {renderCellValue(row, column.columnName)}
                  </Text>
                ))}
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
