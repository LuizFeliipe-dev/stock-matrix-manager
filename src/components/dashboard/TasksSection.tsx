
import React from 'react';
import TaskItem from './TaskItem';

const TasksSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Tarefas Pendentes</h2>
      <div className="space-y-3">
        <TaskItem 
          title="Entrada de mercadorias - Fornecedor XYZ"
          dueDate="Hoje, 14:30"
          priority="Alta"
          to="/entry"
        />
        <TaskItem 
          title="Inventário semanal - Armazém 001"
          dueDate="Amanhã, 09:00"
          priority="Média"
          to="/inventory"
        />
        <TaskItem 
          title="Preparar saída #82731"
          dueDate="29/08, 11:00"
          priority="Baixa"
          to="/departure"
        />
      </div>
      <button className="mt-4 text-sm text-primary hover:text-primary/80 font-medium">
        Ver todas as tarefas
      </button>
    </div>
  );
};

export default TasksSection;
