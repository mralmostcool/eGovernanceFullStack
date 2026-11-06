"use client";

import React, { useState } from "react";
import { RefreshCw, Download } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { LiveAgentMonitoring } from "@/components/LiveAgentMonitoring";
import { RiskHeatmap } from "@/components/RiskHeatmap";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { IncidentFeed } from "@/components/IncidentFeed";
import { AuditLog } from "@/components/AuditLog";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex min-h-screen bg-[#f7f9f6] text-gray-800 antialiased font-sans selection:bg-[#a7c957]/40 selection:text-[#386641]">
      {/* Left Sidebar */}
      <Sidebar currentTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="px-8 pt-7 pb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200/90 bg-white text-xs font-medium text-gray-700 hover:bg-[#f2e8cf]/30 hover:border-[#386641]/30 transition shadow-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-gray-500 ${
                  isRefreshing ? "animate-spin text-[#386641]" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#386641] text-white text-xs font-semibold hover:bg-[#386641]/90 shadow-xs transition">
              <Download className="w-3.5 h-3.5" />
              <span>Export All Data</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="px-8 pb-8 flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Left 8-col section */}
            <div className="xl:col-span-8 flex flex-col gap-5">
              <LiveAgentMonitoring />
              <RiskHeatmap />
              <PerformanceMetrics />
            </div>

            {/* Right 4-col section */}
            <div className="xl:col-span-4 flex flex-col gap-5">
              <IncidentFeed />
              <AuditLog />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
