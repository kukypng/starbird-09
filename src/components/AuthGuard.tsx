
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/pages/AuthPage';
import { LicenseExpiredPage } from '@/pages/LicenseExpiredPage';
import { useLicenseValidation } from '@/hooks/useLicenseValidation';
import { MobileLoading } from '@/components/ui/mobile-loading';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const { data: isLicenseValid, isLoading: licenseLoading } = useLicenseValidation();

  if (loading || licenseLoading) {
    return <MobileLoading message="Verificando autenticação..." />;
  }

  if (!user) {
    return <AuthPage />;
  }

  // Check license validity after user is authenticated
  if (isLicenseValid === false) {
    return <LicenseExpiredPage />;
  }

  return <>{children}</>;
};
