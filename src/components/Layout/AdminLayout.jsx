// AdminLayout.jsx — Main CRM layout with fixed sidebar

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(prev => !prev)}
      />
      <div className={`app-main ${isCollapsed ? 'collapsed' : ''}`}>
        <Header onMenuToggle={() => setMobileOpen(prev => !prev)} />
        <div className="app-page page-enter">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
