
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Item, ItemFormValues } from '@/types/item';

// Initial data
const initialItems: Item[] = [
  {
    id: 1,
    code: 'ITM001',
    name: 'Notebook Dell XPS 13',
    description: 'Notebook premium com processador Intel Core i7, 16GB RAM e 512GB SSD',
    groupId: '1',
    group: 'Eletrônicos',
    supplierId: '1',
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
    groupId: '1',
    group: 'Eletrônicos',
    supplierId: '2',
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
    groupId: '2',
    group: 'Móveis',
    supplierId: '3',
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
    groupId: '2',
    group: 'Móveis',
    supplierId: '3',
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
    groupId: '1',
    group: 'Eletrônicos',
    supplierId: '4',
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
    groupId: '1',
    group: 'Eletrônicos',
    supplierId: '4',
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
    groupId: '3',
    group: 'Alimentos',
    supplierId: '5',
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
    groupId: '1',
    group: 'Eletrônicos',
    supplierId: '6',
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
    groupId: '3',
    group: 'Alimentos',
    supplierId: '7',
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
    groupId: '4',
    group: 'Acessórios',
    supplierId: '8',
    supplier: 'TravelGear',
    initialStock: 30,
    stock: 18,
    minStock: 5,
    price: 179.90,
    location: 'D-04-01',
  },
];

// Mock data for suppliers and groups
export const suppliers = [
  { id: '1', name: 'Dell Computadores' },
  { id: '2', name: 'LG Brasil' },
  { id: '3', name: 'MobiliaCorp' },
  { id: '4', name: 'Logitech Brasil' },
  { id: '5', name: 'Café Especial SA' },
  { id: '6', name: 'HyperX Brasil' },
  { id: '7', name: 'Águas Cristalinas' },
  { id: '8', name: 'TravelGear' },
];

export const groups = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Móveis' },
  { id: '3', name: 'Alimentos' },
  { id: '4', name: 'Acessórios' },
];

// Helper to find supplier and group names from IDs
const findSupplierName = (id: string) => {
  const supplier = suppliers.find(s => s.id === id);
  return supplier ? supplier.name : '';
};

const findGroupName = (id: string) => {
  const group = groups.find(g => g.id === id);
  return group ? group.name : '';
};

export const useItems = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormValues | null>(null);
  const { toast } = useToast();

  const handleAddItem = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem({
      code: item.code,
      name: item.name,
      description: item.description || '',
      group: item.groupId,
      supplier: item.supplierId,
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
      setItems(prevItems => 
        prevItems.map(item => {
          if (item.code === editingItem.code) {
            return {
              ...item,
              name: data.name,
              description: data.description || '',
              groupId: data.group,
              group: findGroupName(data.group),
              supplierId: data.supplier,
              supplier: findSupplierName(data.supplier),
              initialStock: data.initialStock,
              minStock: data.minStock,
              price: data.price,
              location: data.location || '',
            };
          }
          return item;
        })
      );
      
      toast({
        title: "Item atualizado",
        description: "As informações do item foram atualizadas com sucesso",
      });
    } else {
      // Add new item with all required fields
      const newItem: Item = {
        id: items.length + 1,
        code: data.code,
        name: data.name,
        description: data.description || '',
        groupId: data.group,
        group: findGroupName(data.group),
        supplierId: data.supplier,
        supplier: findSupplierName(data.supplier),
        initialStock: data.initialStock,
        minStock: data.minStock,
        price: data.price,
        location: data.location || '',
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

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesGroup = filterGroup === 'all' ? true : item.groupId === filterGroup;
    
    return matchesSearch && matchesGroup;
  });

  return {
    items,
    filteredItems,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    openDialog,
    setOpenDialog,
    editingItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    onSubmitItem
  };
};
