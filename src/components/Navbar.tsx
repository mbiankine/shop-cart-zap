
import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const { state } = useStore();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Check if the current user is an admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user is in administrators table
          const { data } = await supabase
            .from('administrators')
            .select('*')
            .eq('id', user.id)
            .single();
            
          setIsAdmin(!!data);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
    
    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          checkAdmin();
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <nav className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="text-2xl font-bold text-blue-600">Catálogo Virtual</Link>
        
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Link to="/admin" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              <Shield className="mr-1 w-4 h-4" />
              Admin
            </Link>
          )}
          <Link to="/config" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </Link>
          <Link to="/cart">
            <Button variant="ghost" className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
