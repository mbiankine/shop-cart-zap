
import React from 'react';
import Navbar from '@/components/Navbar';
import WhatsAppInput from '@/components/WhatsAppInput';

const ConfigPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-center">Configurações</h1>
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Configurações do WhatsApp</h2>
            <WhatsAppInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
