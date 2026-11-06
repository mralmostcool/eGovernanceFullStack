"use client";

import React from "react";

interface IncidentItem {
  id: string;
  level: "High Risk" | "Medium Risk" | "Low Risk" | "Behavioral Anomaly";
  description: string;
  time: string;
}

const mockIncidents: IncidentItem[] = [
  {
    id: "1",
    level: "Medium Risk",
    description: "vault-agent attempted unauthorized file access",
    time: "12m ago",
  },
  {
    id: "2",
    level: "High Risk",
    description: "vault-agent attempted unauthorized file access",
    time: "12m ago",
  },
  {
    id: "3",
    level: "Behavioral Anomaly",
    description: "Suspicious memory spike detected on agent audit 2",
    time: "12m ago",
  },
  {
    id: "4",
    level: "Behavioral Anomaly",
    description: "Suspicious memory spike detected on agent audit 2",
    time: "12m ago",
  },
  {
    id: "5",
    level: "Low Risk",
    description: "vault-agent attempted unauthorized file access",
    time: "12m ago",
  },
];

export function IncidentFeed() {
  const getDotColor = (level: IncidentItem["level"]) => {
    switch (level) {
      case "High Risk":
        return "bg-[#bc4749]";
      case "Medium Risk":
        return "bg-[#a7c957]";
      case "Low Risk":
        return "bg-[#386641]";
      case "Behavioral Anomaly":
        return "bg-[#6a994e]";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 rounded-lg bg-[#f2e8cf]/50 text-[#386641]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
        </span>
        <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Incident Feed</h2>
      </div>

      {/* Incidents List */}
      <div className="space-y-3.5 mb-5">
        {mockIncidents.map((incident) => (
          <div key={incident.id} className="text-xs">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(incident.level)}`} />
              <span className="font-semibold text-gray-800">{incident.level}</span>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed pl-3.5">
              {incident.description}
            </p>
            <span className="text-[10px] text-gray-400 pl-3.5 block mt-0.5">
              {incident.time}
            </span>
          </div>
        ))}
      </div>

      {/* Density / Spectrum Bar */}
      <div className="pt-2 border-t border-gray-100">
        <div className="h-4 flex rounded-sm overflow-hidden gap-[1px] bg-gray-50 p-0.5">
          {Array.from({ length: 42 }).map((_, i) => {
            let color = "bg-[#bc4749]";
            if (i > 14 && i < 28) color = "bg-[#a7c957]";
            if (i >= 28) color = "bg-[#6a994e]";
            return (
              <div
                key={i}
                className={`flex-1 rounded-[1px] ${color} opacity-85 hover:opacity-100 transition`}
              />
            );
          })}
        </div>

        {/* Legend Summary Counts */}
        <div className="flex flex-col gap-1.5 mt-3 text-[11px] font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bc4749]" />
            <span>High Risk - 12</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a7c957]" />
            <span>Medium Risk - 22</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#386641]" />
            <span>Low Risk - 32</span>
          </div>
        </div>
      </div>
    </div>
  );
}

