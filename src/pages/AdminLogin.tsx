
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminData) {
        // If not admin, sign out
        await supabase.auth.signOut();
        throw new Error('Usuário não tem permissão de administrador');
      }

      toast({
        title: 'Login bem-sucedido!',
        description: 'Bem-vindo ao painel administrativo.',
      });
      
      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: error.message || 'Ocorreu um erro durante o login.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login Administrativo</CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar o painel de administração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
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

export default AdminLogin;
