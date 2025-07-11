import React from 'react';
import { X, FileText, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface DashboardLiteSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardLiteSidebar = ({ 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose 
}: DashboardLiteSidebarProps) => {
  const { profile } = useAuth();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FileText,
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: FileText,
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-4">
          {/* Profile Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium">{profile?.name || 'Usuário'}</h3>
            <p className="text-sm text-muted-foreground">Role: {profile?.role}</p>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => handleTabChange(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="pt-4 space-y-2 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => handleTabChange('settings')}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};