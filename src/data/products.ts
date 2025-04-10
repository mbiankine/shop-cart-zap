
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 1,
    name: 'Camisa Polo Azul',
    price: 89.90,
    image: '/images/camisa-polo.jpg',
    category: 'Roupas',
    description: 'Camisa polo de algodão premium, ideal para o dia a dia.'
  },
  {
    id: 2,
    name: 'Tênis Esportivo',
    price: 249.90,
    image: '/images/tenis.jpg',
    category: 'Calçados',
    description: 'Tênis com amortecimento e suporte para atividades físicas.'
  },
  {
    id: 3,
    name: 'Relógio Digital',
    price: 120.00,
    image: '/images/relogio.jpg',
    category: 'Acessórios',
    description: 'Relógio resistente à água com múltiplas funções.'
  },
  {
    id: 4,
    name: 'Mochila Moderna',
    price: 189.90,
    image: '/images/mochila.jpg',
    category: 'Acessórios',
    description: 'Mochila resistente com compartimentos para notebook.'
  },
  {
    id: 5,
    name: 'Calça Jeans',
    price: 129.90,
    image: '/images/calca.jpg',
    category: 'Roupas',
    description: 'Calça jeans de alta qualidade e modelagem moderna.'
  },
  {
    id: 6,
    name: 'Óculos de Sol',
    price: 99.90,
    image: '/images/oculos.jpg',
    category: 'Acessórios',
    description: 'Óculos de sol com proteção UV e armação resistente.'
  },
  {
    id: 7,
    name: 'Camiseta Básica',
    price: 49.90,
    image: '/images/camiseta.jpg',
    category: 'Roupas',
    description: 'Camiseta básica de algodão, disponível em várias cores.'
  },
  {
    id: 8,
    name: 'Carteira Couro',
    price: 79.90,
    image: '/images/carteira.jpg',
    category: 'Acessórios',
    description: 'Carteira de couro genuíno com múltiplos compartimentos.'
  }
];

export const categories = Array.from(
  new Set(products.map(product => product.category))
);
