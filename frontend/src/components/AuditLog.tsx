"use client";

import React from "react";
import { Pause, FileText } from "lucide-react";

interface AuditLogItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: "pause" | "policy";
}

const mockAuditLogs: AuditLogItem[] = [
  {
    id: "1",
    title: "Paused Agent",
    description: "Admin JohnDoe paused agent 'vault-agent'",
    time: "12m ago",
    icon: "pause",
  },
  {
    id: "2",
    title: "Policy Updated",
    description: "Policy \"Restrict External API\" updated",
    time: "12m ago",
    icon: "policy",
  },
];

export function AuditLog() {
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
        <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Audit Log</h2>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {mockAuditLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 text-xs">
            <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center shrink-0 text-gray-500 bg-[#f2e8cf]/30">
              {log.icon === "pause" ? (
                <Pause className="w-3 h-3 text-[#386641]" />
              ) : (
                <FileText className="w-3 h-3 text-[#6a994e]" />
              )}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-xs">{log.title}</div>
              <p className="text-gray-500 text-[11px] leading-snug mt-0.5">
                {log.description}
              </p>
              <span className="text-[10px] text-gray-400 block mt-0.5">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

