import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Shield, UserPlus, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
interface AdminLiteProps {
  userId: string;
  onBack: () => void;
}
export const AdminLite = ({
  userId,
  onBack
}: AdminLiteProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    expiredUsers: 0
  });
  useEffect(() => {
    if (!userId) return;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const {
          data,
          error
        } = await supabase.rpc('admin_get_all_users');
        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        const usersData = data || [];
        setUsers(usersData.slice(0, 10)); // Show only first 10 for lite version

        // Calculate stats
        const total = usersData.length;
        const active = usersData.filter((user: any) => user.license_expires_at && new Date(user.license_expires_at) > new Date()).length;
        const expired = total - active;
        setStats({
          totalUsers: total,
          activeUsers: active,
          expiredUsers: expired
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId]);
  const getLicenseStatus = (user: any) => {
    if (!user.license_expires_at) return 'Sem licença';
    const now = new Date();
    const expiresAt = new Date(user.license_expires_at);
    if (expiresAt > now) {
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `${daysLeft} dias restantes`;
    } else {
      return 'Expirada';
    }
  };
  const getStatusColor = (user: any) => {
    if (!user.license_expires_at) return 'bg-gray-500/20 text-gray-900 dark:text-gray-200';
    const now = new Date();
    const expiresAt = new Date(user.license_expires_at);
    if (expiresAt > now) {
      return 'bg-green-500/20 text-green-900 dark:text-green-200';
    } else {
      return 'bg-red-500/20 text-red-900 dark:text-red-200';
    }
  };
  return <div className="h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Painel Admin</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card>
            <CardContent className="p-3 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">
                {loading ? '--' : stats.totalUsers}
              </div>
              <div className="text-xs text-muted-foreground">
                Total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <div className="text-lg font-bold">
                {loading ? '--' : stats.activeUsers}
              </div>
              <div className="text-xs text-muted-foreground">
                Ativos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              <UserPlus className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <div className="text-lg font-bold">
                {loading ? '--' : stats.expiredUsers}
              </div>
              <div className="text-xs text-muted-foreground">
                Expirados
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" disabled>
              <UserPlus className="mr-2 h-4 w-4" />
              Criar Usuário (Em breve)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Settings className="mr-2 h-4 w-4" />
              Configurações (Em breve)
            </Button>
          </CardContent>
        </Card>

        {/* Users List */}
        
      </div>
    </div>;
};