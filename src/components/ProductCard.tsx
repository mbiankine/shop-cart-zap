
import React from 'react';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useStore();

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success('Produto adicionado ao carrinho!');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="overflow-hidden bg-gray-100 aspect-square">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x400?text=Imagem+Indisponível';
            }} 
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-1 text-xs font-medium text-blue-600">{product.category}</div>
        <h3 className="mb-2 text-lg font-medium">{product.name}</h3>
        <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={addToCart}
          className="w-full"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
