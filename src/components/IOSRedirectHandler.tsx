import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIOSDetection } from '@/hooks/useIOSDetection';

export const IOSRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shouldUseLite } = useIOSDetection();

  useEffect(() => {
    // Só redirecionar se estiver na rota /dashboard e deveria usar lite
    if (location.pathname === '/dashboard' && shouldUseLite) {
      navigate('/dashboard-lite', { replace: true });
    }
    
    // Se estiver em /dashboard-lite mas não deveria usar lite, voltar para dashboard normal
    if (location.pathname === '/dashboard-lite' && !shouldUseLite) {
      // Verificar se não é uma preferência manual do usuário
      const manualLiteEnabled = localStorage.getItem('dashboard-lite-enabled') === 'true';
      if (!manualLiteEnabled) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location.pathname, shouldUseLite, navigate]);

  return null;
};