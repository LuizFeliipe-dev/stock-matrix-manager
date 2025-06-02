
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-white px-4">
            <SidebarTrigger className="mr-4" />
          </header>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
