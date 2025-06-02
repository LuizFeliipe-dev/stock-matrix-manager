
import { useEffect } from 'react';
import AuthRequired from '../components/AuthRequired';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

// Dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatisticsCards from '@/components/dashboard/StatisticsCards';
import TasksSection from '@/components/dashboard/TasksSection';
import ActivitySection from '@/components/dashboard/ActivitySection';
import QuickLinksSection from '@/components/dashboard/QuickLinksSection';
import WarehouseViewSection from '@/components/dashboard/WarehouseViewSection';

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <AuthRequired>
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <DashboardHeader />
            <StatisticsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <TasksSection />
              <ActivitySection />
            </div>
            
            <QuickLinksSection />
            
            {!isMobile && <WarehouseViewSection />}
          </motion.div>
        </ResponsiveContainer>
      </AppLayout>
    </AuthRequired>
  );
};

export default Dashboard;
