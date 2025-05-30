
import { useState, useEffect } from 'react';
import { supplierService, Supplier } from '@/services/suppliers';
import { useToast } from './use-toast';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar fornecedores. Tente novamente.",
        variant: "destructive",
      });
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suppliers,
    isLoading,
    loadSuppliers
  };
};
