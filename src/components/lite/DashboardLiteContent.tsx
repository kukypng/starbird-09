import React from 'react';
import { BudgetLiteList } from './BudgetLiteList';

interface DashboardLiteContentProps {
  budgets: any[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  profile?: any;
}

export const DashboardLiteContent = ({ 
  budgets, 
  loading, 
  error, 
  onRefresh,
  profile 
}: DashboardLiteContentProps) => {
  return (
    <BudgetLiteList
      budgets={budgets}
      profile={profile}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
    />
  );
};