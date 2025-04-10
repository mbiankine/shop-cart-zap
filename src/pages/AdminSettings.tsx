
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
      }
    };
    getUser();
    
    const fetchWhatsAppNumber = async () => {
      try {
        setIsLoading(true);
        const { data: settings, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'whatsapp_number')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 é "No rows found"
          throw error;
        }
        
        if (settings?.value) {
          setWhatsappNumber(settings.value);
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar configurações',
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWhatsAppNumber();
  }, [toast]);
  
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
  
  const handleChangeWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples do número
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      toast({
        variant: 'destructive',
        title: 'Número inválido',
        description: 'O número de WhatsApp deve ter pelo menos 10 dígitos.',
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Verificar se o registro já existe
      const { data: existingSettings } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'whatsapp_number')
        .maybeSingle();

      let result;
      
      if (existingSettings) {
        // Atualizar configuração existente
        result = await supabase
          .from('settings')
          .update({ value: whatsappNumber })
          .eq('key', 'whatsapp_number');
      } else {
        // Criar nova configuração
        result = await supabase
          .from('settings')
          .insert({ key: 'whatsapp_number', value: whatsappNumber });
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Configurações salvas',
        description: 'Número de WhatsApp atualizado com sucesso.',
      });
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar configurações',
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
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
            <form onSubmit={handleChangeWhatsApp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Número de WhatsApp da Loja</Label>
                <Input
                  id="whatsapp"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 11999999999 (apenas números)"
                  maxLength={15}
                />
                <p className="text-xs text-gray-500">
                  Digite apenas os números, incluindo o código de área.
                </p>
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Número'}
              </Button>
            </form>
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
