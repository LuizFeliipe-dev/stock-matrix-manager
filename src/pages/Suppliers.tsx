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
  ToggleLeft
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
import { Textarea } from '@/components/ui/textarea';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const supplierFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  contact: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface Supplier {
  id: string;
  name: string;
  active: boolean;
  accessLogId: string;
  createdAt: string;
  updatedAt: string;
}

const initialSuppliers: Supplier[] = [
  {
    id: "d5bd8aba-c090-475f-8dd8-79e929dc6960",
    name: "Fornecedor Tech Ltda",
    active: true,
    accessLogId: "3255de7b-701a-4bf1-8547-b845b483d0bd",
    createdAt: "2025-05-29T20:23:48.461Z",
    updatedAt: "2025-05-29T20:23:48.461Z"
  },
  {
    id: "005fa7c0-1e10-4ab7-b4dc-6f5b129cf240",
    name: "Móveis Premium SA",
    active: true,
    accessLogId: "3255de7b-701a-4bf1-8547-b845b483d0bd",
    createdAt: "2025-05-29T20:23:48.461Z",
    updatedAt: "2025-05-29T20:23:48.461Z"
  },
  {
    id: "eaf59975-66f9-40a8-b34b-0e93e1e47474",
    name: "Distribuidora de Alimentos",
    active: true,
    accessLogId: "3255de7b-701a-4bf1-8547-b845b483d0bd",
    createdAt: "2025-05-29T20:23:48.461Z",
    updatedAt: "2025-05-29T20:23:48.461Z"
  },
  {
    id: "eaf7edf5-09a3-4a7a-b15b-911e2171e4b4",
    name: "Croissant & Cia",
    active: true,
    accessLogId: "5afc1d1b-d821-4ba3-af1f-efbdd14610f8",
    createdAt: "2025-05-29T23:56:30.134Z",
    updatedAt: "2025-05-29T23:56:30.134Z"
  }
];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cnpj: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contact: '',
      notes: '',
      active: true,
    },
  });

  const onSubmit = (data: SupplierFormValues) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(supplier => {
        if (supplier.id === editingSupplier.id) {
          return {
            ...supplier,
            name: data.name,
            active: data.active,
            updatedAt: new Date().toISOString(),
          };
        }
        return supplier;
      }));

      toast({
        title: "Fornecedor atualizado",
        description: "As informações do fornecedor foram atualizadas com sucesso",
      });
    } else {
      const newSupplier: Supplier = {
        id: crypto.randomUUID(),
        name: data.name,
        active: data.active,
        accessLogId: "3255de7b-701a-4bf1-8547-b845b483d0bd",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSuppliers([...suppliers, newSupplier]);

      toast({
        title: "Fornecedor adicionado",
        description: "Novo fornecedor foi adicionado com sucesso",
      });
    }

    setOpenDialog(false);
    form.reset();
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
      cnpj: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contact: '',
      notes: '',
      active: true,
    });
    setOpenDialog(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.reset({
      name: supplier.name,
      email: '',
      phone: '',
      cnpj: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contact: '',
      notes: '',
      active: supplier.active,
    });
    setOpenDialog(true);
  };

  const handleToggleSupplierStatus = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (selectedSupplier) {
      setSuppliers(suppliers.map(supplier => {
        if (supplier.id === selectedSupplier.id) {
          return {
            ...supplier,
            active: !supplier.active,
            updatedAt: new Date().toISOString(),
          };
        }
        return supplier;
      }));

      toast({
        title: selectedSupplier.active ? "Fornecedor inativado" : "Fornecedor ativado",
        description: `O fornecedor ${selectedSupplier.name} foi ${selectedSupplier.active ? "inativado" : "ativado"} com sucesso.`,
      });
      setStatusDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
                    {filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 5} className="text-center py-6 text-muted-foreground">
                          Nenhum fornecedor encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          {!isMobile && <TableCell>{formatDate(supplier.createdAt)}</TableCell>}
                          {!isMobile && <TableCell>{formatDate(supplier.updatedAt)}</TableCell>}
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
              
              <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left">
                  Exibindo {filteredSuppliers.length} de {suppliers.length} fornecedores
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
        <DialogContent className="sm:max-w-[600px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}
            </DialogTitle>
            <DialogDescription>
              {editingSupplier 
                ? 'Edite as informações do fornecedor abaixo.' 
                : 'Preencha os campos abaixo para adicionar um novo fornecedor.'}
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
                      <FormLabel>Nome do Fornecedor *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fornecedor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000/0000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pessoa de Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da pessoa responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais sobre o fornecedor..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSupplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSupplier?.active ? "Inativar" : "Ativar"} Fornecedor
            </DialogTitle>
            <DialogDescription>
              {selectedSupplier?.active
                ? "Você tem certeza que deseja inativar este fornecedor? Fornecedores inativos não aparecem nas operações padrão."
                : "Você tem certeza que deseja ativar este fornecedor? Fornecedores ativos aparecem em todas as operações."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant={selectedSupplier?.active ? "destructive" : "default"}
              onClick={confirmToggleStatus}
            >
              {selectedSupplier?.active ? "Sim, inativar" : "Sim, ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Suppliers;
