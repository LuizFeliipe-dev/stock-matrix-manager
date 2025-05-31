
import React from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Produtos',
      href: '/products',
      icon: ShoppingBag
    },
    {
      name: 'Grupos de Produtos',
      href: '/product/group',
      icon: Package
    },
    {
      name: 'Fornecedores',
      href: '/suppliers',
      icon: Truck
    },
    {
      name: 'Clientes',
      href: '/customers',
      icon: Users
    },
    {
      name: 'Pedidos',
      href: '/orders',
      icon: FileText
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: Settings
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 border-r border-gray-200 w-64">
      <div className="px-6 py-4">
        <h1 className="text-lg font-semibold">Painel Administrativo</h1>
      </div>
      <nav className="flex-grow px-6 py-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 font-medium' : ''
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-6 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
