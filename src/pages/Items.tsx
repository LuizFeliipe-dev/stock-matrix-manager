
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Package, Plus, Pencil, Trash2, Search } from 'lucide-react';

const Items = () => {
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
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold flex items-center">
                  <Package className="mr-3 h-8 w-8 text-primary" />
                  Cadastro de Itens
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os itens disponíveis no sistema
                </p>
              </div>
              
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg flex items-center transition-colors">
                <Plus className="mr-2 h-5 w-5" />
                Novo Item
              </button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Buscar itens..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="ml-4">
                    <select className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                      <option value="">Todos os grupos</option>
                      <option value="eletronicos">Eletrônicos</option>
                      <option value="moveis">Móveis</option>
                      <option value="alimentos">Alimentos</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-left">
                      <th className="py-3 px-6 font-medium">Código</th>
                      <th className="py-3 px-6 font-medium">Nome</th>
                      <th className="py-3 px-6 font-medium">Grupo</th>
                      <th className="py-3 px-6 font-medium">Fornecedor</th>
                      <th className="py-3 px-6 font-medium">Estoque</th>
                      <th className="py-3 px-6 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6">{item.code}</td>
                        <td className="py-3 px-6 font-medium">{item.name}</td>
                        <td className="py-3 px-6">{item.group}</td>
                        <td className="py-3 px-6">{item.supplier}</td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.stock > 10 
                              ? 'bg-green-50 text-green-600 border border-green-200' 
                              : item.stock > 0 
                                ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                                : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {item.stock} unidades
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex space-x-2">
                            <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Exibindo 1-10 de 25 itens
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors">
                    Anterior
                  </button>
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
                    1
                  </button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors">
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </AuthRequired>
  );
};

// Sample data
const items = [
  {
    id: 1,
    code: 'ITM001',
    name: 'Notebook Dell XPS 13',
    group: 'Eletrônicos',
    supplier: 'Dell Computadores',
    stock: 15,
  },
  {
    id: 2,
    code: 'ITM002',
    name: 'Monitor LG 27"',
    group: 'Eletrônicos',
    supplier: 'LG Brasil',
    stock: 8,
  },
  {
    id: 3,
    code: 'ITM003',
    name: 'Cadeira de Escritório Ergonômica',
    group: 'Móveis',
    supplier: 'MobiliaCorp',
    stock: 24,
  },
  {
    id: 4,
    code: 'ITM004',
    name: 'Mesa de Escritório',
    group: 'Móveis',
    supplier: 'MobiliaCorp',
    stock: 12,
  },
  {
    id: 5,
    code: 'ITM005',
    name: 'Teclado Mecânico Logitech',
    group: 'Eletrônicos',
    supplier: 'Logitech Brasil',
    stock: 35,
  },
  {
    id: 6,
    code: 'ITM006',
    name: 'Mouse sem fio',
    group: 'Eletrônicos',
    supplier: 'Logitech Brasil',
    stock: 42,
  },
  {
    id: 7,
    code: 'ITM007',
    name: 'Café em grãos Premium 1kg',
    group: 'Alimentos',
    supplier: 'Café Especial SA',
    stock: 3,
  },
  {
    id: 8,
    code: 'ITM008',
    name: 'Headset Gaming',
    group: 'Eletrônicos',
    supplier: 'HyperX Brasil',
    stock: 0,
  },
  {
    id: 9,
    code: 'ITM009',
    name: 'Água Mineral 500ml (pack)',
    group: 'Alimentos',
    supplier: 'Águas Cristalinas',
    stock: 57,
  },
  {
    id: 10,
    code: 'ITM010',
    name: 'Mochila para Notebook',
    group: 'Acessórios',
    supplier: 'TravelGear',
    stock: 18,
  },
];

export default Items;
