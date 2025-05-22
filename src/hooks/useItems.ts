
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
    
    setFilteredItems(results);
  }, [items, searchTerm, filterGroup]);

  const handleAddItem = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item: Item) => {
    const itemForm: ItemFormValues = {
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description,
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
        if (editingItem?.id) {
          // Update existing item
          const updatedItem = await productService.update(editingItem.id, data);
          setItems(prevItems =>
            prevItems.map(item => (item.id === editingItem.id ? updatedItem : item))
          );
          toast({
            title: "Success",
            description: "Item successfully updated",
          });
        } else {
          // Create new item
          const newItem = await productService.create(data);
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
    [editingItem, toast]
  );

  return {
    items,
    filteredItems,
    isLoading,
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
