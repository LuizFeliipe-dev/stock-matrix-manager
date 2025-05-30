
import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskModal from './TaskModal';
import { useEntries, Entry } from '@/hooks/useEntries';
import { useNavigate } from 'react-router-dom';

const TasksSection = () => {
  const { entries, updateEntryStatus } = useEntries();
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter entries that don't have "allocated" or "completed" status
  const pendingEntries = entries.filter(entry => 
    entry.status !== 'allocated' && entry.status !== 'completed'
  );

  const handleViewAllTasks = () => {
    navigate('/tasks');
  };

  const handleTaskClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleStatusUpdate = (id: string, status: Entry['status']) => {
    updateEntryStatus(id, status);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Tarefas Pendentes</h2>
      <div className="space-y-3">
        {pendingEntries.length > 0 ? (
          pendingEntries.map(entry => (
            <TaskItem 
              key={entry.id}
              title={`Entrada de mercadorias - Pedido #${entry.orderNumber}`}
              dueDate={entry.date}
              status={entry.status}
              to={`/entry?order=${entry.orderNumber}`}
              onClick={() => handleTaskClick(entry)}
            />
          ))
        ) : (
          <div className="text-gray-500 py-3 text-center">
            Não há tarefas pendentes
          </div>
        )}
      </div>
      <button 
        className="mt-4 text-sm text-primary hover:text-primary/80 font-medium"
        onClick={handleViewAllTasks}
      >
        Ver todas as tarefas
      </button>
      
      <TaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        entry={selectedEntry}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default TasksSection;
