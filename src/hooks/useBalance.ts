
import { useState } from 'react';
import { BalanceSummary } from '@/types/warehouse';

// Initial mock data
const initialBalanceSummary: BalanceSummary[] = [
  {
    warehouseId: '1',
    warehouseName: 'Armazém Principal',
    currentValue: 125000.00,
    inputValue: 35000.00,
    outputValue: 18500.00,
    month: 'Janeiro',
    year: 2023,
  },
  {
    warehouseId: '1',
    warehouseName: 'Armazém Principal',
    currentValue: 141500.00,
    inputValue: 28000.00,
    outputValue: 12000.00,
    month: 'Fevereiro',
    year: 2023,
  },
  {
    warehouseId: '2',
    warehouseName: 'Armazém Secundário',
    currentValue: 87500.00,
    inputValue: 22000.00,
    outputValue: 9800.00,
    month: 'Janeiro',
    year: 2023,
  },
  {
    warehouseId: '2',
    warehouseName: 'Armazém Secundário',
    currentValue: 99700.00,
    inputValue: 18500.00,
    outputValue: 7300.00,
    month: 'Fevereiro',
    year: 2023,
  },
];

export const useBalance = () => {
  const [balanceSummaries, setBalanceSummaries] = useState<BalanceSummary[]>(initialBalanceSummary);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  const filteredBalanceSummaries = balanceSummaries.filter(summary => {
    const matchesWarehouse = selectedWarehouse === 'all' ? true : summary.warehouseId === selectedWarehouse;
    const matchesYear = summary.year === selectedYear;
    return matchesWarehouse && matchesYear;
  });

  // Get unique warehouse IDs and names for filtering
  const warehouses = Array.from(
    new Set(balanceSummaries.map(summary => summary.warehouseId))
  ).map(id => {
    const summary = balanceSummaries.find(s => s.warehouseId === id);
    return {
      id,
      name: summary ? summary.warehouseName : 'Unknown',
    };
  });

  // Get unique years for filtering
  const years = Array.from(
    new Set(balanceSummaries.map(summary => summary.year))
  ).sort((a, b) => b - a);

  // Calculate totals
  const totals = filteredBalanceSummaries.reduce(
    (acc, summary) => {
      return {
        currentValue: acc.currentValue + summary.currentValue,
        inputValue: acc.inputValue + summary.inputValue,
        outputValue: acc.outputValue + summary.outputValue,
      };
    },
    { currentValue: 0, inputValue: 0, outputValue: 0 }
  );

  return {
    balanceSummaries: filteredBalanceSummaries,
    warehouses,
    years,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedYear,
    setSelectedYear,
    totals,
  };
};
