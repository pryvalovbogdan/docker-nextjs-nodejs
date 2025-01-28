import React from 'react';

import { Box, Button, Heading, Input, Textarea } from '@chakra-ui/react';

const ContactSection = () => (
  <Box as='section' id='contact' py={20} bg='white'>
    <Heading as='h3' fontSize='48px' textAlign='center' mb='52px' color='#062126'>
      Contact Us
    </Heading>
    <Box as='form' maxW='lg' mx='auto' spacing={4} display='flex' alignItems='center' flexDirection='column'>
      <Input
        placeholder='Your Name'
        mb={4}
        bg='FCFCFC'
        color='rgba(6, 33, 38, 0.50)'
        borderRadius='10px'
        border='1px solid rgba(0, 0, 0, 0.05)'
      />
      <Input
        placeholder='Your Email'
        mb={4}
        bg='FCFCFC'
        color='rgba(6, 33, 38, 0.50)'
        borderRadius='10px'
        border='1px solid rgba(0, 0, 0, 0.05)'
      />
      <Textarea
        placeholder='Your Message'
        mb={4}
        color='rgba(6, 33, 38, 0.50)'
        borderRadius='10px'
        border='1px solid rgba(0, 0, 0, 0.05)'
      />
      <Button bg='#24BEE0' color='white' borderRadius='47px' display='inline-flex' w='auto'>
        Submit
      </Button>
    </Box>
  </Box>
);

export default ContactSection;
