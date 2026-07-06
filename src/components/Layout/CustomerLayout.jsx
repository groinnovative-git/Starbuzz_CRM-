// CustomerLayout.jsx — Customer Portal layout

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const CustomerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout portal-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main">
        <Header onMenuToggle={() => setMobileOpen(prev => !prev)} />
        <div className="app-page page-enter">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
