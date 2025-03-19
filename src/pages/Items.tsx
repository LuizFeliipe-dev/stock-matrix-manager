
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ItemForm, { ItemFormValues } from '../components/ItemForm';
import { motion } from 'framer-motion';
import { Package, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Sample data
const initialItems = [
  {
    id: 1,
    code: 'ITM001',
    name: 'Notebook Dell XPS 13',
    description: 'Notebook premium com processador Intel Core i7, 16GB RAM e 512GB SSD',
    group: 'Eletrônicos',
    supplier: 'Dell Computadores',
    initialStock: 20,
    stock: 15,
    minStock: 5,
    price: 8999.99,
    location: 'A-01-01',
  },
  {
    id: 2,
    code: 'ITM002',
    name: 'Monitor LG 27"',
    description: 'Monitor LED IPS FullHD 27 polegadas',
    group: 'Eletrônicos',
    supplier: 'LG Brasil',
    initialStock: 15,
    stock: 8,
    minStock: 3,
    price: 1299.99,
    location: 'A-01-02',
  },
  {
    id: 3,
    code: 'ITM003',
    name: 'Cadeira de Escritório Ergonômica',
    description: 'Cadeira ergonômica com ajuste de altura e encosto reclinável',
    group: 'Móveis',
    supplier: 'MobiliaCorp',
    initialStock: 30,
    stock: 24,
    minStock: 5,
    price: 799.90,
    location: 'B-02-01',
  },
  {
    id: 4,
    code: 'ITM004',
    name: 'Mesa de Escritório',
    description: 'Mesa de escritório em L com gavetas',
    group: 'Móveis',
    supplier: 'MobiliaCorp',
    initialStock: 20,
    stock: 12,
    minStock: 3,
    price: 1200.00,
    location: 'B-02-02',
  },
  {
    id: 5,
    code: 'ITM005',
    name: 'Teclado Mecânico Logitech',
    description: 'Teclado mecânico RGB com switches Blue',
    group: 'Eletrônicos',
    supplier: 'Logitech Brasil',
    initialStock: 50,
    stock: 35,
    minStock: 10,
    price: 499.90,
    location: 'A-01-03',
  },
  {
    id: 6,
    code: 'ITM006',
    name: 'Mouse sem fio',
    description: 'Mouse sem fio com 6 botões e bateria recarregável',
    group: 'Eletrônicos',
    supplier: 'Logitech Brasil',
    initialStock: 60,
    stock: 42,
    minStock: 15,
    price: 199.90,
    location: 'A-01-04',
  },
  {
    id: 7,
    code: 'ITM007',
    name: 'Café em grãos Premium 1kg',
    description: 'Café em grãos premium, torra média, 1kg',
    group: 'Alimentos',
    supplier: 'Café Especial SA',
    initialStock: 20,
    stock: 3,
    minStock: 5,
    price: 89.90,
    location: 'C-03-01',
  },
  {
    id: 8,
    code: 'ITM008',
    name: 'Headset Gaming',
    description: 'Headset gamer com surround 7.1 e microfone removível',
    group: 'Eletrônicos',
    supplier: 'HyperX Brasil',
    initialStock: 25,
    stock: 0,
    minStock: 5,
    price: 349.90,
    location: 'A-01-05',
  },
  {
    id: 9,
    code: 'ITM009',
    name: 'Água Mineral 500ml (pack)',
    description: 'Pack com 12 garrafas de água mineral sem gás 500ml',
    group: 'Alimentos',
    supplier: 'Águas Cristalinas',
    initialStock: 80,
    stock: 57,
    minStock: 20,
    price: 24.90,
    location: 'C-03-02',
  },
  {
    id: 10,
    code: 'ITM010',
    name: 'Mochila para Notebook',
    description: 'Mochila para notebook até 15", impermeável com compartimentos',
    group: 'Acessórios',
    supplier: 'TravelGear',
    initialStock: 30,
    stock: 18,
    minStock: 5,
    price: 179.90,
    location: 'D-04-01',
  },
];

// Sample suppliers and groups
const suppliers = [
  { id: '1', name: 'Dell Computadores' },
  { id: '2', name: 'LG Brasil' },
  { id: '3', name: 'MobiliaCorp' },
  { id: '4', name: 'Logitech Brasil' },
  { id: '5', name: 'Café Especial SA' },
  { id: '6', name: 'HyperX Brasil' },
  { id: '7', name: 'Águas Cristalinas' },
  { id: '8', name: 'TravelGear' },
];

const groups = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Móveis' },
  { id: '3', name: 'Alimentos' },
  { id: '4', name: 'Acessórios' },
];

