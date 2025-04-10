
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bem-vindo ao Painel Administrativo</h1>
      <p className="text-gray-600">
        Use a navegação acima para gerenciar seus produtos, categorias e configurações.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Produtos</h2>
          <p className="text-gray-500">Gerencie os produtos no catálogo.</p>
          <p className="mt-4 text-blue-600">Adicione, edite e remova produtos.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Categorias</h2>
          <p className="text-gray-500">Gerencie as categorias de produtos.</p>
          <p className="mt-4 text-blue-600">Organize seus produtos em categorias.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Configurações</h2>
          <p className="text-gray-500">Configure as opções da loja.</p>
          <p className="mt-4 text-blue-600">Altere o WhatsApp e outras configurações.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
