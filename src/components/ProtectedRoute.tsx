
import React from 'react';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { EmptyState } from '@/components/EmptyState';
import { Shield, User } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { useLicenseValidation } from '@/hooks/useLicenseValidation';
import { LicenseExpiredPage } from '@/pages/LicenseExpiredPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback 
}: ProtectedRouteProps) => {
  const { user, profile, loading, hasRole, hasPermission } = useAuth();
  const { data: isLicenseValid, isLoading: licenseLoading } = useLicenseValidation();

  if (loading || licenseLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return fallback || (
      <EmptyState
        icon={User}
        title="Acesso Negado"
        description="Você precisa estar logado para acessar esta página."
        action={{
          label: "Fazer Login",
          onClick: () => window.location.href = '/login'
        }}
      />
    );
  }

  if (!profile) {
    return (
      <EmptyState
        icon={User}
        title="Perfil Não Encontrado"
        description="Seu perfil não foi encontrado no sistema. Entre em contato com o administrador."
      />
    );
  }

  // Check license validity
  if (isLicenseValid === false) {
    return <LicenseExpiredPage />;
  }

  if (!profile.is_active) {
    return <LicenseExpiredPage />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <EmptyState
        icon={Shield}
        title="Permissão Insuficiente"
        description={`Você precisa ter o nível de acesso "${requiredRole}" ou superior para acessar esta página.`}
      />
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <EmptyState
        icon={Shield}
        title="Permissão Negada"
        description="Você não tem permissão para acessar esta funcionalidade."
      />
    );
  }

  return <>{children}</>;
};
