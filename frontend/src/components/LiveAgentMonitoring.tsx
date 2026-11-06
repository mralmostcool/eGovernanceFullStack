"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, Download, ExternalLink } from "lucide-react";

interface AgentRow {
  name: string;
  role: string;
  task: string;
  urgency: number;
  urgencyLabel: "High" | "Medium" | "Low";
  cpu: number;
  memory: string;
  status: "Running" | "Idle" | "Paused" | "Blocked";
  lastActivity: string;
}

const mockAgents: AgentRow[] = [
  {
    name: "Sue",
    role: "SOC Analyst A...",
    task: "Scan Internal Docs",
    urgency: 72,
    urgencyLabel: "High",
    cpu: 61,
    memory: "512 MB",
    status: "Running",
    lastActivity: "12s ago",
  },
  {
    name: "Muhammad",
    role: "Threat...",
    task: "Scan Internal Docs",
    urgency: 72,
    urgencyLabel: "High",
    cpu: 61,
    memory: "512 MB",
    status: "Running",
    lastActivity: "5m ago",
  },
  {
    name: "Jose",
    role: "Detections En...",
    task: "API Audit",
    urgency: 22,
    urgencyLabel: "Low",
    cpu: 12,
    memory: "220 MB",
    status: "Idle",
    lastActivity: "1m ago",
  },
  {
    name: "Sue",
    role: "SOC Analyst A...",
    task: "Optimize Database",
    urgency: 70,
    urgencyLabel: "High",
    cpu: 55,
    memory: "1 GB",
    status: "Paused",
    lastActivity: "2h ago",
  },
  {
    name: "Bob",
    role: "Threat Hunter...",
    task: "Scan Internal Docs",
    urgency: 88,
    urgencyLabel: "High",
    cpu: 88,
    memory: "1.2 GB",
    status: "Blocked",
    lastActivity: "2m ago",
  },
  {
    name: "Sue",
    role: "SOC Analyst A...",
    task: "Backup User Data",
    urgency: 60,
    urgencyLabel: "Medium",
    cpu: 40,
    memory: "256 MB",
    status: "Idle",
    lastActivity: "1h ago",
  },
];

export function LiveAgentMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getStatusBadge = (status: AgentRow["status"]) => {
    switch (status) {
      case "Running":
        return "bg-[#6a994e] text-white";
      case "Idle":
        return "bg-[#a7c957] text-[#1c241d] font-semibold";
      case "Paused":
        return "bg-[#386641]/15 text-[#386641] font-semibold border border-[#386641]/30";
      case "Blocked":
        return "bg-[#bc4749] text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getUrgencyColor = (label: AgentRow["urgencyLabel"]) => {
    switch (label) {
      case "High":
        return "text-[#bc4749]";
      case "Medium":
        return "text-[#6a994e]";
      case "Low":
        return "text-[#386641]";
    }
  };

  const filtered = mockAgents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#f2e8cf]/50 text-[#386641]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </span>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Live Agent Monitoring</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#f2e8cf]/30 border border-gray-200/80 rounded-lg pl-7 pr-3 py-1 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#386641]"
            />
          </div>

          {/* Filter */}
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-gray-200/90 rounded-lg text-gray-600 hover:bg-[#f2e8cf]/30 transition">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Filter</span>
          </button>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-gray-200/90 rounded-lg text-gray-600 hover:bg-[#f2e8cf]/30 transition"
          >
            <span>Sort by</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {/* Export */}
          <button className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200/90 rounded-lg text-[#386641] hover:bg-[#f2e8cf]/30 font-medium transition">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100 font-medium">
              <th className="pb-2.5 font-medium">Agent</th>
              <th className="pb-2.5 font-medium">Task</th>
              <th className="pb-2.5 font-medium">UrgencyScore™</th>
              <th className="pb-2.5 font-medium">CPU</th>
              <th className="pb-2.5 font-medium">Memory</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium">Last Activity</th>
              <th className="pb-2.5 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((agent, i) => (
              <tr key={i} className="hover:bg-[#f2e8cf]/20 transition-colors">
                <td className="py-2.5 font-medium text-gray-800">
                  <span>{agent.name}</span>{" "}
                  <span className="text-gray-400 font-normal">({agent.role})</span>
                </td>
                <td className="py-2.5 text-gray-600">{agent.task}</td>
                <td className="py-2.5 font-semibold">
                  <span className={getUrgencyColor(agent.urgencyLabel)}>
                    {agent.urgency} ({agent.urgencyLabel})
                  </span>
                </td>
                <td className="py-2.5 text-gray-600 font-medium">{agent.cpu}%</td>
                <td className="py-2.5 text-gray-600 font-medium">{agent.memory}</td>
                <td className="py-2.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] tracking-wide ${getStatusBadge(
                      agent.status
                    )}`}
                  >
                    {agent.status}
                  </span>
                </td>
                <td className="py-2.5 text-gray-400">{agent.lastActivity}</td>
                <td className="py-2.5 text-right">
                  <button className="text-[11px] font-medium text-[#386641] hover:underline flex items-center justify-end gap-1 ml-auto">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

