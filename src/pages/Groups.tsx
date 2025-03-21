import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  FolderRoot, 
  Plus, 
  Search, 
  Pencil, 
  Trash2,
  Settings, 
  BarChart4,
  HashIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const groupFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  code: z.string().min(2, { message: 'Código deve ter pelo menos 2 caracteres' }),
  description: z.string().optional(),
  taxRate: z.coerce.number().min(0, { message: 'Taxa não pode ser negativa' }).max(100, { message: 'Taxa não pode ser maior que 100%' }),
  minStock: z.coerce.number().min(0, { message: 'Estoque mínimo não pode ser negativo' }),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface Group {
  id: string;
  name: string;
  code: string;
  description: string;
  taxRate: number;
  minStock: number;
  itemCount: number;
}

const initialGroups: Group[] = [
  {
    id: '1',
    name: 'Eletrônicos',
    code: 'ELE',
    description: 'Produtos eletrônicos como computadores, celulares e acessórios',
    taxRate: 12.5,
    minStock: 5,
    itemCount: 38,
  },
  {
    id: '2',
    name: 'Móveis',
    code: 'MOV',
    description: 'Mobiliário para escritório e residência',
    taxRate: 8.5,
    minStock: 3,
    itemCount: 24,
  },
  {
    id: '3',
    name: 'Alimentos',
    code: 'ALI',
    description: 'Produtos alimentícios não perecíveis',
    taxRate: 5.0,
    minStock: 10,
    itemCount: 56,
  },
  {
    id: '4',
    name: 'Acessórios',
    code: 'ACE',
    description: 'Acessórios diversos para computadores e outros dispositivos',
    taxRate: 10.0,
    minStock: 8,
    itemCount: 42,
  },
];

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      taxRate: 0,
      minStock: 0,
    },
  });

  const onSubmit = (data: GroupFormValues) => {
    if (editingGroup) {
      setGroups(groups.map(group => {
        if (group.id === editingGroup.id) {
          return {
            ...group,
            name: data.name,
            code: data.code,
            description: data.description || '',
            taxRate: data.taxRate,
            minStock: data.minStock,
          };
        }
        return group;
      }));

      toast({
        title: "Categoria atualizada",
        description: "As informações da categoria foram atualizadas com sucesso",
      });
    } else {
      const newGroup: Group = {
        id: (groups.length + 1).toString(),
        name: data.name,
        code: data.code,
        description: data.description || '',
        taxRate: data.taxRate,
        minStock: data.minStock,
        itemCount: 0,
      };

      setGroups([...groups, newGroup]);

      toast({
        title: "Categoria adicionada",
        description: "Nova categoria foi adicionada com sucesso",
      });
    }

    setOpenDialog(false);
    form.reset();
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    form.reset({
      name: '',
      code: '',
      description: '',
      taxRate: 0,
      minStock: 0,
    });
    setOpenDialog(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    form.reset({
      name: group.name,
      code: group.code,
      description: group.description,
      taxRate: group.taxRate,
      minStock: group.minStock,
    });
    setOpenDialog(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    toast({
      title: "Categoria excluída",
      description: "A categoria foi removida com sucesso",
    });
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthRequired>
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <FolderRoot className="mr-3 h-6 w-6 text-primary" />
                  Cadastro de Categorias
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie as categorias de itens do sistema
                </p>
              </div>
              
              <Button onClick={handleAddGroup}>
                <Plus className="mr-2 h-5 w-5" />
                Nova Categoria
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 border-b">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar categorias..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      {!isMobile && <TableHead>Descrição</TableHead>}
                      {!isMobile && <TableHead>Taxa (%)</TableHead>}
                      <TableHead>Est. Mín.</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.code}</TableCell>
                        <TableCell>{group.name}</TableCell>
                        {!isMobile && <TableCell className="max-w-xs truncate">{group.description}</TableCell>}
                        {!isMobile && <TableCell>{group.taxRate.toFixed(1)}%</TableCell>}
                        <TableCell>{group.minStock}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {group.itemCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditGroup(group)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t flex flex-wrap justify-between items-center gap-3">
                <div className="text-sm text-gray-500">
                  Exibindo {filteredGroups.length} de {groups.length} categorias
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">Próxima</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingGroup 
                ? 'Edite as informações da categoria abaixo.' 
                : 'Preencha os campos abaixo para adicionar uma nova categoria.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="ELE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição da categoria" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Taxa aplicada aos itens desta categoria
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Estoque mínimo padrão para os itens desta categoria
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingGroup ? 'Salvar Alterações' : 'Cadastrar Categoria'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Groups;
