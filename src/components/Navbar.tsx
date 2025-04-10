
import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { state } = useStore();
  
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="text-2xl font-bold text-blue-600">Catálogo Virtual</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/config" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Configurações
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
