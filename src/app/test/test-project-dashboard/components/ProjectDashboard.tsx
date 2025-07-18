import Sidebar from './Sidebar';
import Header from './Header';
import TabNavigation from './TabNavigation';
import DashboardContent from './DashboardContent';

const ProjectDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <TabNavigation />
        <DashboardContent />
      </div>
    </div>
  );
};

export default ProjectDashboard; 