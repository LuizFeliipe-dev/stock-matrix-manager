
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ItemFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGroup: string;
  setFilterGroup: (value: string) => void;
  groups: { id: string; name: string }[];
}

const ItemFilters = ({
  searchTerm,
  setSearchTerm,
  filterGroup,
  setFilterGroup,
  groups,
}: ItemFiltersProps) => {
  return (
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
  );
};

export default ItemFilters;
