
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('name')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData.map(cat => cat.name));

        // Fetch products
        let query = supabase
          .from('products')
          .select('*')
          .order('name');
          
        // Apply category filter if selected
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        const { data: productsData, error: productsError } = await query;
        
        if (productsError) throw productsError;
        
        // Map to Product type
        const mappedProducts: Product[] = productsData.map(item => ({
          id: parseInt(item.id.substring(0, 8), 16), // Convert UUID to number for compatibility
          name: item.name,
          price: parseFloat(String(item.price)), // Convert to string first to ensure it works
          image: item.image_url,
          category: item.category,
          description: item.description || ''
        }));
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-center">Nossos Produtos</h1>
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Carregando produtos...</p>
          </div>
        ) : (
          products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto encontrado{selectedCategory ? ` na categoria ${selectedCategory}` : ''}.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Index;
