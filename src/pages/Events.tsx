
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EntrySection from '@/components/events/EntrySection';
import InventorySection from '@/components/events/InventorySection';
import DepartureSection from '@/components/events/DepartureSection';

const Events = () => {
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
              <h1 className="text-3xl font-semibold">Eventos</h1>
              <p className="text-gray-500 mt-1">
                Gerencie entradas, inventários e saídas de itens do armazém
              </p>
            </header>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Visão Geral de Processos</CardTitle>
                <CardDescription>
                  Selecione um processo para gerenciar eventos de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="entry" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="entry">Entrada</TabsTrigger>
                    <TabsTrigger value="inventory">Inventário</TabsTrigger>
                    <TabsTrigger value="departure">Saída</TabsTrigger>
                  </TabsList>
                  <TabsContent value="entry" className="mt-0">
                    <EntrySection />
                  </TabsContent>
                  <TabsContent value="inventory" className="mt-0">
                    <InventorySection />
                  </TabsContent>
                  <TabsContent value="departure" className="mt-0">
                    <DepartureSection />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </AuthRequired>
  );
};

export default Events;
