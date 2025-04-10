
import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, SettingsRow } from '@/integrations/supabase/client';

const CartSummary: React.FC = () => {
  const { state, dispatch } = useStore();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load the WhatsApp number from admin settings
    const fetchWhatsAppNumber = async () => {
      try {
        setIsLoading(true);
        // Fetch the WhatsApp number configured by admin
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'whatsapp_number')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
          console.error('Error fetching WhatsApp number:', error);
          return;
        }
        
        if (data?.value) {
          setWhatsappNumber(data.value);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhatsAppNumber();
  }, []);
  
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const sendToWhatsApp = () => {
    if (!whatsappNumber) {
      toast.error('Número de WhatsApp da loja não configurado. Entre em contato com o administrador.');
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
      const formattedNumber = whatsappNumber.replace(/\D/g, '');

      // Create the WhatsApp URL with the message
      const whatsappURL = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

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
        disabled={isLoading || !whatsappNumber}
      >
        <Send className="w-4 h-4 mr-2" />
        Finalizar Pedido via WhatsApp
      </Button>
      {!whatsappNumber && (
        <p className="text-sm text-red-500">
          Número de WhatsApp da loja não configurado.
        </p>
      )}
    </div>
  );
};

export default CartSummary;
