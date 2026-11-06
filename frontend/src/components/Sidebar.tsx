"use client";

import React from "react";
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  Flame,
  Activity,
  ShieldCheck,
  Stethoscope,
  LineChart,
  Bell,
  Users,
  CreditCard,
  HelpCircle,
  Settings,
  Search,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function Sidebar({ currentTab = "Dashboard", onSelectTab }: SidebarProps) {
  const monitoringItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Live Agents Monitoring", icon: Radio },
    { name: "Incidents", icon: AlertTriangle },
  ];

  const analysisItems = [
    { name: "Risk Heatmap", icon: Flame },
    { name: "Performance Metrics", icon: Activity },
    { name: "Policy Management", icon: ShieldCheck },
  ];

  const systemHealthItems = [
    { name: "Urgent Care", icon: Stethoscope },
    { name: "Performance Metrics", icon: LineChart },
  ];

  const logsAdminItems = [
    { name: "Notifications", icon: Bell },
    { name: "User Roles & Permissions", icon: Users },
    { name: "Subscription", icon: CreditCard },
  ];

  const renderNavGroup = (title: string, items: { name: string; icon: any }[]) => (
    <div className="mb-6">
      <div className="text-[11px] font-semibold text-[#6a994e] uppercase tracking-wider px-3 mb-2">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item, idx) => {
          const isActive = currentTab === item.name;
          const Icon = item.icon;
          return (
            <button
              key={`${item.name}-${idx}`}
              onClick={() => onSelectTab && onSelectTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#386641] text-white shadow-sm"
                  : "text-[#386641]/80 hover:bg-[#f2e8cf]/60 hover:text-[#386641]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-[#386641]/10 flex flex-col justify-between shrink-0">
      <div className="p-4">
        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2e8cf]/40 transition cursor-pointer mb-5 border border-transparent hover:border-[#a7c957]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#bc4749] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#bc4749]/20">
              RD
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-gray-900 leading-tight">
                Rizal Dwi Artanto
              </div>
              <div className="text-[10px] text-gray-500 font-medium">SOC Lead</div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#f2e8cf]/25 border border-gray-200/80 rounded-lg pl-8 pr-8 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#386641] focus:ring-1 focus:ring-[#386641]"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border border-gray-200 px-1 rounded bg-white font-mono">
            ⌘F
          </span>
        </div>

        {/* Nav Sections */}
        {renderNavGroup("Monitoring", monitoringItems)}
        {renderNavGroup("Analysis & Risk", analysisItems)}
        {renderNavGroup("System Health", systemHealthItems)}
        {renderNavGroup("Logs & Admin", logsAdminItems)}
      </div>

      {/* Footer Support/Settings */}
      <div className="p-4 border-t border-[#386641]/10 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#386641]/80 hover:bg-[#f2e8cf]/60">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Help & Support</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#386641]/80 hover:bg-[#f2e8cf]/60">
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

