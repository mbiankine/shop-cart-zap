
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash2, Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Fetch products and categories
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar dados',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: name === 'price' ? parseFloat(value) : value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setCurrentProduct({});
    setIsEditing(false);
    setIsSheetOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };
  
  // Função para fazer upload da imagem
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // Criar nome de arquivo único usando timestamp e nome original
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      // Upload da imagem para URL externa (neste exemplo)
      // Aqui você pode implementar o upload para qualquer serviço de sua preferência
      // Como esta é uma demonstração, vou simular o upload retornando o preview como URL
      
      // Simular um delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um caso real, você faria o upload para um serviço como:
      // const { data, error } = await supabase.storage
      //  .from('product-images')
      //  .upload(fileName, file);
      
      // Para esta demonstração, retornamos a URL do preview ou uma URL fixa
      return imagePreview || 'https://via.placeholder.com/300x300?text=Produto';
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      throw new Error('Falha ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddEdit = async () => {
    try {
      if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
        toast({
          variant: 'destructive',
          title: 'Campos obrigatórios',
          description: 'Preencha todos os campos obrigatórios.',
        });
        return;
      }

      let imageUrl = currentProduct.image_url;
      
      // Se tiver um arquivo de imagem novo, fazer upload
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      } else if (!imageUrl && !isEditing) {
        // Se não tem imagem URL e não é edição, usar um placeholder
        imageUrl = 'https://via.placeholder.com/300x300?text=Sem+Imagem';
      }

      if (isEditing && currentProduct.id) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update({
            name: currentProduct.name,
            price: currentProduct.price,
            image_url: imageUrl,
            category: currentProduct.category,
            description: currentProduct.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentProduct.id);

        if (error) throw error;
        toast({
          title: 'Produto atualizado',
          description: 'O produto foi atualizado com sucesso.'
        });
      } else {
        // Insert new product
        const { error } = await supabase
          .from('products')
          .insert({
            name: currentProduct.name,
            price: currentProduct.price,
            image_url: imageUrl,
            category: currentProduct.category,
            description: currentProduct.description,
          });

        if (error) throw error;
        toast({
          title: 'Produto adicionado',
          description: 'O produto foi adicionado com sucesso.'
        });
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar produto',
        description: error.message,
      });
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsSheetOpen(true);
    // Se o produto já tiver imagem, mostrar no preview
    if (product.image_url) {
      setImagePreview(product.image_url);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Produto excluído',
          description: 'O produto foi excluído com sucesso.'
        });

        fetchProducts();
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir produto',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
        <Button onClick={() => {
          resetForm();
          setIsSheetOpen(true);
        }} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Adicionar Produto</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/48?text=Erro';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(product)}
                          className="flex items-center gap-1"
                        >
                          <Pencil size={16} />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center gap-1 text-red-500"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</SheetTitle>
            <SheetDescription>
              {isEditing ? 'Atualize os detalhes do produto' : 'Adicione um novo produto ao catálogo'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input 
                id="name" 
                name="name"
                value={currentProduct.name || ''} 
                onChange={handleInputChange} 
                placeholder="Nome do produto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <select
                id="category"
                name="category"
                value={currentProduct.category || ''}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input 
                id="price" 
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={currentProduct.price || ''} 
                onChange={handleInputChange} 
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagem do Produto</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="border rounded-md p-2 flex items-center justify-center bg-gray-50 h-32 relative">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Image size={24} className="mb-2" />
                      <span className="text-sm">Clique para selecionar</span>
                    </div>
                  </div>
                </div>
                <div>
                  {isUploading ? (
                    <div className="h-32 flex items-center justify-center border rounded-md bg-gray-50">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    imagePreview || currentProduct.image_url ? (
                      <div className="h-32 border rounded-md overflow-hidden bg-gray-50">
                        <img
                          src={imagePreview || currentProduct.image_url}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/150?text=Erro+na+imagem';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center border rounded-md bg-gray-50">
                        <span className="text-gray-400 text-sm">Sem imagem</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selecione uma imagem para o produto. Formatos suportados: JPG, PNG.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description"
                value={currentProduct.description || ''} 
                onChange={handleInputChange} 
                placeholder="Descrição do produto"
              />
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button 
              onClick={handleAddEdit}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
