import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const BetaFeaturesSettings = () => {
  const { hasRole, profile } = useAuth();
  const { toast } = useToast();
  const [dashboardLiteEnabled, setDashboardLiteEnabled] = useState(false);

  // Verificar se é admin
  const isAdmin = hasRole('admin');
  const canUseBeta = isAdmin;

  useEffect(() => {
    // Carregar configuração do localStorage
    const saved = localStorage.getItem('dashboard-lite-enabled');
    setDashboardLiteEnabled(saved === 'true');
  }, []);

  const handleDashboardLiteChange = (enabled: boolean) => {
    setDashboardLiteEnabled(enabled);
    localStorage.setItem('dashboard-lite-enabled', enabled.toString());
    
    toast({
      title: enabled ? 'Dashboard iOS ativado' : 'Dashboard iOS desativado',
      description: enabled 
        ? 'Você será redirecionado para a versão iOS na próxima vez que acessar o dashboard.'
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
            Recursos experimentais disponíveis apenas para administradores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {!isAdmin && 'Você precisa ser administrador para acessar essas funcionalidades.'}
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
            <Label htmlFor="dashboard-lite">Dashboard iOS</Label>
            <p className="text-sm text-muted-foreground">
              Usar a versão otimizada para dispositivos móveis (desenvolvida originalmente para iOS Safari)
            </p>
          </div>
          <Switch
            id="dashboard-lite"
            checked={dashboardLiteEnabled}
            onCheckedChange={handleDashboardLiteChange}
          />
        </div>
        
        {dashboardLiteEnabled && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Dashboard iOS:</strong> Versão otimizada para dispositivos móveis, 
              com interface simplificada e melhor performance em telas menores.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};