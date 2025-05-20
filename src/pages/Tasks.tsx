
import React, { useState } from 'react';
import { useEntries, Entry } from '@/hooks/useEntries';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import TaskItem from '@/components/dashboard/TaskItem';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Tasks = () => {
  const { entries, updateEntryStatus } = useEntries();
  const { toast } = useToast();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Entry['status'] | ''>('');
  
  // Filter entries that don't have "allocated" status
  const pendingEntries = entries.filter(entry => entry.status !== 'allocated');

  const handleOpenTaskModal = (entry: Entry) => {
    setSelectedEntry(entry);
    setSelectedStatus(entry.status);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
    setSelectedStatus('');
  };

  const handleSaveStatus = () => {
    if (selectedEntry && selectedStatus) {
      updateEntryStatus(selectedEntry.id, selectedStatus);
      toast({
        title: "Status atualizado",
        description: `O status da entrada #${selectedEntry.orderNumber} foi atualizado com sucesso.`
      });
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">Tarefas Pendentes</h1>
            <p className="text-gray-500 mt-1">
              Gerencie suas tarefas pendentes no sistema
            </p>
          </header>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="space-y-3">
              {pendingEntries.length > 0 ? (
                pendingEntries.map(entry => (
                  <TaskItem 
                    key={entry.id}
                    title={`Entrada de mercadorias - Pedido #${entry.orderNumber}`}
                    dueDate={entry.date}
                    status={entry.status}
                    to={`/entry?order=${entry.orderNumber}`}
                    onClick={() => handleOpenTaskModal(entry)}
                  />
                ))
              ) : (
                <div className="text-gray-500 py-6 text-center">
                  Não há tarefas pendentes no momento
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </ResponsiveContainer>

      {/* Task Detail Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={() => handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Tarefa</DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label>Pedido</Label>
                <div className="font-medium">#{selectedEntry.orderNumber}</div>
              </div>
              
              <div className="space-y-1">
                <Label>Fornecedor</Label>
                <div className="font-medium">{selectedEntry.supplier}</div>
              </div>
              
              <div className="space-y-1">
                <Label>Data</Label>
                <div className="font-medium">{selectedEntry.date}</div>
              </div>
              
              <div className="space-y-1">
                <Label>Itens</Label>
                <div className="font-medium">{selectedEntry.items}</div>
              </div>
              
              <div className="space-y-1">
                <Label>Prioridade</Label>
                <div className="font-medium">{selectedEntry.priority}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedStatus} 
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="received">Recebido</SelectItem>
                    <SelectItem value="inspection">Inspeção</SelectItem>
                    <SelectItem value="awaiting storage">Aguardando Armazenamento</SelectItem>
                    <SelectItem value="in storage process">Em Processo de Armazenamento</SelectItem>
                    <SelectItem value="allocated">Alocado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSaveStatus}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
