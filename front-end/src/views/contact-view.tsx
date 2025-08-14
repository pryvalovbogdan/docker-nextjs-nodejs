'use client';

import React, { ElementType } from 'react';
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaRoad, FaTelegramPlane, FaViber } from 'react-icons/fa';

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Link,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import ContactForm from '@features/contact/send-request/contact-form';
import { useTranslation } from '@i18n/client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Layout } from '@widgets/layout';

interface ContactViewProps {
  lng: string;
  googleKey: string;
  officePhone: string;
  officePhoneSecond: string;
  officeEmail: string;
  origin?: string;
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = { lat: 50.44027, lng: 30.47491 };

const ContactView = ({ lng, googleKey, officePhone, officePhoneSecond, officeEmail, origin }: ContactViewProps) => {
  const { t } = useTranslation(lng);

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
    <Layout
      lng={lng}
      officeEmail={officeEmail}
      officePhone={officePhone}
      officePhoneSecond={officePhoneSecond}
      origin={origin}
    >
      <Container maxW='container.xl' py={10}>
        <Flex direction={{ base: 'column', md: 'row' }} justify='space-between' align='flex-start' gap={10} mb={10}>
          <Flex flexDirection='column' justifyContent='space-between' h='full' flex='1'>
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
                <Flex flexDirection='column'>
                  <Flex align='center' gap={2}>
                    <Link href={`viber://chat?number=${officePhone.replace(/[^+\d]/g, '')}`} target='_blank'>
                      <Icon as={FaViber as ElementType} color='#7C4A9D' boxSize={6} />
                    </Link>
                    <Link href={`https://t.me/${officePhone.replace(/[^+\d]/g, '')}`} target='_blank'>
                      <Icon as={FaTelegramPlane as ElementType} color='#0088cc' boxSize={6} />
                    </Link>
                    <Link
                      href={`tel:${officePhone}`}
                      color='#036753'
                      fontSize='lg'
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {officePhone}
                    </Link>
                  </Flex>
                  <Flex align='center' gap={2}>
                    <Link href={`viber://chat?number=${officePhoneSecond.replace(/[^+\d]/g, '')}`} target='_blank'>
                      <Icon as={FaViber as ElementType} color='#7C4A9D' boxSize={6} />
                    </Link>
                    <Link href={`https://t.me/${officePhoneSecond.replace(/[^+\d]/g, '')}`} target='_blank'>
                      <Icon as={FaTelegramPlane as ElementType} color='#0088cc' boxSize={6} />
                    </Link>
                    <Link
                      href={`tel:${officePhoneSecond}`}
                      color='#036753'
                      fontSize='lg'
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {officePhoneSecond}
                    </Link>
                  </Flex>
                </Flex>
              </Flex>

              <Flex align='center'>
                <Icon as={FaEnvelope as ElementType} color='#036753' boxSize={5} mr={3} />
                <Link
                  href={`mailto:${officeEmail}`}
                  color='#036753'
                  fontSize='lg'
                  _hover={{ textDecoration: 'underline' }}
                >
                  {officeEmail}
                </Link>
              </Flex>
            </Flex>

            <Box
              mt={{ base: 10, md: '80px' }}
              textAlign='center'
              bg='emerald.900'
              p={6}
              borderRadius='lg'
              boxShadow='lg'
              color='white'
            >
              <VStack>
                <Heading as='h3' size='lg' color='emerald.300'>
                  {t('weInSocials')}
                </Heading>
                <Text fontSize='md' color='gray.200'>
                  {t('followUsOnSocials')}
                </Text>
                <HStack>
                  <Link href='https://www.instagram.com/medix_._?igsh=em04dnVtM2JpNTM0' target='_blank'>
                    <IconButton
                      aria-label='Instagram'
                      size='md'
                      colorScheme='whiteAlpha'
                      bg='emerald.700'
                      _hover={{ bg: 'emerald.600' }}
                    >
                      <FaInstagram size='20px' color='white' />
                    </IconButton>
                  </Link>
                  <Link href='https://www.facebook.com/share/1B9zftHSpp/?mibextid=wwXIfr' target='_blank'>
                    <IconButton
                      aria-label='Facebook'
                      size='md'
                      colorScheme='whiteAlpha'
                      bg='emerald.700'
                      _hover={{ bg: 'emerald.600' }}
                    >
                      <FaFacebook size='20px' color='white' />
                    </IconButton>
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </Flex>

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
