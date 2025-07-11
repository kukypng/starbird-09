import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Building2, Shield, Settings, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';

interface SettingsLiteProps {
  userId: string;
  profile: any;
  onBack: () => void;
}

export const SettingsLite = ({ userId, profile, onBack }: SettingsLiteProps) => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    company_name: profile?.company_name || '',
    company_phone: profile?.company_phone || '',
    dashboard_lite_enabled: localStorage.getItem('dashboard-lite-enabled') === 'true',
    force_normal_dashboard: localStorage.getItem('force-normal-dashboard') === 'true'
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save lite mode preference
      localStorage.setItem('dashboard-lite-enabled', formData.dashboard_lite_enabled.toString());
      
      // Save admin force normal dashboard preference
      if (profile?.role === 'admin') {
        localStorage.setItem('force-normal-dashboard', formData.force_normal_dashboard.toString());
        
        // If admin enabled force normal dashboard, redirect to normal dashboard
        if (formData.force_normal_dashboard) {
          window.location.href = '/dashboard';
          return;
        }
      }

      alert('Preferências salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'company', name: 'Empresa', icon: Building2 },
    { id: 'app', name: 'App', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                type="text"
                inputMode="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                value={formData.email}
                disabled
                className="mt-1 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email não pode ser alterado aqui
              </p>
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                type="text"
                inputMode="text"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company_phone">Telefone da Empresa</Label>
              <Input
                id="company_phone"
                type="tel"
                inputMode="tel"
                value={formData.company_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, company_phone: e.target.value }))}
                className="mt-1"
                placeholder="(11) 3333-4444"
              />
            </div>
          </div>
        );

      case 'app':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dashboard iOS</Label>
                <p className="text-xs text-muted-foreground">
                  Manter versão otimizada para dispositivos móveis
                </p>
              </div>
              <Switch
                checked={formData.dashboard_lite_enabled}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, dashboard_lite_enabled: checked }))
                }
              />
            </div>
            
            {/* Admin Dashboard Toggle */}
            {profile?.role === 'admin' && (
              <div className="flex items-center justify-between">
                <div>
                  <Label>Forçar Dashboard Normal</Label>
                  <p className="text-xs text-muted-foreground">
                    Ignorar detecção de iPhone e usar dashboard completo
                  </p>
                </div>
                <Switch
                  checked={formData.force_normal_dashboard}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, force_normal_dashboard: checked }))
                  }
                />
              </div>
            )}
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                O Dashboard iOS mantém uma experiência otimizada para dispositivos móveis, 
                com interface simplificada e melhor performance.
                {profile?.role === 'admin' && (
                  <> Administradores podem forçar o uso do dashboard normal mesmo em dispositivos móveis.</>
                )}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Configurações</h1>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Section tabs */}
        <div className="p-4 border-b">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  {section.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {sections.find(s => s.id === activeSection)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>

          <div className="mt-4">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};