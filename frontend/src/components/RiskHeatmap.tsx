"use client";

import React, { useState } from "react";
import { Download, ChevronDown } from "lucide-react";

export function RiskHeatmap() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [hoveredCell, setHoveredCell] = useState<{
    col: number;
    row: number;
    score: number;
    agent: string;
    trigger: string;
    date: string;
  } | null>({
    col: 18,
    row: 3,
    score: 94,
    agent: "agent-vault-01",
    trigger: "Policy breach",
    date: "May 13, Mon",
  });

  const days = ["Mon", "Thu", "Sun"];
  const totalWeeks = 48; // across the 12 months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Heat levels based on color scheme:
  // Level 0: faint vanilla #f2e8cf / #f0ecd9
  // Level 1: pale yellow-green #a7c957 (lightened)
  // Level 2: sage-green #6a994e
  // Level 3: blushed brick light #e07a5f / #bc4749 at 60%
  // Level 4: full blushed brick #bc4749
  // Level 5: deep brick #8f2d2f
  const getColorForCell = (col: number, row: number) => {
    // Replicating heatmap pattern from screenshot: lower left is calmer, right side has heavy red/brick clusters
    const seed = (col * 7 + row * 13) % 100;
    if (col < 16) {
      if (seed > 85) return "bg-[#bc4749]";
      if (seed > 70) return "bg-[#bc4749]/80";
      if (seed > 50) return "bg-[#bc4749]/50";
      if (seed > 30) return "bg-[#a7c957]";
      return "bg-[#f2e8cf]";
    } else {
      if (seed > 80) return "bg-[#7d1d20]";
      if (seed > 50) return "bg-[#bc4749]";
      if (seed > 30) return "bg-[#bc4749]/80";
      if (seed > 15) return "bg-[#bc4749]/50";
      return "bg-[#a7c957]";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#f2e8cf]/50 text-[#386641]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </span>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
            UrgencyScore Risk Heatmap
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-gray-200/90 rounded-lg text-gray-600 hover:bg-[#f2e8cf]/30 transition font-medium">
            <span>{selectedYear}</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200/90 rounded-lg text-[#386641] hover:bg-[#f2e8cf]/30 font-medium transition">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Heatmap Grid & Legend */}
      <div className="relative pt-2">
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between py-1 pr-3 text-[10px] text-gray-400 font-medium select-none h-[116px]">
            <span>Mon</span>
            <span>Thu</span>
            <span>Sun</span>
          </div>

          {/* Grid columns */}
          <div className="flex-1 overflow-x-auto pb-2">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-[3.5px]">
              {Array.from({ length: totalWeeks }).map((_, cIndex) =>
                Array.from({ length: 7 }).map((__, rIndex) => {
                  const isHovered =
                    hoveredCell?.col === cIndex && hoveredCell?.row === rIndex;
                  return (
                    <div
                      key={`${cIndex}-${rIndex}`}
                      onMouseEnter={() =>
                        setHoveredCell({
                          col: cIndex,
                          row: rIndex,
                          score: 94,
                          agent: "agent-vault-01",
                          trigger: "Policy breach",
                          date: "May 13, Mon",
                        })
                      }
                      className={`w-[13px] h-[13px] rounded-[2.5px] cursor-pointer transition-transform ${getColorForCell(
                        cIndex,
                        rIndex
                      )} ${isHovered ? "ring-2 ring-black scale-125 z-20" : "hover:opacity-85"}`}
                    />
                  );
                })
              )}
            </div>

            {/* Months row */}
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1 font-medium select-none">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Tooltip matching image mockup */}
        {hoveredCell && (
          <div
            className="absolute left-[38%] top-[10px] z-30 bg-white border border-gray-200 shadow-xl rounded-xl p-3 text-xs pointer-events-none transition-all duration-200 animate-in fade-in"
            style={{ width: "210px" }}
          >
            <div className="font-semibold text-gray-900 text-xs">
              Critical Risk Detected
            </div>
            <div className="text-[11px] text-gray-500 font-medium mb-1">
              {hoveredCell.date}
            </div>
            <div className="text-[11px] text-gray-700">
              <span className="text-gray-400">Agent Name:</span>{" "}
              <span className="font-medium text-[#386641]">{hoveredCell.agent}</span>
            </div>
            <div className="text-[11px] text-gray-700">
              <span className="text-gray-400">Peak Score:</span>{" "}
              <span className="font-semibold text-[#bc4749]">
                {hoveredCell.score} / 100
              </span>
            </div>
            <div className="text-[11px] text-gray-700">
              <span className="text-gray-400">Trigger:</span>{" "}
              <span className="font-medium text-gray-800">{hoveredCell.trigger}</span>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute left-6 -bottom-1.5 w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45" />
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-gray-400 font-medium">
          <span>Low</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-[#f2e8cf]" />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#a7c957]" />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#bc4749]/50" />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#bc4749]" />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#7d1d20]" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
}

