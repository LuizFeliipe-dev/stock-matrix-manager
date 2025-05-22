
import { useState, useEffect, useCallback } from 'react';
import { Item, ItemFormValues } from '../types/item';
import { useToast } from './use-toast';
import { productService } from '@/services/products';

// Mock suppliers and groups data (these would be from the API)
export const suppliers = [
  { id: '1', name: 'Dell Computadores' },
  { id: '2', name: 'LG Brasil' },
  { id: '3', name: 'MobiliaCorp' },
  { id: '4', name: 'Logitech Brasil' },
  { id: '5', name: 'Café Especial SA' }
];

export const groups = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Móveis' },
  { id: '3', name: 'Material de Escritório' },
  { id: '4', name: 'Alimentos' },
  { id: '5', name: 'Periféricos' }
];

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormValues | null>(null);
  const { toast } = useToast();

  // Fetch items when component loads
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to load items. Please try again.",
        variant: "destructive",
      });
      setItems([]);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let results = items;
    
    if (searchTerm) {
      results = results.filter(
        item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterGroup) {
      results = results.filter(item => item.group === filterGroup);
    }
    
    if (statusFilter === 'active') {
      results = results.filter(item => item.active);
    } else if (statusFilter === 'inactive') {
      results = results.filter(item => !item.active);
    }
    
    setFilteredItems(results);
  }, [items, searchTerm, filterGroup, statusFilter]);

  const handleAddItem = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item: Item) => {
    const itemForm: ItemFormValues = {
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description || '',
      group: item.group,
      supplier: item.supplier,
      stock: item.stock,
      minStock: item.minStock,
      price: item.price,
      active: item.active,
    };
    
    setEditingItem(itemForm);
    setOpenDialog(true);
  };

  const handleDeleteItem = useCallback(async (id: number) => {
    try {
      await productService.update(id, { active: false });
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, active: false } : item
        )
      );
      toast({
        title: "Success",
        description: "Item successfully deactivated",
      });
    } catch (error) {
      console.error("Error deactivating item:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate item",
        variant: "destructive",
      });
    }
  }, [toast]);

  const onSubmitItem = useCallback(
    async (data: ItemFormValues) => {
      try {
        if (data.id) {
          // Update existing item
          const updatedItem = await productService.update(data.id, {
            code: data.code,
            name: data.name,
            description: data.description,
            group: data.group,
            supplier: data.supplier,
            minStock: data.minStock,
            stock: data.stock,
            price: data.price,
            active: data.active,
          });
          setItems(prevItems =>
            prevItems.map(item => (item.id === data.id ? updatedItem : item))
          );
          toast({
            title: "Success",
            description: "Item successfully updated",
          });
        } else {
          // Create new item
          // Include all required fields for the Item type
          const newItemData: Omit<Item, 'id'> = {
            code: data.code,
            name: data.name,
            description: data.description,
            group: data.group,
            supplier: data.supplier,
            stock: data.stock || 0, // Default to 0 if not provided
            minStock: data.minStock,
            price: data.price,
            active: data.active,
            groupName: groups.find(g => g.id === data.group)?.name || '',
            supplierName: suppliers.find(s => s.id === data.supplier)?.name || ''
          };
          
          const newItem = await productService.create(newItemData);
          setItems(prevItems => [...prevItems, newItem]);
          toast({
            title: "Success",
            description: "New item successfully created",
          });
        }
        setOpenDialog(false);
      } catch (error) {
        console.error("Error saving item:", error);
        toast({
          title: "Error",
          description: "Failed to save item",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return {
    items,
    filteredItems,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    statusFilter,
    setStatusFilter,
    openDialog,
    setOpenDialog,
    editingItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    onSubmitItem,
    setItems // Export setItems so it can be used in Items.tsx
  };
};
