
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Truck, 
  Plus, 
  Search, 
  Pencil, 
  ToggleLeft,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSuppliers } from '@/hooks/useSuppliers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const supplierFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

const Suppliers = () => {
  const { suppliers, isLoading, createSupplier, updateSupplier } = useSuppliers();
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      contact: '',
      notes: '',
      active: true,
    },
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      const supplierData = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        contact: data.contact || undefined,
        notes: data.notes || undefined,
        active: data.active,
      };

      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, supplierData);
        toast({
          title: "Fornecedor atualizado",
          description: "As informações do fornecedor foram atualizadas com sucesso",
        });
      } else {
        await createSupplier(supplierData);
        toast({
          title: "Fornecedor adicionado",
          description: "Novo fornecedor foi adicionado com sucesso",
        });
      }

      setOpenDialog(false);
      form.reset();
      setEditingSupplier(null);
    } catch (error) {
      console.error('Failed to save supplier:', error);
    }
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
      address: '',
      contact: '',
      notes: '',
      active: true,
    });
    setOpenDialog(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier);
    form.reset({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      contact: supplier.contact || '',
      notes: supplier.notes || '',
      active: supplier.active,
    });
    setOpenDialog(true);
  };

  const handleToggleSupplierStatus = (supplier: any) => {
    setSelectedSupplier(supplier);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (selectedSupplier) {
      try {
        await updateSupplier(selectedSupplier.id, {
          active: !selectedSupplier.active
        });

        toast({
          title: selectedSupplier.active ? "Fornecedor inativado" : "Fornecedor ativado",
          description: `O fornecedor ${selectedSupplier.name} foi ${selectedSupplier.active ? "inativado" : "ativado"} com sucesso.`,
        });
      } catch (error) {
        console.error('Failed to toggle supplier status:', error);
      } finally {
        setStatusDialogOpen(false);
        setSelectedSupplier(null);
      }
    }
  };

  // Apply filters
  const filteredSuppliers = suppliers.filter(supplier => {
    // Text search
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = supplier.active;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !supplier.active;
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AuthRequired>
      <div className="min-h-screen flex">
        <Sidebar />
        
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold flex items-center">
                  <Truck className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
                  Cadastro de Fornecedores
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os fornecedores do sistema
                </p>
              </div>
              
              <Button onClick={handleAddSupplier} className={isMobile ? "w-full mt-4 md:mt-0" : ""}>
                <Plus className="mr-2 h-5 w-5" />
                Novo Fornecedor
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 md:p-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Buscar fornecedores..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="inactive">Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      {!isMobile && <TableHead>Data de Criação</TableHead>}
                      {!isMobile && <TableHead>Última Atualização</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 5} className="text-center py-6">
                          <div className="flex justify-center items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span>Carregando fornecedores...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 5} className="text-center py-6 text-muted-foreground">
                          {searchTerm || statusFilter !== 'all' ? 
                            "Nenhum fornecedor encontrado com os filtros aplicados." : 
                            "Nenhum fornecedor cadastrado."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          {!isMobile && <TableCell>
                            {format(new Date(supplier.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </TableCell>}
                          {!isMobile && <TableCell>
                            {format(new Date(supplier.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </TableCell>}
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              supplier.active 
                                ? 'bg-green-50 text-green-600 border border-green-200' 
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              {supplier.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditSupplier(supplier)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleToggleSupplierStatus(supplier)}
                              >
                                <ToggleLeft className="h-4 w-4" />
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
      

      <Dialog open={!!selectedEntry} onOpenChange={() => handleCloseModal()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalhes da Tarefa</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4 max-h-[calc(80vh-120px)] overflow-y-auto">
            {selectedEntry && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Pedido</Label>
                    <div className="font-medium">#{selectedEntry.orderNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <Label>Fornecedor</Label>
                    <div className="font-medium">{selectedEntry.supplier}</div>
                  </div>
                  <div className="space-y-1">
                    <Label>Itens</Label>
                    <div className="font-medium">{selectedEntry.items}</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={selectedStatus} 
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="received">Recebido</SelectItem>
                        <SelectItem value="inspection">Inspeção</SelectItem>
                        <SelectItem value="awaiting storage">Aguardando Armazenamento</SelectItem>
                        <SelectItem value="in storage process">Em Processo de Armazenamento</SelectItem>
                        <SelectItem value="allocated">Alocado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Produtos</h3>
                  <div className="space-y-4">
                    {[1, 2].map((index) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-md"
                      >
                        <div className="space-y-1">
                          <Label>Item</Label>
                          <div className="font-medium">Produto {index}</div>
                        </div>
                        <div className="space-y-1">
                          <Label>Quantidade</Label>
                          <div className="font-medium">{5 * index}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label>Tipo do Pacote</Label>
                          <div className="font-medium">{index === 1 ? "Caixa" : "Palete"}</div>
                        </div>

                        <div className="space-y-1">
                          <Label>Prateleira</Label>
                          <div className="font-medium">A{index}01</div>
                        </div>

                        <div className="space-y-1">
                          <Label>Empilhamento Máx</Label>
                          <div className="font-medium">{index}</div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>Largura (cm)</Label>
                            <div className="font-medium">{10 * index}</div>
                          </div>
                          <div className="space-y-1">
                            <Label>Comprimento (cm)</Label>
                            <div className="font-medium">{20 * index}</div>
                          </div>
                          <div className="space-y-1">
                            <Label>Altura (cm)</Label>
                            <div className="font-medium">{5 * index}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>Add commentMore actions
            <Button onClick={handleSaveStatus}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Suppliers;
