
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if there's any admin
  useEffect(() => {
    const checkAdmins = async () => {
      try {
        const { count, error } = await supabase
          .from('administrators')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        setHasAdmin(count !== null && count > 0);
        
        if (count !== null && count > 0) {
          // Redirect to login if there's already an admin
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admins:', error);
      }
    };
    
    checkAdmins();
  }, [navigate]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate password
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'As senhas não correspondem',
        description: 'Por favor, verifique se as senhas são idênticas.',
      });
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Add to administrators table
      if (authData.user) {
        const { error: adminError } = await supabase
          .from('administrators')
          .insert([
            { id: authData.user.id, email }
          ]);

        if (adminError) throw adminError;

        toast({
          title: 'Administrador criado com sucesso!',
          description: 'Você agora pode fazer login como administrador.',
        });
        
        // Sign out after creation
        await supabase.auth.signOut();
        
        // Redirect to login
        navigate('/admin/login');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar administrador',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasAdmin) {
    return null; // Don't render anything, will redirect to login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Administrador</CardTitle>
          <CardDescription className="text-center">
            Esta é a tela de primeiro acesso. Crie uma conta de administrador para gerenciar o catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Administrador'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Voltar para o catálogo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateAdmin;
