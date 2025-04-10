
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Package,
  Grid,
  Settings,
  LogOut 
} from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Logout bem-sucedido',
      description: 'Você foi desconectado do painel administrativo',
    });
    navigate('/admin/login');
  };

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <Link to="/admin/products">
            <Button variant="ghost" className="flex items-center gap-2">
              <Package size={18} />
              <span>Produtos</span>
            </Button>
          </Link>
          
          <Link to="/admin/categories">
            <Button variant="ghost" className="flex items-center gap-2">
              <Grid size={18} />
              <span>Categorias</span>
            </Button>
          </Link>
          
          <Link to="/admin/settings">
            <Button variant="ghost" className="flex items-center gap-2">
              <Settings size={18} />
              <span>Configurações</span>
            </Button>
          </Link>
          
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={18} />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
