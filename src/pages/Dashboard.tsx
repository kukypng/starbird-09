
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { AdaptiveLayout } from '@/components/adaptive/AdaptiveLayout';
import { AdaptiveDashboard } from '@/components/adaptive/AdaptiveDashboard';
import { BudgetsContent } from '@/components/BudgetsContent';
import { NewBudgetContent } from '@/components/NewBudgetContent';
import { SettingsContent } from '@/components/SettingsContent';
import { DataManagementContent } from '@/components/DataManagementContent';
import { AdminPanel } from '@/components/AdminPanel';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ClientsContent } from '@/components/ClientsContent';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, hasPermission, user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (!user.id) {
      console.warn("Usuário carregado sem ID. Abortar renderização.");
    }
  }, [user]);

  const { data: stats } = useQuery({
    queryKey: user?.id ? ['dashboard-weekly-growth', user.id] : [],
    queryFn: async () => {
      if (!user?.id) return { weeklyGrowth: 0 };

      try {
        const today = new Date();
        const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const { error, count } = await supabase
          .from('budgets')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .gte('created_at', weekStart.toISOString());

        if (error) {
          console.error('Error fetching weekly growth:', error);
          return { weeklyGrowth: 0 };
        }
        return { weeklyGrowth: count || 0 };
      } catch (error) {
        console.error('Dashboard stats error:', error);
        return { weeklyGrowth: 0 };
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdaptiveDashboard
            onTabChange={setActiveTab}
            profile={profile}
            weeklyGrowth={stats?.weeklyGrowth || 0}
            hasPermission={hasPermission}
          />
        );
      case 'budgets':
        return <BudgetsContent onTabChange={setActiveTab} />;
      case 'new-budget':
        return <NewBudgetContent />;
      case 'clients':
        return <ClientsContent />;
      case 'data-management':
        return <DataManagementContent />;
      case 'admin':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        );
      case 'settings':
        return <SettingsContent />;
      default:
        return (
          <AdaptiveDashboard
            onTabChange={setActiveTab}
            profile={profile}
            weeklyGrowth={stats?.weeklyGrowth || 0}
            hasPermission={hasPermission}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <AuthGuard>
        <LayoutProvider>
          <AdaptiveLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {renderContent()}
          </AdaptiveLayout>
        </LayoutProvider>
      </AuthGuard>
    </ErrorBoundary>
  );
};

