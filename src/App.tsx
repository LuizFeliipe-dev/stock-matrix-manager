
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

// Creating empty placeholder pages for navigation to work
const WarehousesPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Armazéns</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const SuppliersPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Fornecedores</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const GroupsPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Grupos</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const EntryPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Entrada</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const InventoryPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Inventário</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const DeparturePage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Saída</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const TasksPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Lista de Tarefas</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const StatisticsPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Estatísticas</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const LocationViewPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Visualização 3D</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const BalancePage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Resumo de Saldo</h1><p className="mt-4">Página em desenvolvimento</p></div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/items" element={<Items />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/warehouses" element={<WarehousesPage />} />
              <Route path="/users" element={<Users />} />
              <Route path="/entry" element={<EntryPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/departure" element={<DeparturePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/location-view" element={<LocationViewPage />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
