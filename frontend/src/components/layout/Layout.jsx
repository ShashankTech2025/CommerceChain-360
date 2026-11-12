/**
 * CommerceChain 360 - Master Application Layout Shell
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import FilterBar from '../filters/FilterBar';

export default function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Global Multi-Dimension Filter Bar */}
        <FilterBar />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 transition-all">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

