
import React from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  Truck,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

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

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <h1 className="text-lg font-semibold">Painel Administrativo</h1>
                </div>
                
                <nav className="flex-1 p-6">
                  <ul className="space-y-2">
                    {navigationItems.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
                              isActive && "bg-primary text-primary-foreground font-medium"
                            )
                          }
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-6 border-t">
                  <Button
                    onClick={logout}
                    variant="destructive"
                    className="w-full"
                  >
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-white md:border-r md:border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Painel Administrativo</h1>
        </div>
        
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
                      isActive && "bg-primary text-primary-foreground font-medium"
                    )
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t">
          <Button
            onClick={logout}
            variant="destructive"
            className="w-full"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
