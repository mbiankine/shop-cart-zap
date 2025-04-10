
import React, { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

const WhatsAppInput: React.FC = () => {
  const { state, dispatch } = useStore();
  const [number, setNumber] = useState(state.whatsappNumber);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/\D/g, '');
    setNumber(value);
  };

  const saveNumber = () => {
    // Validate number (simple validation for example)
    if (number.length < 10) {
      toast.error('Por favor, insira um número de WhatsApp válido.');
      return;
    }

    dispatch({ type: 'SET_WHATSAPP_NUMBER', payload: number });
    toast.success('Número de WhatsApp salvo com sucesso!');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="whatsapp">Número de WhatsApp da Loja</Label>
        <Input
          id="whatsapp"
          value={number}
          onChange={handleChange}
          placeholder="Ex: 11999999999 (apenas números)"
          maxLength={15}
        />
        <p className="text-xs text-gray-500">
          Digite apenas os números, incluindo o código de área.
        </p>
      </div>
      <Button onClick={saveNumber}>Salvar Número</Button>
    </div>
  );
};

export default WhatsAppInput;
