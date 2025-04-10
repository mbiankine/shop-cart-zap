
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
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const { toast } = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar categorias',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const resetForm = () => {
    setCurrentCategory({});
    setIsEditing(false);
    setIsSheetOpen(false);
  };

  const handleAddEdit = async () => {
    try {
      if (!currentCategory.name) {
        toast({
          variant: 'destructive',
          title: 'Campo obrigatório',
          description: 'O nome da categoria é obrigatório.',
        });
        return;
      }

      if (isEditing && currentCategory.id) {
        // Update category
        const { error } = await supabase
          .from('categories')
          .update({
            name: currentCategory.name,
          })
          .eq('id', currentCategory.id);

        if (error) throw error;
        toast({
          title: 'Categoria atualizada',
          description: 'A categoria foi atualizada com sucesso.'
        });
      } else {
        // Insert new category
        const { error } = await supabase
          .from('categories')
          .insert({
            name: currentCategory.name,
          });

        if (error) throw error;
        toast({
          title: 'Categoria adicionada',
          description: 'A categoria foi adicionada com sucesso.'
        });
      }

      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar categoria',
        description: error.message,
      });
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        // Check if category is used in products
        const { data: products, error: checkError } = await supabase
          .from('products')
          .select('id')
          .eq('category', categories.find(c => c.id === id)?.name || '')
          .limit(1);

        if (checkError) throw checkError;

        if (products && products.length > 0) {
          toast({
            variant: 'destructive',
            title: 'Não é possível excluir',
            description: 'Esta categoria está sendo usada por produtos existentes.',
          });
          return;
        }

        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Categoria excluída',
          description: 'A categoria foi excluída com sucesso.'
        });

        fetchCategories();
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir categoria',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
        <Button onClick={() => {
          resetForm();
          setIsSheetOpen(true);
        }} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Adicionar Categoria</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(category)}
                          className="flex items-center gap-1"
                        >
                          <Pencil size={16} />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(category.id)}
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
                  <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                    Nenhuma categoria encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{isEditing ? 'Editar Categoria' : 'Adicionar Categoria'}</SheetTitle>
            <SheetDescription>
              {isEditing ? 'Atualize o nome da categoria' : 'Adicione uma nova categoria ao catálogo'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria *</Label>
              <Input 
                id="name" 
                name="name"
                value={currentCategory.name || ''} 
                onChange={handleInputChange} 
                placeholder="Nome da categoria"
                required
              />
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button onClick={handleAddEdit}>{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminCategories;
