"use client";

import React, { useState } from "react";
import { Filter, Download } from "lucide-react";

export function PerformanceMetrics() {
  const [activeRange, setActiveRange] = useState("09/01");

  // Time ticks along x axis
  const timeLabels = [
    "09/01\n10:00 PM",
    "09/01\n03:00 PM",
    "09/01\n07:00 PM",
    "09/01\n11:00 PM",
    "09/01\n04:00 AM",
    "09/01\n08:00 AM",
    "09/01\n12:00 PM",
    "09/01\n04:00 PM",
    "09/01\n08:00 PM",
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
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
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Performance Metrics</h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-gray-200/90 rounded-lg text-gray-600 hover:bg-[#f2e8cf]/30 transition">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200/90 rounded-lg text-[#386641] hover:bg-[#f2e8cf]/30 font-medium transition">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stepped line chart SVG visual matching screenshot */}
      <div className="relative pt-2">
        <div className="flex">
          {/* Y Axis percentage marks */}
          <div className="flex flex-col justify-between text-[10px] text-gray-400 font-medium pr-3 h-[120px] select-none text-right w-10">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Chart area */}
          <div className="flex-1 relative h-[120px]">
            {/* Grid horizontal lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-gray-100 w-full h-0" />
              <div className="border-b border-gray-100 w-full h-0" />
              <div className="border-b border-gray-100 w-full h-0" />
              <div className="border-b border-gray-100 w-full h-0" />
              <div className="border-b border-gray-200 w-full h-0" />
            </div>

            {/* SVG Chart paths */}
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 700 120"
              preserveAspectRatio="none"
            >
              {/* Shaded baseline fill with vanilla cream tint */}
              <path
                d="M 0,120 L 0,85 L 70,85 L 70,80 L 150,80 L 150,90 L 220,90 L 220,95 L 300,95 L 300,80 L 370,80 L 370,85 L 450,85 L 450,82 L 530,82 L 530,85 L 610,85 L 610,80 L 700,80 L 700,120 Z"
                fill="#f2e8cf"
                fillOpacity="0.45"
              />

              {/* Stepped line 1: Sage / Yellow-green tone (Threshold/CPU peak) */}
              <path
                d="M 0,80 L 80,80 L 80,68 L 160,68 L 160,62 L 230,62 L 230,78 L 330,78 L 330,60 L 410,60 L 410,66 L 500,66 L 500,72 L 620,72 L 620,68 L 700,68"
                fill="none"
                stroke="#a7c957"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Stepped line 2: Hunter Green / Sage tone (Memory load line) */}
              <path
                d="M 0,85 L 70,85 L 70,78 L 150,78 L 150,86 L 220,86 L 220,95 L 300,95 L 300,80 L 370,80 L 370,85 L 450,85 L 450,80 L 530,80 L 530,83 L 610,83 L 610,78 L 700,78"
                fill="none"
                stroke="#386641"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Stepped line 3: Accent indicator (Blushed Brick / Blue-ish tone in design, using hunter-green accent) */}
              <path
                d="M 0,95 L 90,95 L 90,88 L 170,88 L 170,92 L 260,92 L 260,86 L 350,86 L 350,90 L 460,90 L 460,85 L 560,85 L 560,89 L 700,89"
                fill="none"
                stroke="#6a994e"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </svg>
          </div>
        </div>

        {/* X Axis Time Labels */}
        <div className="flex justify-between pl-12 pr-1 mt-2 text-[9px] text-gray-400 font-mono select-none">
          {timeLabels.map((lbl, idx) => {
            const [date, time] = lbl.split("\n");
            return (
              <div key={idx} className="text-center">
                <div>{date}</div>
                <div className="text-[8px] text-gray-400/80">{time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

