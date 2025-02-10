'use client';

import { ReactNode } from 'react';

import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
  max: 3,
});

const ToastCustom = ({ title, description, action, type, meta }) => {
  return (
    <Toast.Root width={{ md: 'sm' }}>
      {type === 'loading' ? <Spinner size='sm' color='blue.solid' /> : <Toast.Indicator />}
      <Stack gap='1' flex='1' maxWidth='100%'>
        {title && <Toast.Title>{title}</Toast.Title>}
        {description && <Toast.Description>{description}</Toast.Description>}
      </Stack>
      {action && <Toast.ActionTrigger>{action.label}</Toast.ActionTrigger>}
      {meta?.closable && <Toast.CloseTrigger />}
    </Toast.Root>
  );
};

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {toast => (<ToastCustom {...toast} />) as ReactNode}
      </ChakraToaster>
    </Portal>
  );
};
