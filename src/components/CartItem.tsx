
import React from 'react';
import { CartItem as CartItemType } from '@/context/StoreContext';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useStore();

  const updateQuantity = (quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: item.id, quantity }
    });
  };

  const removeFromCart = () => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id: item.id }
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="flex items-center py-4 space-x-4 border-b">
      <div className="w-20 h-20 overflow-hidden bg-gray-100 rounded-md shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/80x80?text=Imagem+Indisponível';
          }}
        />
      </div>
      <div className="flex-1">
        <h3 className="mb-1 font-medium">{item.name}</h3>
        <p className="mb-2 text-sm text-gray-500">{item.category}</p>
        <p className="font-bold">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-8 h-8" 
          onClick={() => updateQuantity(item.quantity - 1)}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="w-8 h-8" 
          onClick={() => updateQuantity(item.quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={removeFromCart}
        className="text-gray-500 hover:text-red-500"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default CartItem;
