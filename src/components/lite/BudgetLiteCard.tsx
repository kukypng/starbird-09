import React from 'react';
import { MessageCircle, FileText, Edit, Trash2 } from 'lucide-react';
import { BudgetLiteStatusBadge } from './BudgetLiteStatusBadge';

interface BudgetLiteCardProps {
  budget: any;
  profile: any;
  onShareWhatsApp: (budget: any) => void;
  onViewPDF: (budget: any) => void;
  onEdit: (budget: any) => void;
  onDelete: (budget: any) => void;
}

export const BudgetLiteCard = ({
  budget,
  profile,
  onShareWhatsApp,
  onViewPDF,
  onEdit,
  onDelete
}: BudgetLiteCardProps) => {
  if (!budget || !budget.id || budget.deleted_at) {
    return null;
  }

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">
            {budget.device_model || 'Dispositivo não informado'}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {budget.device_type || 'Tipo não informado'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {budget.created_at ? formatDate(budget.created_at) : 'Data não informada'}
        </span>
      </div>

      {/* Client Info */}
      {budget.client_name && (
        <div className="mb-3">
          <p className="text-sm text-primary font-medium">
            Cliente: {budget.client_name}
          </p>
        </div>
      )}

      {/* Status Badge - Advanced Features */}
      {profile?.advanced_features_enabled && (
        <div className="mb-3">
          <BudgetLiteStatusBadge 
            status={budget.workflow_status || 'pending'}
            isPaid={budget.is_paid || false}
            isDelivered={budget.is_delivered || false}
            expiresAt={budget.expires_at}
          />
        </div>
      )}

      {/* Service/Issue */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground font-medium">Serviço:</p>
        <p className="text-sm">{budget.issue || 'Problema não informado'}</p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-lg font-bold text-foreground">
          {formatPrice(budget.total_price || 0)}
        </p>
        {budget.installments > 1 && (
          <p className="text-xs text-muted-foreground">
            {budget.installments}x
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onShareWhatsApp(budget)}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium hover:bg-green-100"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
        
        <button
          onClick={() => onViewPDF(budget)}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-100"
        >
          <FileText className="h-4 w-4" />
          Ver PDF
        </button>
        
        <button
          onClick={() => onEdit(budget)}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md text-sm font-medium hover:bg-yellow-100"
        >
          <Edit className="h-4 w-4" />
          Editar
        </button>
        
        <button
          onClick={() => onDelete(budget)}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      </div>
    </div>
  );
};