'use client';

import React, { ElementType } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaRoad } from 'react-icons/fa';

import { Box, Button, Container, Flex, Icon, Link, Spinner, Text } from '@chakra-ui/react';
import ContactForm from '@features/contact/send-request/contact-form';
import { useTranslation } from '@i18n/client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Layout } from '@widgets/layout';

interface ContactViewProps {
  lng: string;
  googleKey: string;
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = { lat: 50.44027, lng: 30.47491 };

const ContactView = ({ lng, googleKey }: ContactViewProps) => {
  const { t } = useTranslation(lng);

  console.log(
    'GOOGLE_MAPS_API_KEY',
    process.env,
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    process.env.GOOGLE_MAPS_API_KEY,
  );

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleKey,
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
            <Text fontSize='3xl' fontWeight='bold' color='gray.800'>
              {t('contact.title')}
            </Text>
            <Text color='gray.600' mt={2} fontSize='lg'>
              {t('contact.description')}
            </Text>

            <Flex mt={6} direction='column' gap={3}>
              <Flex align='center'>
                <Icon as={FaMapMarkerAlt as ElementType} color='#036753' boxSize={5} mr={3} />
                <Text color='gray.700' fontSize='lg'>
                  {t('contact.address')}
                </Text>
              </Flex>

              <Flex align='center'>
                <Icon as={FaPhone as ElementType} color='#036753' boxSize={5} mr={3} />
                <Flex flexDirection='column'>
                  <Link
                    href={`tel:${process.env.NEXT_PUBLIC_OFFICE_PHONE}`}
                    color='#036753'
                    fontSize='lg'
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {process.env.NEXT_PUBLIC_OFFICE_PHONE}
                  </Link>
                  <Link
                    href={`tel:${process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND}`}
                    color='#036753'
                    fontSize='lg'
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND}
                  </Link>
                </Flex>
              </Flex>

              <Flex align='center'>
                <Icon as={FaEnvelope as ElementType} color='#036753' boxSize={5} mr={3} />
                <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_OFFICE_EMAIL}`}
                  color='#036753'
                  fontSize='lg'
                  _hover={{ textDecoration: 'underline' }}
                >
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
                  bg='rgba(3, 103, 83, 0.7)'
                  backdropFilter='blur(10px)'
                  p={4}
                  borderRadius='lg'
                  boxShadow='lg'
                  maxW='300px'
                >
                  <Text fontSize='lg' fontWeight='bold' color='white'>
                    {t('address.street')}
                  </Text>
                  <Text fontSize='sm' color='white'>
                    {t('address.full')}
                  </Text>

                  <Flex mt={3} alignItems='center'>
                    <Button
                      onClick={buildRoute}
                      fontSize='sm'
                      bg='white'
                      color='#036753'
                      borderRadius='md'
                      _hover={{ bg: '#024D3E', color: 'white' }}
                      display='flex'
                      alignItems='center'
                    >
                      <FaRoad style={{ marginRight: '5px' }} />
                      {t('buttons.route')}
                    </Button>
                  </Flex>

                  <Flex mt={2} alignItems='center'>
                    <Button
                      onClick={enlargeMap}
                      fontSize='sm'
                      bg='white'
                      color='#036753'
                      borderRadius='md'
                      _hover={{ bg: '#024D3E', color: 'white' }}
                      display='flex'
                      alignItems='center'
                    >
                      {t('buttons.enlargeMap')}
                    </Button>
                  </Flex>
                </Box>
              </Box>
            ) : (
              <Flex w='100%' h='300px' alignItems='center' justifyContent='center'>
                <Spinner size='xl' color='#036753' />
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
