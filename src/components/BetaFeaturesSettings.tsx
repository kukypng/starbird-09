import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const BetaFeaturesSettings = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [dashboardLiteEnabled, setDashboardLiteEnabled] = useState(false);

  // Verificar se é Android e admin
  const isAndroid = /Android/.test(navigator.userAgent);
  const isAdmin = hasPermission('admin');
  const canUseBeta = isAndroid && isAdmin;

  useEffect(() => {
    // Carregar configuração do localStorage
    const saved = localStorage.getItem('dashboard-lite-enabled');
    setDashboardLiteEnabled(saved === 'true');
  }, []);

  const handleDashboardLiteChange = (enabled: boolean) => {
    setDashboardLiteEnabled(enabled);
    localStorage.setItem('dashboard-lite-enabled', enabled.toString());
    
    toast({
      title: enabled ? 'Dashboard Lite ativado' : 'Dashboard Lite desativado',
      description: enabled 
        ? 'Você será redirecionado para a versão Lite na próxima vez que acessar o dashboard.'
        : 'Você voltará a usar a versão normal do dashboard.',
    });

    // Redirecionar imediatamente se necessário
    if (enabled) {
      setTimeout(() => {
        window.location.href = '/dashboard-lite';
      }, 1000);
    }
  };

  if (!canUseBeta) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Beta</CardTitle>
          <CardDescription>
            Recursos experimentais disponíveis apenas para administradores em dispositivos Android.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {!isAdmin && 'Você precisa ser administrador para acessar essas funcionalidades.'}
            {isAdmin && !isAndroid && 'Essas funcionalidades estão disponíveis apenas para dispositivos Android.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funcionalidades Beta</CardTitle>
        <CardDescription>
          Recursos experimentais em desenvolvimento. Use por sua conta e risco.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dashboard-lite">Dashboard Lite Experimental</Label>
            <p className="text-sm text-muted-foreground">
              Ativar a versão otimizada da dashboard (desenvolvida para iOS Safari, mas disponível para testes em Android)
            </p>
          </div>
          <Switch
            id="dashboard-lite"
            checked={dashboardLiteEnabled}
            onCheckedChange={handleDashboardLiteChange}
          />
        </div>
        
        {dashboardLiteEnabled && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Experimental:</strong> Esta é uma versão simplificada da dashboard, 
              otimizada para dispositivos móveis com Safari. Algumas funcionalidades podem estar limitadas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};