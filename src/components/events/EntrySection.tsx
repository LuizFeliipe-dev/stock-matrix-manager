
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightToLine, Plus, Truck, Package, Search, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import EntryStepCard from './EntryStepCard';

const EntrySection = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const { toast } = useToast();

  const handleStartEntry = () => {
    if (!orderNumber) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de ordem válido",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Processo iniciado",
      description: `Entrada da ordem #${orderNumber} iniciada com sucesso`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <ArrowRightToLine className="mr-2 h-5 w-5" />
            Entrada de Mercadorias
          </CardTitle>
          <CardDescription>
            Registre a entrada de novos itens no estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Número da ordem de compra"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleStartEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Iniciar Entrada
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EntryStepCard 
              title="Receber Fornecedor"
              description="Confirme os dados do fornecedor e itens esperados"
              icon={<Truck className="h-5 w-5" />}
              isActive={true}
              isCompleted={false}
            />
            
            <EntryStepCard 
              title="Conferir Itens"
              description="Verifique e contabilize os itens recebidos"
              icon={<Package className="h-5 w-5" />}
              isActive={false}
              isCompleted={false}
            />
            
            <EntryStepCard 
              title="Finalizar Entrada"
              description="Confirme e registre a entrada no sistema"
              icon={<CheckCircle2 className="h-5 w-5" />}
              isActive={false}
              isCompleted={false}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <Button variant="ghost" className="gap-1">
              <Search className="h-4 w-4" />
              Pesquisar Entradas
            </Button>
            <Button variant="outline" disabled>
              Entrada em Andamento
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Entradas Recentes</CardTitle>
          <CardDescription>Últimas 5 entradas registradas no sistema</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-3">Ordem</th>
                <th className="text-left p-3">Data</th>
                <th className="text-left p-3">Fornecedor</th>
                <th className="text-left p-3">Itens</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">#{10000 + index}</td>
                  <td className="p-3">{new Date().toLocaleDateString()}</td>
                  <td className="p-3">Fornecedor {index + 1}</td>
                  <td className="p-3">{5 + index} itens</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600 border border-green-200">
                      Concluído
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline">Ver Todas as Entradas</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EntrySection;
