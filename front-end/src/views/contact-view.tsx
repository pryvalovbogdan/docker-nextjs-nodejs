'use client';

import React, { ElementType } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaRoad } from 'react-icons/fa';

import { Box, Container, Flex, Icon, Link, Spinner, Text } from '@chakra-ui/react';
import ContactForm from '@features/contact/send-request/contact-form';
import { useTranslation } from '@i18n/client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Layout } from '@widgets/layout';

interface ContactViewProps {
  lng: string;
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = { lat: 50.44027, lng: 30.47491 };

const ContactView = ({ lng }: ContactViewProps) => {
  const { t } = useTranslation(lng);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const buildRoute = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir//${center.lat},${center.lng}`;

    window.open(googleMapsUrl, '_blank');
  };

  const enlargeMap = () => {
    const googleMapsUrl = `https://www.google.com/maps/place/${center.lat},${center.lng}`;

    window.open(googleMapsUrl, '_blank');
  };

  return (
    <Layout lng={lng}>
      <Container maxW='container.xl' py={10}>
        <Flex direction={{ base: 'column', md: 'row' }} justify='space-between' align='flex-start' gap={10} mb={10}>
          <Box flex='1'>
            <Text fontSize='3xl' fontWeight='bold'>
              {t('contact.title')}
            </Text>
            <Text color='gray.600' mt={2}>
              {t('contact.description')}
            </Text>

            <Flex mt={4} direction='column'>
              <Flex align='center' mb={2}>
                <Icon as={FaMapMarkerAlt as ElementType} color='yellow.500' mr={2} />
                <Text>{t('contact.address')}</Text>
              </Flex>
              <Flex align='center' mb={2}>
                <Icon as={FaPhone as ElementType} color='yellow.500' mr={2} />
                <Flex flexDirection='column'>
                  <Link href={`tel:${process.env.NEXT_PUBLIC_OFFICE_PHONE}`} color='blue.500'>
                    {process.env.NEXT_PUBLIC_OFFICE_PHONE}
                  </Link>
                  <Link href={`tel:${process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND}`} color='blue.500'>
                    {process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND}
                  </Link>
                </Flex>
              </Flex>
              <Flex align='center'>
                <Icon as={FaEnvelope as ElementType} color='yellow.500' mr={2} />
                <Link href={`mailto:${process.env.NEXT_PUBLIC_OFFICE_EMAIL}`} color='blue.500'>
                  {process.env.NEXT_PUBLIC_OFFICE_EMAIL}
                </Link>
              </Flex>
            </Flex>
          </Box>

          <Box flex='1' w='100%'>
            {isLoaded ? (
              <Box flex='1' position='relative'>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={15}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <Marker position={center} />
                </GoogleMap>

                <Box
                  position='absolute'
                  top='10px'
                  left='10px'
                  bg='white'
                  p={3}
                  boxShadow='lg'
                  borderRadius='md'
                  maxW='300px'
                >
                  <Text fontSize='lg' fontWeight='bold'>
                    {t('address.street')}
                  </Text>
                  <Text fontSize='sm' color='gray.600'>
                    {t('address.full')}
                  </Text>

                  <Flex mt={2} alignItems='center'>
                    <Link
                      href='#'
                      onClick={buildRoute}
                      fontSize='sm'
                      color='blue.500'
                      display='flex'
                      alignItems='center'
                    >
                      <Icon as={FaRoad} mr={1} />
                      {t('buttons.route')}
                    </Link>
                  </Flex>

                  <Flex mt={1} alignItems='center'>
                    <Link
                      href='#'
                      onClick={enlargeMap}
                      fontSize='sm'
                      color='blue.500'
                      display='flex'
                      alignItems='center'
                    >
                      {t('buttons.enlargeMap')}
                    </Link>
                  </Flex>
                </Box>
              </Box>
            ) : (
              <Flex w='100%' h='300px' alignItems='center' justifyContent='center'>
                <Spinner size='xl' />
              </Flex>
            )}
          </Box>
        </Flex>
        <ContactForm lng={lng} />
      </Container>
    </Layout>
  );
};

export default ContactView;
