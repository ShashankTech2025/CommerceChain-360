/**
 * CommerceChain 360 - Enterprise Navigation Sidebar
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  Truck,
  CreditCard,
  Table,
  FileText,
  ChevronLeft,
  ChevronRight,
  Database,
  Activity
} from 'lucide-react';
import { useHealth } from '../../hooks/useAnalytics';

const navItems = [
  { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
  { name: 'Sales Intelligence', path: '/sales', icon: TrendingUp },
  { name: 'Customer Intelligence', path: '/customers', icon: Users },
  { name: 'Product & Catalog', path: '/products', icon: Package },
  { name: 'Supply Chain & Delivery', path: '/logistics', icon: Truck },
  { name: 'Payments & CSAT', path: '/payments', icon: CreditCard },
  { name: 'Data Explorer', path: '/explorer', icon: Table },
  { name: 'Executive Reports', path: '/reports', icon: FileText },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: health } = useHealth();

  return (
    <aside
      className={`relative flex flex-col bg-brand-navy text-white transition-all duration-300 z-40 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shrink-0">
            CC
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm tracking-wider text-white">
                COMMERCECHAIN
              </span>
              <span className="text-[10px] text-cyan-300 font-medium tracking-tight">
                360° Intelligence Platform
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Analytics Modules
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Footer / System Health Pill */}
      <div className="p-3 border-t border-white/10">
        <div
          className={`rounded-xl bg-white/5 p-2.5 flex items-center gap-2.5 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative shrink-0">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col text-[11px] truncate">
              <span className="font-semibold text-slate-200">
                {health?.status === 'healthy' ? 'API Connected' : 'Connecting...'}
              </span>
              <span className="text-[10px] text-slate-400">
                Olist Dataset • 99.4K Orders
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

