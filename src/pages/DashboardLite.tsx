import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/integrations/supabase/client';
import { LoadingBoundary } from '@/components/LoadingBoundary';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardLiteHeader } from '@/components/lite/DashboardLiteHeader';
import { DashboardLiteContent } from '@/components/lite/DashboardLiteContent';
import { DashboardLiteSidebar } from '@/components/lite/DashboardLiteSidebar';
import { DashboardLiteStats } from '@/components/lite/DashboardLiteStats';
import { DashboardLiteQuickAccess } from '@/components/lite/DashboardLiteQuickAccess';
import { DashboardLiteLicenseStatus } from '@/components/lite/DashboardLiteLicenseStatus';
import { DashboardLiteHelpSupport } from '@/components/lite/DashboardLiteHelpSupport';
import { NewBudgetLite } from '@/components/lite/NewBudgetLite';
import { SettingsLite } from '@/components/lite/SettingsLite';
import { DataManagementLite } from '@/components/lite/DataManagementLite';
import { AdminLite } from '@/components/lite/AdminLite';

export const DashboardLite = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, user, hasPermission } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aguardar user e profile estarem disponíveis
  const isReady = user?.id && profile;

  useEffect(() => {
    if (!isReady) return;

    const fetchBudgets = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('budgets')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) {
          throw fetchError;
        }

        setBudgets(data || []);
      } catch (err: any) {
        console.error('Error fetching budgets:', err);
        setError('Erro ao carregar orçamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [isReady, user?.id]);

  // Aguardar dados básicos estarem prontos
  if (!isReady) {
    return (
      <div className="h-[100dvh] bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'budgets':
        return (
          <DashboardLiteContent
            budgets={budgets}
            loading={loading}
            error={error}
            onRefresh={() => window.location.reload()}
            profile={profile}
          />
        );
      case 'new-budget':
        return (
          <NewBudgetLite 
            userId={user.id} 
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      
      case 'data-management':
        return (
          <DataManagementLite 
            userId={user.id} 
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      
      case 'settings':
        return (
          <SettingsLite 
            userId={user.id} 
            profile={profile}
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      
      case 'admin':
        return (
          <AdminLite 
            userId={user.id} 
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      
      default:
        return (
          <div className="p-4 space-y-4">
            <DashboardLiteStats profile={profile} userId={user?.id} />
            <DashboardLiteQuickAccess 
              onTabChange={setActiveTab} 
              hasPermission={hasPermission} 
            />
            <DashboardLiteLicenseStatus profile={profile} />
            <DashboardLiteHelpSupport />
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <AuthGuard>
        <LoadingBoundary>
          <div className="h-[100dvh] bg-background flex flex-col">
            <DashboardLiteHeader
              profile={profile}
              onMenuClick={() => setSidebarOpen(true)}
            />
            
            <div className="flex-1 flex overflow-hidden">
              <DashboardLiteSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              
              <main className="flex-1 overflow-auto">
                {renderContent()}
              </main>
            </div>
          </div>
        </LoadingBoundary>
      </AuthGuard>
    </ErrorBoundary>
  );
};