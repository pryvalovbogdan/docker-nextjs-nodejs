'use client';

import { useState } from 'react';

import { Box, Button, Flex, HStack, IconButton, Input, Text, VStack, createIcon } from '@chakra-ui/react';
import { useTranslation } from '@i18n/client';
import { Layout } from '@widgets/layout';

type EditedDataType = Record<number, Record<string, string>>;

const initialData = {
  admins: [
    { id: 1, username: 'admin1', role: 'Super Admin', adminIp: '192.168.1.1', createdAt: '2025-02-10' },
    { id: 2, username: 'admin2', role: 'Moderator', adminIp: '192.168.1.2', createdAt: '2025-02-11' },
  ],
  news: [
    { id: 1, title: 'New Feature Release', description: 'Next.js 15 is out!', date: '2025-02-10' },
    { id: 2, title: 'Product Update', description: 'We added new features.', date: '2025-02-11' },
  ],
  orders: [
    { id: 1, name: 'John Doe', phone: '123456789', date: '2025-02-10', email: 'john@example.com', status: 'active' },
    {
      id: 2,
      name: 'Alice Smith',
      phone: '987654321',
      date: '2025-02-11',
      email: 'alice@example.com',
      status: 'pending',
    },
  ],
  products: [
    { id: 1, title: 'Laptop', price: '1000.00', brand: 'Apple', category: 'Electronics', country: 'USA' },
    { id: 2, title: 'Phone', price: '700.00', brand: 'Samsung', category: 'Electronics', country: 'South Korea' },
  ],
};

const HeartIcon = createIcon({
  displayName: 'HeartIcon',
  path: (
    <>
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path fill='currentColor' d='M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
    </>
  ),
});

const PAGE_SIZE = 2;

export default function Dashboard({ lng }: { lng: string }) {
  const [selectedTab, setSelectedTab] = useState('orders');
  const [data, setData] = useState(initialData);
  const [editedData, setEditedData] = useState<EditedDataType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation(lng);

  const handleEdit = (rowId: number, field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [rowId]: { ...(prev[rowId] || {}), [field]: value },
    }));
  };

  const handleSubmit = (rowId: number) => {
    setData(prev => ({
      ...prev,
      [selectedTab]: (prev[selectedTab as keyof typeof prev] as (typeof prev)[keyof typeof prev]).map(row =>
        row.id === rowId ? { ...row, ...editedData[rowId] } : row,
      ),
    }));

    setEditedData(prev => {
      const updated = { ...prev };

      delete updated[rowId];

      return updated;
    });
  };

  const columns = {
    admins: ['id', 'username', 'role', 'adminIp', 'createdAt'],
    news: ['id', 'title', 'description', 'date'],
    orders: ['id', 'name', 'phone', 'date', 'email', 'status'],
    products: ['id', 'title', 'price', 'brand', 'category', 'country'],
  };

  type TabKey = keyof typeof data;
  type TabKeyColumn = keyof typeof columns;

  const displayedData = data[selectedTab as TabKey].slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Layout lng={lng}>
      <Box p={5}>
        <HStack mb={4}>
          {Object.keys(initialData).map(key => (
            <Button
              key={key}
              onClick={() => {
                setSelectedTab(key);
                setCurrentPage(1);
              }}
              colorScheme={selectedTab === key ? 'blue' : 'gray'}
            >
              {t(`tabs.${key}` as any)}
            </Button>
          ))}
        </HStack>
        <VStack align='stretch' border='1px solid #ddd' p={4} borderRadius='md'>
          <HStack bg='gray.200' p={2} borderRadius='md'>
            {columns[selectedTab as TabKeyColumn].map(col => (
              <Text key={col} fontWeight='bold' flex={1}>
                {t(`columns.${col}` as any)}
              </Text>
            ))}
            <Text fontWeight='bold'>{t('actions.submit')}</Text>
          </HStack>
          {displayedData.map(row => (
            <HStack key={row.id} p={2} borderBottom='1px solid #ddd'>
              {columns[selectedTab as keyof typeof columns].map(col => (
                <Box
                  key={col}
                  flex={1}
                  onClick={() => handleEdit(row.id, col, row[col as keyof typeof row]?.toString() || '')}
                >
                  {editedData[row.id]?.[col] ? (
                    <Input
                      value={editedData[row.id][col]}
                      onChange={e => handleEdit(row.id, col, e.target.value)}
                      size='sm'
                    />
                  ) : (
                    <Text>{row[col as keyof typeof row]}</Text>
                  )}
                </Box>
              ))}
              <Box>
                {editedData[row.id] && (
                  <Button size='xs' colorScheme='blue' onClick={() => handleSubmit(row.id)}>
                    {t('login.submit')}
                  </Button>
                )}
              </Box>
            </HStack>
          ))}
        </VStack>
        <Flex justify='space-between' align='center' mt={4}>
          <IconButton
            icon={<HeartIcon />}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          />
          <Text>
            {t('pagination.page')} {currentPage}
          </Text>
          <IconButton
            icon={<HeartIcon />}
            disabled={currentPage * PAGE_SIZE >= data[selectedTab as keyof typeof data].length}
            onClick={() => setCurrentPage(prev => prev + 1)}
          />
        </Flex>
      </Box>
    </Layout>
  );
}
