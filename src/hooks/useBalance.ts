
import { useState } from 'react';

interface BalanceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  totalValue: number;
}

interface Transaction {
  id: number;
  date: string;
  type: 'entry' | 'departure' | 'adjustment';
  itemName: string;
  quantity: number;
  value: number;
}

export const useBalance = () => {
  // Mock data for balance items
  const [balanceItems] = useState<BalanceItem[]>([
    { id: 1, name: 'Notebook Dell XPS', quantity: 15, price: 8500, totalValue: 127500 },
    { id: 2, name: 'Monitor UltraWide 34"', quantity: 25, price: 3200, totalValue: 80000 },
    { id: 3, name: 'iPhone 15 Pro Max', quantity: 10, price: 7800, totalValue: 78000 },
    { id: 4, name: 'Cadeira Ergonômica', quantity: 30, price: 2100, totalValue: 63000 },
    { id: 5, name: 'MacBook Pro M2', quantity: 5, price: 12000, totalValue: 60000 },
    { id: 6, name: 'Mesa de Escritório', quantity: 20, price: 2500, totalValue: 50000 },
    { id: 7, name: 'Teclado Mecânico', quantity: 40, price: 950, totalValue: 38000 },
    { id: 8, name: 'Mouse Gamer', quantity: 50, price: 450, totalValue: 22500 },
    { id: 9, name: 'Headset Wireless', quantity: 35, price: 600, totalValue: 21000 },
    { id: 10, name: 'Dock Station', quantity: 25, price: 800, totalValue: 20000 },
  ]);

  // Mock data for recent transactions
  const [recentTransactions] = useState<Transaction[]>([
    { id: 1, date: '2023-08-20', type: 'entry', itemName: 'Notebook Dell XPS', quantity: 5, value: 42500 },
    { id: 2, date: '2023-08-19', type: 'departure', itemName: 'Monitor UltraWide 34"', quantity: 2, value: 6400 },
    { id: 3, date: '2023-08-18', type: 'adjustment', itemName: 'iPhone 15 Pro Max', quantity: 1, value: 7800 },
    { id: 4, date: '2023-08-17', type: 'entry', itemName: 'Cadeira Ergonômica', quantity: 10, value: 21000 },
    { id: 5, date: '2023-08-16', type: 'departure', itemName: 'MacBook Pro M2', quantity: 1, value: 12000 },
    { id: 6, date: '2023-08-15', type: 'entry', itemName: 'Teclado Mecânico', quantity: 15, value: 14250 },
    { id: 7, date: '2023-08-14', type: 'adjustment', itemName: 'Mouse Gamer', quantity: -5, value: -2250 },
    { id: 8, date: '2023-08-13', type: 'departure', itemName: 'Headset Wireless', quantity: 3, value: 1800 },
  ]);

  // Calculate totals
  const totalBalance = balanceItems.reduce((acc, item) => acc + item.totalValue, 0);
  const entriesTotal = recentTransactions
    .filter(t => t.type === 'entry')
    .reduce((acc, t) => acc + t.value, 0);
  const departuresTotal = recentTransactions
    .filter(t => t.type === 'departure')
    .reduce((acc, t) => acc + t.value, 0);
  const adjustmentsCount = recentTransactions.filter(t => t.type === 'adjustment').length;
  const adjustmentsValue = recentTransactions
    .filter(t => t.type === 'adjustment')
    .reduce((acc, t) => acc + t.value, 0);

  // Sort items by total value to get top items
  const topValueItems = [...balanceItems].sort((a, b) => b.totalValue - a.totalValue);

  return {
    balanceItems,
    totalBalance,
    entriesTotal,
    departuresTotal,
    adjustmentsCount,
    adjustmentsValue,
    recentTransactions,
    topValueItems
  };
};
