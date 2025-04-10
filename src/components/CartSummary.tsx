
import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CartSummary: React.FC = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const sendToWhatsApp = () => {
    if (!state.whatsappNumber) {
      toast.error('Por favor, configure o número de WhatsApp da loja nas configurações.');
      navigate('/config');
      return;
    }

    if (state.cart.length === 0) {
      toast.error('Seu carrinho está vazio.');
      return;
    }

    try {
      // Create the message with the cart items
      const message = `*Novo Pedido*\n\n${state.cart
        .map(item => `*${item.name}*\nQuantidade: ${item.quantity}\nPreço unitário: ${formatPrice(item.price)}\nSubtotal: ${formatPrice(item.price * item.quantity)}\n`)
        .join('\n')}
        \n*Total do Pedido: ${formatPrice(subtotal)}*`;

      // Format WhatsApp number (remove any non-numeric character)
      const whatsappNumber = state.whatsappNumber.replace(/\D/g, '');

      // Create the WhatsApp URL with the message
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp in a new tab
      window.open(whatsappURL, '_blank');

      // Clear the cart after sending
      dispatch({ type: 'CLEAR_CART' });

      toast.success('Pedido enviado para o WhatsApp da loja!');
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o pedido. Por favor, tente novamente.');
      console.error('Error sending WhatsApp message:', error);
    }
  };

  return (
    <div className="p-6 space-y-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold">Resumo do Pedido</h3>
      <div className="flex justify-between py-2 border-b">
        <span>Quantidade de itens</span>
        <span>{totalItems}</span>
      </div>
      <div className="flex justify-between py-2 text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <Button 
        onClick={sendToWhatsApp} 
        className="w-full"
      >
        <Send className="w-4 h-4 mr-2" />
        Finalizar Pedido via WhatsApp
      </Button>
      {!state.whatsappNumber && (
        <p className="text-sm text-red-500">
          Configure o número de WhatsApp nas configurações.
        </p>
      )}
    </div>
  );
};

export default CartSummary;
