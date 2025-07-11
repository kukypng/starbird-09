import React, { useState } from 'react';
import { LifeBuoy, MessageCircle, X } from 'lucide-react';

export const DashboardLiteHelpSupport = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/556496028022', '_blank');
  };

  return (
    <>
      <div className="bg-card border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Precisa de ajuda?
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2"
          >
            <LifeBuoy className="h-4 w-4" />
            Ajuda & Dicas
          </button>
          
          <button
            onClick={handleWhatsAppSupport}
            className="w-full bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Suporte WhatsApp
          </button>
        </div>
      </div>

      {/* Simple modal for help - iOS Safari compatible */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" style={{ position: 'fixed' }}>
          <div className="flex items-center justify-center min-h-[100dvh] p-4">
            <div className="bg-background border rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ajuda & Dicas</h3>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Como criar um orçamento</h4>
                  <p className="text-muted-foreground">
                    Clique em "Novo Orçamento" e preencha as informações do cliente e produtos.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Como ver seus orçamentos</h4>
                  <p className="text-muted-foreground">
                    Use "Ver Orçamentos" para visualizar, editar ou excluir orçamentos existentes.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Gestão de dados</h4>
                  <p className="text-muted-foreground">
                    Importe/exporte dados, gerencie lixeira e faça backup das informações.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Configurações</h4>
                  <p className="text-muted-foreground">
                    Personalize seu perfil, empresa e preferências do sistema.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};