
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item } from '@/types/item';

interface ItemsTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
  filteredCount: number;
  totalCount: number;
}

const ItemsTable = ({ 
  items, 
  onEdit, 
  onDelete, 
  filteredCount, 
  totalCount 
}: ItemsTableProps) => {
  return (
    <>
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
            {items.map((item) => (
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
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </button>
                    <button 
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      onClick={() => onDelete(item.id)}
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
          Exibindo {filteredCount} de {totalCount} itens
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Anterior</Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">Próxima</Button>
        </div>
      </div>
    </>
  );
};

export default ItemsTable;
