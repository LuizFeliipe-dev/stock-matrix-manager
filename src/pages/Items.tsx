
import { motion } from 'framer-motion';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ItemsHeader from '../components/items/ItemsHeader';
import ItemFilters from '../components/items/ItemFilters';
import ItemsTable from '../components/items/ItemsTable';
import ItemFormDialog from '../components/items/ItemFormDialog';
import { useItems, suppliers, groups } from '../hooks/useItems';
import ItemsPageContent from '../components/items/ItemsPageContent';

const Items = () => {
  const {
    filteredItems,
    items,
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
  } = useItems();

  return (
    <AuthRequired>
      <div className="min-h-screen flex">
        <Sidebar />
        <ItemsPageContent
          filteredItems={filteredItems}
          items={items}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterGroup={filterGroup}
          setFilterGroup={setFilterGroup}
          handleAddItem={handleAddItem}
          handleEditItem={handleEditItem}
          handleDeleteItem={handleDeleteItem}
        />
      </div>

      <ItemFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editingItem={editingItem}
        onSubmit={onSubmitItem}
        suppliers={suppliers}
        groups={groups}
      />
    </AuthRequired>
  );
};

export default Items;
