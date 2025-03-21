import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Warehouse, 
  Plus, 
  Search, 
  Pencil, 
  Trash2,
  MapPin
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
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
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const warehouseFormSchema = z.object({
  code: z.string().length(3, { message: 'Código deve ter exatamente 3 dígitos' })
    .regex(/^\d{3}$/, { message: 'Código deve conter apenas números' }),
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' }),
  state: z.string().length(2, { message: 'Estado deve ter 2 caracteres' }),
  manager: z.string().min(2, { message: 'Nome do gerente deve ter pelo menos 2 caracteres' }),
  totalArea: z.coerce.number().min(1, { message: 'Área deve ser maior que 0' }),
  totalCapacity: z.coerce.number().min(1, { message: 'Capacidade deve ser maior que 0' }),
});

type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  manager: string;
  totalArea: number;
  totalCapacity: number;
  currentOccupation: number;
}

const initialWarehouses: Warehouse[] = [
  {
    id: '1',
    code: '001',
    name: 'Armazém Principal',
    address: 'Av. Industrial, 1000',
    city: 'São Paulo',
    state: 'SP',
    manager: 'Carlos Gomes',
    totalArea: 5000,
    totalCapacity: 10000,
    currentOccupation: 6500,
  },
  {
    id: '2',
    code: '002',
    name: 'Armazém Regional Sul',
    address: 'Rua das Indústrias, 500',
    city: 'Porto Alegre',
    state: 'RS',
    manager: 'Ana Souza',
    totalArea: 3000,
    totalCapacity: 6000,
    currentOccupation: 2800,
  },
  {
    id: '3',
    code: '003',
    name: 'Armazém Regional Nordeste',
    address: 'Rodovia BR-101, km 30',
    city: 'Recife',
    state: 'PE',
    manager: 'João Ferreira',
    totalArea: 4000,
    totalCapacity: 8000,
    currentOccupation: 5200,
  },
];

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      city: '',
      state: '',
      manager: '',
      totalArea: 0,
      totalCapacity: 0,
    },
  });

  const onSubmit = (data: WarehouseFormValues) => {
    if (editingWarehouse) {
      setWarehouses(warehouses.map(warehouse => {
        if (warehouse.id === editingWarehouse.id) {
          return {
            ...warehouse,
            code: data.code,
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            manager: data.manager,
            totalArea: data.totalArea,
            totalCapacity: data.totalCapacity,
          };
        }
        return warehouse;
      }));

      toast({
        title: "Armazém atualizado",
        description: "As informações do armazém foram atualizadas com sucesso",
      });
    } else {
      const newWarehouse: Warehouse = {
        id: (warehouses.length + 1).toString(),
        code: data.code,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        manager: data.manager,
        totalArea: data.totalArea,
        totalCapacity: data.totalCapacity,
        currentOccupation: 0,
      };

      setWarehouses([...warehouses, newWarehouse]);

      toast({
        title: "Armazém adicionado",
        description: "Novo armazém foi adicionado com sucesso",
      });
    }

    setOpenDialog(false);
    form.reset();
  };

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    form.reset({
      code: '',
      name: '',
      address: '',
      city: '',
      state: '',
      manager: '',
      totalArea: 0,
      totalCapacity: 0,
    });
    setOpenDialog(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    form.reset({
      code: warehouse.code,
      name: warehouse.name,
      address: warehouse.address,
      city: warehouse.city,
      state: warehouse.state,
      manager: warehouse.manager,
      totalArea: warehouse.totalArea,
      totalCapacity: warehouse.totalCapacity,
    });
    setOpenDialog(true);
  };

  const handleDeleteWarehouse = (warehouseId: string) => {
    setWarehouses(warehouses.filter(warehouse => warehouse.id !== warehouseId));
    toast({
      title: "Armazém excluído",
      description: "O armazém foi removido com sucesso",
    });
  };

  const filteredWarehouses = warehouses.filter(warehouse => 
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code.includes(searchTerm) ||
    warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCapacityPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

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
                  <Warehouse className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
                  Cadastro de Armazéns
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os armazéns do sistema
                </p>
              </div>
              
              <Button onClick={handleAddWarehouse} className={isMobile ? "w-full mt-4 md:mt-0" : ""}>
                <Plus className="mr-2 h-5 w-5" />
                Novo Armazém
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 md:p-6 border-b">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar armazéns..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      {!isMobile && <TableHead>Localização</TableHead>}
                      {!isMobile && <TableHead>Gerente</TableHead>}
                      {!isMobile && <TableHead>Área Total (m²)</TableHead>}
                      <TableHead>Ocupação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarehouses.map((warehouse) => (
                      <TableRow key={warehouse.id}>
                        <TableCell className="font-medium">{warehouse.code}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{warehouse.name}</TableCell>
                        {!isMobile && <TableCell>{`${warehouse.city}, ${warehouse.state}`}</TableCell>}
                        {!isMobile && <TableCell>{warehouse.manager}</TableCell>}
                        {!isMobile && <TableCell>{warehouse.totalArea.toLocaleString()} m²</TableCell>}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  getCapacityPercentage(warehouse.currentOccupation, warehouse.totalCapacity) > 80
                                    ? 'bg-red-500'
                                    : getCapacityPercentage(warehouse.currentOccupation, warehouse.totalCapacity) > 50
                                      ? 'bg-amber-500'
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${getCapacityPercentage(warehouse.currentOccupation, warehouse.totalCapacity)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {getCapacityPercentage(warehouse.currentOccupation, warehouse.totalCapacity)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditWarehouse(warehouse)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteWarehouse(warehouse.id)}
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
              
              <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left">
                  Exibindo {filteredWarehouses.length} de {warehouses.length} armazéns
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
        <DialogContent className="sm:max-w-[550px] w-[calc(100%-2rem)] overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? 'Editar Armazém' : 'Adicionar Novo Armazém'}
            </DialogTitle>
            <DialogDescription>
              {editingWarehouse 
                ? 'Edite as informações do armazém abaixo.' 
                : 'Preencha os campos abaixo para adicionar um novo armazém.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código (3 dígitos)</FormLabel>
                      <FormControl>
                        <Input placeholder="001" maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Armazém</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do armazém" {...field} />
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
                      <Input placeholder="Rua, número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <FormLabel>Estado (UF)</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gerente Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do gerente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Total (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade Total (unidades)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
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
                  {editingWarehouse ? 'Salvar Alterações' : 'Cadastrar Armazém'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Warehouses;
