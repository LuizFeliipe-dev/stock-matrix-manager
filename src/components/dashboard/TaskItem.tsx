
import React from 'react';

export interface TaskItemProps {
  title: string;
  dueDate: string;
  status: 'received' | 'inspection' | 'awaiting storage' | 'in storage process' | 'allocated' | 'completed';
  to: string;
  onClick?: () => void;
}

const TaskItem = ({ title, dueDate, status, to, onClick }: TaskItemProps) => {
  const statusColors = {
    'received': 'text-blue-600 bg-blue-50 border-blue-200',
    'inspection': 'text-amber-600 bg-amber-50 border-amber-200',
    'awaiting storage': 'text-orange-600 bg-orange-50 border-orange-200',
    'in storage process': 'text-green-600 bg-green-50 border-green-200',
    'allocated': 'text-purple-600 bg-purple-50 border-purple-200',
    'completed': 'text-gray-600 bg-gray-50 border-gray-200',
  };

  const statusLabels = {
    'received': 'Recebido',
    'inspection': 'Em Inspeção',
    'awaiting storage': 'Aguardando Armazenagem',
    'in storage process': 'Em Processo de Armazenagem',
    'allocated': 'Alocado',
    'completed': 'Concluído',
  };
  
  return (
    <div 
      className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{dueDate}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
};

export default TaskItem;
