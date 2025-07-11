import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload, Trash2, Database, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DataManagementLiteProps {
  userId: string;
  onBack: () => void;
}

export const DataManagementLite = ({ userId, onBack }: DataManagementLiteProps) => {
  const [stats, setStats] = useState({
    totalBudgets: 0,
    deletedBudgets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simplified stats for lite version
    setStats({
      totalBudgets: 0,
      deletedBudgets: 0
    });
    setLoading(false);
  }, [userId]);

  const handleExport = async () => {
    alert('Funcionalidade de exportação será implementada em breve para a versão lite.');
  };

  const handleEmptyTrash = async () => {
    if (!confirm('Deseja realmente esvaziar a lixeira? Esta ação não pode ser desfeita.')) {
      return;
    }
    alert('Funcionalidade será implementada em breve para a versão lite.');
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Gestão de Dados</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {loading ? '--' : stats.totalBudgets}
              </div>
              <div className="text-sm text-muted-foreground">
                Orçamentos Ativos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Trash2 className="h-8 w-8 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {loading ? '--' : stats.deletedBudgets}
              </div>
              <div className="text-sm text-muted-foreground">
                Na Lixeira
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Baixe todos os seus orçamentos em formato CSV
            </p>
            <Button 
              onClick={handleExport} 
              disabled={loading || stats.totalBudgets === 0}
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              Exportar para CSV
            </Button>
          </CardContent>
        </Card>

        {/* Import Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Funcionalidade em desenvolvimento para iPhone Safari
            </p>
            <Button disabled className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Em Breve
            </Button>
          </CardContent>
        </Card>

        {/* Trash Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Lixeira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {stats.deletedBudgets} orçamentos na lixeira
            </p>
            <Button 
              onClick={handleEmptyTrash}
              disabled={loading || stats.deletedBudgets === 0}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Esvaziar Lixeira
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};