const Items = () => {
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddItem = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem({
      code: item.code,
      name: item.name,
      description: item.description || '',
      group: item.group,
      supplier: item.supplier,
      initialStock: item.initialStock,
      minStock: item.minStock,
      price: item.price,
      location: item.location || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteItem = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId));
    toast({
      title: "Item excluído",
      description: "O item foi removido com sucesso",
    });
  };

  const onSubmitItem = (data: ItemFormValues) => {
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.code === editingItem.code 
          ? { 
              ...item, 
              ...data, 
              // Maintain the same stock level but update other fields
              stock: item.stock
            } 
          : item
      ));
      toast({
        title: "Item atualizado",
        description: "As informações do item foram atualizadas com sucesso",
      });
    } else {
      // Add new item
      const newItem = {
        id: items.length + 1,
        ...data,
        // Set initial stock for a new item
        stock: data.initialStock,
      };
      setItems([...items, newItem]);
      toast({
        title: "Item adicionado",
        description: "Novo item foi adicionado com sucesso",
      });
    }
    setOpenDialog(false);
  };

  // Filter items based on search term and selected group
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesGroup = filterGroup ? item.group === filterGroup : true;
    
    return matchesSearch && matchesGroup;
  });

  return (
    <AuthRequired>
      <div className="min-h-screen flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold flex items-center">
                  <Package className="mr-3 h-8 w-8 text-primary" />
                  Cadastro de Itens
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os itens disponíveis no sistema
                </p>
              </div>
              
              <Button onClick={handleAddItem}>
                <Plus className="mr-2 h-5 w-5" />
                Novo Item
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Buscar itens..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="ml-4">
                    <Select
                      value={filterGroup}
                      onValueChange={setFilterGroup}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Todos os grupos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os grupos</SelectItem>
                        {groups.map(group => (
                          <SelectItem key={group.id} value={group.name}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-left">
                      <th className="py-3 px-6 font-medium">Código</th>
                      <th className="py-3 px-6 font-medium">Nome</th>
                      <th className="py-3 px-6 font-medium">Grupo</th>
                      <th className="py-3 px-6 font-medium">Fornecedor</th>
                      <th className="py-3 px-6 font-medium">Estoque</th>
                      <th className="py-3 px-6 font-medium">Preço</th>
                      <th className="py-3 px-6 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6">{item.code}</td>
                        <td className="py-3 px-6 font-medium">{item.name}</td>
                        <td className="py-3 px-6">{item.group}</td>
                        <td className="py-3 px-6">{item.supplier}</td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.stock > item.minStock 
                              ? 'bg-green-50 text-green-600 border border-green-200' 
                              : item.stock > 0 
                                ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                                : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {item.stock} unidades
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          R$ {item.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex space-x-2">
                            <button 
                              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={() => handleEditItem(item)}
                            >
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </button>
                            <button 
                              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Exibindo {filteredItems.length} de {items.length} itens
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">Próxima</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Edite as informações do item abaixo.' 
                : 'Preencha os campos abaixo para adicionar um novo item.'}
            </DialogDescription>
          </DialogHeader>
          
          <ItemForm
            initialData={editingItem}
            onSubmit={onSubmitItem}
            suppliers={suppliers}
            groups={groups}
          />
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Items;
