
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
import Suppliers from "./pages/Suppliers";
import Warehouses from "./pages/Warehouses";
import Groups from "./pages/Groups";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";

// Creating empty placeholder pages for navigation to work
const LocationsPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Locações</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const RacksPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Racks/Prateleiras</h1><p className="mt-4">Página em desenvolvimento</p></div>;
const CorridorsPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Corredores</h1><p className="mt-4">Página em desenvolvimento</p></div>;
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
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/racks" element={<RacksPage />} />
              <Route path="/corridors" element={<CorridorsPage />} />
              <Route path="/users" element={<Users />} />
              <Route path="/events" element={<Events />} />
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
