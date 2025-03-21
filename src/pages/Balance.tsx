
import { motion } from 'framer-motion';
import { BarChart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBalance } from '@/hooks/useBalance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer as RechartsContainer, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const BalancePage = () => {
  const { 
    balanceSummaries, 
    warehouses, 
    years, 
    selectedWarehouse, 
    setSelectedWarehouse, 
    selectedYear, 
    setSelectedYear,
    totals
  } = useBalance();
  
  const isMobile = useIsMobile();

  // Prepare data for the chart
  const chartData = balanceSummaries.map(summary => ({
    name: summary.month,
    entrada: summary.inputValue,
    saída: summary.outputValue,
    saldo: summary.currentValue
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <h1 className="text-2xl font-bold mb-6">Resumo de Saldo</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.currentValue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Entrada
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(totals.inputValue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Saída
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{formatCurrency(totals.outputValue)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
                    <CardTitle className="text-lg">Movimentação Mensal</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={selectedWarehouse} 
                        onValueChange={setSelectedWarehouse}
                      >
                        <SelectTrigger className={isMobile ? "w-full" : "w-[180px]"}>
                          <SelectValue placeholder="Selecione o armazém" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os armazéns</SelectItem>
                          {warehouses.map(warehouse => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select 
                        value={selectedYear.toString()} 
                        onValueChange={value => setSelectedYear(Number(value))}
                      >
                        <SelectTrigger className={isMobile ? "w-full" : "w-[120px]"}>
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <RechartsContainer width="100%" height="100%">
                      <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip formatter={value => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="entrada" name="Entrada" fill="#4ade80" />
                        <Bar dataKey="saída" name="Saída" fill="#f87171" />
                      </RechartsBarChart>
                    </RechartsContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Detalhes por Armazém</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="responsive-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Armazém</TableHead>
                          <TableHead>Mês</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {balanceSummaries.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                              Nenhum dado encontrado.
                            </TableCell>
                          </TableRow>
                        ) : (
                          balanceSummaries.map((summary, index) => (
                            <TableRow key={index}>
                              <TableCell className="max-w-[120px] truncate">{summary.warehouseName}</TableCell>
                              <TableCell>{summary.month}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(summary.currentValue)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </ResponsiveContainer>
    </div>
  );
};

export default BalancePage;
