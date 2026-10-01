import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
