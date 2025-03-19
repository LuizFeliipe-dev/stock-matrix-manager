
import { motion } from 'framer-motion';
import { Item } from '@/types/item';
import ItemsHeader from './ItemsHeader';
import ItemFilters from './ItemFilters';
import ItemsTable from './ItemsTable';
import { groups } from '@/hooks/useItems';

interface ItemsPageContentProps {
  filteredItems: Item[];
  items: Item[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGroup: string;
  setFilterGroup: (value: string) => void;
  handleAddItem: () => void;
  handleEditItem: (item: Item) => void;
  handleDeleteItem: (itemId: number) => void;
}

const ItemsPageContent = ({
  filteredItems,
  items,
  searchTerm,
  setSearchTerm,
  filterGroup,
  setFilterGroup,
  handleAddItem,
  handleEditItem,
  handleDeleteItem
}: ItemsPageContentProps) => {
  return (
    <main className="flex-1 ml-64 p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-transition"
      >
        <ItemsHeader onAddItem={handleAddItem} />
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
          <ItemFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterGroup={filterGroup}
            setFilterGroup={setFilterGroup}
            groups={groups}
          />
          
          <ItemsTable 
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            filteredCount={filteredItems.length}
            totalCount={items.length}
          />
        </div>
      </motion.div>
    </main>
  );
};

export default ItemsPageContent;
