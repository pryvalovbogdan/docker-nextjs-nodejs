import { Toaster } from '@/shared/ui/toaster';
import { LoginForm } from '@features/admin';
import { Layout } from '@widgets/layout';

const LoginView = ({ lng }: { lng: string }) => {
  return (
    <Layout lng={lng}>
      <LoginForm lng={lng} />
      <Toaster />
    </Layout>
  );
};

export default LoginView;
