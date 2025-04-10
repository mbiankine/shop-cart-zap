
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WhatsAppInput from '@/components/WhatsAppInput';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const { state } = useStore();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'As senhas não correspondem.',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi atualizada com sucesso.',
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar senha',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch user email
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
      }
    };
    getUser();
  }, []);
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Configurações</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Loja</CardTitle>
            <CardDescription>Configure as informações de contato da loja</CardDescription>
          </CardHeader>
          <CardContent>
            <WhatsAppInput />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conta de Administrador</CardTitle>
            <CardDescription>Gerencie as configurações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={email} 
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">Para alterar o email, contate o suporte.</p>
            </div>
            
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Alterando...' : 'Alterar senha'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
