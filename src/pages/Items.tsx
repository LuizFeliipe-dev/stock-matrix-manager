
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
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
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        <ResponsiveContainer>
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
        </ResponsiveContainer>
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
