import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Edit, Copy, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface NewBudgetLiteProps {
  userId: string;
  onBack: () => void;
}

export const NewBudgetLite = ({ userId, onBack }: NewBudgetLiteProps) => {
  const [recentBudgets, setRecentBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchRecentBudgets = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching recent budgets:', error);
          return;
        }

        setRecentBudgets(data || []);
      } catch (err) {
        console.error('Failed to fetch budgets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBudgets();
  }, [userId]);

  const handleCopy = (budget: any) => {
    // Simple copy functionality for lite version
    console.log('Copy budget:', budget.id);
    alert('Funcionalidade de cópia será implementada em breve');
  };

  const handleView = (budget: any) => {
    // Simple view functionality for lite version
    console.log('View budget:', budget.id);
    alert('Visualização será implementada em breve');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-500/20 text-green-900 dark:text-green-200';
      case 'pendente':
        return 'bg-yellow-500/20 text-yellow-900 dark:text-yellow-200';
      case 'rejeitado':
        return 'bg-red-500/20 text-red-900 dark:text-red-200';
      default:
        return 'bg-gray-500/20 text-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Novo Orçamento</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Novo Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowForm(true)} 
              className="w-full"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Começar Orçamento
            </Button>
          </CardContent>
        </Card>

        {recentBudgets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Orçamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                recentBudgets.map((budget) => (
                  <div key={budget.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{budget.client_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          R$ {Number(budget.total_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <Badge className={getStatusColor(budget.status)}>
                        {budget.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleView(budget)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCopy(budget)}
                        className="flex-1"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {showForm && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Formulário em Desenvolvimento</h3>
                <p className="text-muted-foreground text-sm">
                  O formulário completo de criação de orçamentos está sendo otimizado para iPhone Safari.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="w-full"
                >
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};