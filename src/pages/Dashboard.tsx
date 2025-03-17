import { useEffect, useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import Stats3DView from '../components/Stats3DView';
import { useAuth } from '../lib/auth';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  Users,
  Clipboard,
  BarChart3,
  Package3D,
  DollarSign,
  ArrowRightToLine,
  Box,
  Warehouse,
  Activity,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    
    if (hours < 12) {
      setGreeting('Bom dia');
    } else if (hours < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  return (
    <AuthRequired>
      <div className="min-h-screen flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="mb-8">
              <h1 className="text-3xl font-semibold">
                {greeting}, {user?.name}
              </h1>
              <p className="text-gray-500 mt-1">
                Bem-vindo ao seu dashboard. Aqui está o resumo do seu armazém.
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Total de Itens"
                value="1,243"
                icon={<Package className="h-6 w-6" />}
                to="/items"
                color="blue"
              />
              
              <DashboardCard
                title="Fornecedores"
                value="38"
                icon={<Truck className="h-6 w-6" />}
                to="/suppliers"
                color="green"
              />
              
              <DashboardCard
                title="Armazéns"
                value="5"
                icon={<Warehouse className="h-6 w-6" />}
                to="/warehouses"
                color="amber"
              />
              
              <DashboardCard
                title="Usuários"
                value="17"
                icon={<Users className="h-6 w-6" />}
                to="/users"
                color="purple"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
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
              
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
                <div className="space-y-3">
                  <ActivityItem 
                    title="Marcelo Silva aprovou inventário do Armazém 002"
                    time="Há 35 minutos"
                    icon={<Clipboard className="h-5 w-5" />}
                  />
                  <ActivityItem 
                    title="Nova entrada registrada: 150 itens do Fornecedor ABC"
                    time="Há 2 horas"
                    icon={<ArrowRightToLine className="h-5 w-5" />}
                  />
                  <ActivityItem 
                    title="Saída #82730 concluída e expedida"
                    time="Há 3 horas"
                    icon={<Box className="h-5 w-5" />}
                  />
                </div>
                <button className="mt-4 text-sm text-primary hover:text-primary/80 font-medium">
                  Ver toda atividade
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCard
                title="Eventos"
                icon={<Activity className="h-6 w-6" />}
                description="Gerenciar entradas, inventário e saídas"
                to="/tasks"
                className="h-full"
              />
              
              <DashboardCard
                title="Estatísticas"
                icon={<BarChart3 className="h-6 w-6" />}
                description="Visualizar gráficos e métricas"
                to="/statistics"
                className="h-full"
              />
              
              <DashboardCard
                title="Resumo de Saldo"
                icon={<DollarSign className="h-6 w-6" />}
                description="Acompanhar saldo de itens e valores"
                to="/balance"
                className="h-full"
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
              <div className="h-80">
                <Stats3DView />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </AuthRequired>
  );
};

interface TaskItemProps {
  title: string;
  dueDate: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  to: string;
}

const TaskItem = ({ title, dueDate, priority, to }: TaskItemProps) => {
  const priorityColors = {
    Alta: 'text-red-600 bg-red-50 border-red-200',
    Média: 'text-amber-600 bg-amber-50 border-amber-200',
    Baixa: 'text-blue-600 bg-blue-50 border-blue-200',
  };
  
  return (
    <div className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{dueDate}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[priority]}`}>
        {priority}
      </span>
    </div>
  );
};

interface ActivityItemProps {
  title: string;
  time: string;
  icon: React.ReactNode;
}

const ActivityItem = ({ title, time, icon }: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
      <div className="bg-primary/10 text-primary p-2 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default Dashboard;
