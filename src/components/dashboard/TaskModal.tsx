
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Entry } from '@/hooks/useEntries';
import { useState } from 'react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry | null;
  onStatusUpdate: (id: string, status: Entry['status']) => void;
}

const TaskModal = ({ isOpen, onClose, entry, onStatusUpdate }: TaskModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Entry['status'] | ''>('');

  if (!entry) return null;

  const statusOptions = [
    { value: 'received', label: 'Recebido' },
    { value: 'inspection', label: 'Em Inspeção' },
    { value: 'awaiting storage', label: 'Aguardando Armazenagem' },
    { value: 'in storage process', label: 'Em Processo de Armazenagem' },
    { value: 'allocated', label: 'Alocado' },
    { value: 'completed', label: 'Concluído' },
  ] as const;

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      onStatusUpdate(entry.id, selectedStatus);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Tarefa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Número do Pedido</Label>
              <p className="text-sm">{entry.orderNumber}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Data</Label>
              <p className="text-sm">{entry.date}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-500">Fornecedor</Label>
            <p className="text-sm">{entry.supplier}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Quantidade de Itens</Label>
              <p className="text-sm">{entry.items} itens</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Prioridade</Label>
              <p className="text-sm">{entry.priority}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-500">Status Atual</Label>
            <p className="text-sm">{statusOptions.find(opt => opt.value === entry.status)?.label}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Alterar Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Entry['status'])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um novo status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleStatusUpdate} disabled={!selectedStatus}>
            Atualizar Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
