import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Ruler, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const shelfTypeFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  height: z.coerce.number().min(0.1, { message: 'Altura deve ser maior que zero' }),
  width: z.coerce.number().min(0.1, { message: 'Largura deve ser maior que zero' }),
  depth: z.coerce.number().min(0.1, { message: 'Profundidade deve ser maior que zero' }),
  maxWeight: z.coerce.number().min(0.1, { message: 'Peso máximo deve ser maior que zero' }),
  canStackAbove: z.boolean().default(false),
});

type ShelfTypeFormValues = z.infer<typeof shelfTypeFormSchema>;

interface ShelfType {
  id: number;
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
  canStackAbove: boolean;
}

// Mock data
const initialShelfTypes: ShelfType[] = [
  {
    id: 1,
    name: 'Prateleira Padrão',
    height: 2.0,
    width: 1.2,
    depth: 0.6,
    maxWeight: 400,
    canStackAbove: true,
  },
  {
    id: 2,
    name: 'Prateleira Reforçada',
    height: 2.5,
    width: 1.5,
    depth: 0.8,
    maxWeight: 800,
    canStackAbove: false,
  },
  {
    id: 3,
    name: 'Prateleira Pequena',
    height: 1.5,
    width: 0.8,
    depth: 0.4,
    maxWeight: 200,
    canStackAbove: true,
  },
];

const ShelfTypes = () => {
  const [shelfTypes, setShelfTypes] = useState<ShelfType[]>(initialShelfTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShelfType, setEditingShelfType] = useState<ShelfType | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<ShelfTypeFormValues>({
    resolver: zodResolver(shelfTypeFormSchema),
    defaultValues: {
      name: '',
      height: 0,
      width: 0,
      depth: 0,
      maxWeight: 0,
      canStackAbove: false,
    }
  });

  const handleAddShelfType = () => {
    setEditingShelfType(null);
    form.reset({
      name: '',
      height: 0,
      width: 0,
      depth: 0,
      maxWeight: 0,
      canStackAbove: false,
    });
    setOpenDialog(true);
  };

  const handleEditShelfType = (shelfType: ShelfType) => {
    setEditingShelfType(shelfType);
    form.reset({
      name: shelfType.name,
      height: shelfType.height,
      width: shelfType.width,
      depth: shelfType.depth,
      maxWeight: shelfType.maxWeight,
      canStackAbove: shelfType.canStackAbove,
    });
    setOpenDialog(true);
  };

  const handleDeleteShelfType = (id: number) => {
    setShelfTypes(shelfTypes.filter(t => t.id !== id));
    toast({
      title: "Tipo de prateleira excluído",
      description: "O tipo de prateleira foi removido com sucesso",
    });
  };

  const onSubmit = (data: ShelfTypeFormValues) => {
    if (editingShelfType) {
      setShelfTypes(shelfTypes.map(t => {
        if (t.id === editingShelfType.id) {
          return {
            ...t,
            name: data.name,
            height: data.height,
            width: data.width,
            depth: data.depth,
            maxWeight: data.maxWeight,
            canStackAbove: data.canStackAbove,
          };
        }
        return t;
      }));
      toast({
        title: "Tipo de prateleira atualizado",
        description: "As informações do tipo de prateleira foram atualizadas com sucesso",
      });
    } else {
      const newShelfType: ShelfType = {
        id: Math.max(0, ...shelfTypes.map(t => t.id)) + 1,
        name: data.name,
        height: data.height,
        width: data.width,
        depth: data.depth,
        maxWeight: data.maxWeight,
        canStackAbove: data.canStackAbove,
      };
      setShelfTypes([...shelfTypes, newShelfType]);
      toast({
        title: "Tipo de prateleira adicionado",
        description: "Novo tipo de prateleira foi adicionado com sucesso",
      });
    }
    setOpenDialog(false);
  };

  const filteredShelfTypes = shelfTypes.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <Ruler className="mr-3 h-6 w-6 text-primary" />
                  Tipos de Prateleiras
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie as configurações para tipos de prateleiras
                </p>
              </div>
              
              <Button onClick={handleAddShelfType}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Tipo
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 border-b">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Dimensões (m)</TableHead>
                      <TableHead>Peso Máx. (kg)</TableHead>
                      <TableHead>Empilhável</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShelfTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          Nenhum tipo de prateleira encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShelfTypes.map((shelfType) => (
                        <TableRow key={shelfType.id}>
                          <TableCell className="font-medium">{shelfType.name}</TableCell>
                          <TableCell>{`${shelfType.height} × ${shelfType.width} × ${shelfType.depth}`}</TableCell>
                          <TableCell>{shelfType.maxWeight}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              shelfType.canStackAbove
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {shelfType.canStackAbove ? 'Sim' : 'Não'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditShelfType(shelfType)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteShelfType(shelfType.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingShelfType ? 'Editar Tipo de Prateleira' : 'Adicionar Novo Tipo de Prateleira'}</DialogTitle>
            <DialogDescription>
              {editingShelfType 
                ? 'Edite as informações do tipo de prateleira abaixo.' 
                : 'Preencha os campos abaixo para adicionar um novo tipo de prateleira.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do tipo de prateleira" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura (m)</FormLabel>
                      <FormControl>
                        <Input placeholder="2.0" type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Largura (m)</FormLabel>
                      <FormControl>
                        <Input placeholder="1.2" type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profundidade (m)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.6" type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso máximo (kg)</FormLabel>
                      <FormControl>
                        <Input placeholder="400" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="canStackAbove"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Empilhável</FormLabel>
                      <FormDescription>
                        Pode ter outras prateleiras em cima
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingShelfType ? 'Salvar Alterações' : 'Cadastrar Tipo'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default ShelfTypes;
