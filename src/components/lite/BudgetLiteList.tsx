import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BudgetLiteSearch } from './BudgetLiteSearch';
import { BudgetLiteCard } from './BudgetLiteCard';
import { X } from 'lucide-react';

interface BudgetLiteListProps {
  budgets: any[];
  profile: any;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const BudgetLiteList = ({
  budgets,
  profile,
  loading,
  error,
  onRefresh
}: BudgetLiteListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBudgets, setFilteredBudgets] = useState(budgets);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deletingBudget, setDeletingBudget] = useState<any>(null);

  // Filter budgets when search term or budgets change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBudgets(budgets);
    } else {
      const filtered = budgets.filter(budget => 
        budget.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.device_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.device_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.issue?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBudgets(filtered);
    }
  }, [searchTerm, budgets]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleShareWhatsApp = (budget: any) => {
    const message = `Orçamento: ${budget.device_model}\nCliente: ${budget.client_name}\nValor: R$ ${((budget.total_price || 0) / 100).toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewPDF = (budget: any) => {
    // Simple alert for PDF functionality - would need full implementation
    alert('Funcionalidade de PDF será implementada em breve');
  };

  const handleEdit = (budget: any) => {
    setEditingBudget(budget);
  };

  const handleDelete = (budget: any) => {
    setDeletingBudget(budget);
  };

  const confirmDelete = async () => {
    if (!deletingBudget) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', deletingBudget.id);

      if (error) throw error;

      setDeletingBudget(null);
      onRefresh();
    } catch (error: any) {
      console.error('Error deleting budget:', error);
      alert('Erro ao excluir orçamento');
    }
  };

  const saveEdit = async () => {
    if (!editingBudget) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          client_name: editingBudget.client_name,
          device_model: editingBudget.device_model,
          device_type: editingBudget.device_type,
          issue: editingBudget.issue,
          total_price: editingBudget.total_price,
          installments: editingBudget.installments
        })
        .eq('id', editingBudget.id);

      if (error) throw error;

      setEditingBudget(null);
      onRefresh();
    } catch (error: any) {
      console.error('Error updating budget:', error);
      alert('Erro ao atualizar orçamento');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border rounded-lg p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={onRefresh}
            className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <BudgetLiteSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={handleClearSearch}
      />

      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {filteredBudgets.length} orçamento{filteredBudgets.length !== 1 ? 's' : ''}
          {searchTerm && ` encontrado${filteredBudgets.length !== 1 ? 's' : ''}`}
        </h3>
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento cadastrado'}
          </p>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="mt-2 text-primary hover:underline text-sm"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBudgets.map(budget => (
            <BudgetLiteCard
              key={budget.id}
              budget={budget}
              profile={profile}
              onShareWhatsApp={handleShareWhatsApp}
              onViewPDF={handleViewPDF}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Simple Edit Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 bg-black/50" style={{ position: 'fixed' }}>
          <div className="flex items-center justify-center min-h-[100dvh] p-4">
            <div className="bg-background border rounded-lg p-4 w-full max-w-md max-h-[90dvh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Editar Orçamento</h3>
                <button
                  onClick={() => setEditingBudget(null)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cliente</label>
                  <input
                    type="text"
                    value={editingBudget.client_name || ''}
                    onChange={(e) => setEditingBudget({...editingBudget, client_name: e.target.value})}
                    className="w-full p-2 border border-border rounded-md text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Dispositivo</label>
                  <input
                    type="text"
                    value={editingBudget.device_model || ''}
                    onChange={(e) => setEditingBudget({...editingBudget, device_model: e.target.value})}
                    className="w-full p-2 border border-border rounded-md text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <input
                    type="text"
                    value={editingBudget.device_type || ''}
                    onChange={(e) => setEditingBudget({...editingBudget, device_type: e.target.value})}
                    className="w-full p-2 border border-border rounded-md text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Problema</label>
                  <textarea
                    value={editingBudget.issue || ''}
                    onChange={(e) => setEditingBudget({...editingBudget, issue: e.target.value})}
                    className="w-full p-2 border border-border rounded-md text-sm h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Valor (em centavos)</label>
                  <input
                    type="number"
                    value={editingBudget.total_price || 0}
                    onChange={(e) => setEditingBudget({...editingBudget, total_price: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-border rounded-md text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditingBudget(null)}
                  className="flex-1 bg-muted text-muted-foreground py-2 px-4 rounded-md text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Delete Confirmation */}
      {deletingBudget && (
        <div className="fixed inset-0 z-50 bg-black/50" style={{ position: 'fixed' }}>
          <div className="flex items-center justify-center min-h-[100dvh] p-4">
            <div className="bg-background border rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setDeletingBudget(null)}
                  className="flex-1 bg-muted text-muted-foreground py-2 px-4 rounded-md text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};