
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useCorridors } from '@/hooks/useCorridors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const CorridorsPage = () => {
  const { 
    filteredCorridors, 
    searchTerm, 
    setSearchTerm,
    deleteCorridor 
  } = useCorridors();
  
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteCorridor(id);
    toast({
      title: 'Corredor excluído',
      description: 'O corredor foi removido com sucesso',
    });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Corredores</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Corredor
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Lista de Corredores</CardTitle>
              <div className="flex items-center mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por código ou nome..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>ID do Armazém</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCorridors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhum corredor encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCorridors.map((corridor) => (
                      <TableRow key={corridor.id}>
                        <TableCell className="font-medium">{corridor.code}</TableCell>
                        <TableCell>{corridor.name}</TableCell>
                        <TableCell>{corridor.description}</TableCell>
                        <TableCell>{corridor.warehouseId}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(corridor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default CorridorsPage;
