
import React from 'react';
import Navbar from '@/components/Navbar';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { state } = useStore();
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-center">Carrinho de Compras</h1>
        
        {state.cart.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {state.cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="md:col-span-1">
              <CartSummary />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
            <h2 className="text-xl font-medium text-gray-500">Seu carrinho está vazio</h2>
            <p className="text-gray-400 text-center max-w-md">
              Parece que você ainda não adicionou nenhum produto ao seu carrinho.
            </p>
            <Link to="/">
              <Button>Continuar Comprando</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
