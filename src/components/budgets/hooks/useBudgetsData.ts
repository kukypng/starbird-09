import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBudgetsData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['budgets', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('owner_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const activeBudgets = (data || []).filter(budget => !budget.deleted_at);
      return activeBudgets;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
    refetchOnWindowFocus: false, // Disable refetch on focus
    refetchInterval: 30000, // Reduced from 10s to 30s
    retry: 2, // Reduced retries
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 15000)
  });
};