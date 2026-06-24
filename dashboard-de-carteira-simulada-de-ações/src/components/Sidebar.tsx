/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  History, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Menu,
  Coins,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed 
}: SidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Painel Geral", icon: PieChart },
    { id: "transactions", label: "Extratos & Lançamentos", icon: History },
    { id: "benchmarks", label: "Análise Setorial", icon: Award },
  ];

  return (
    <aside 
      id="app-sidebar"
      className={`fixed top-0 left-0 h-screen bg-[#1a1a24] border-r border-[rgba(255,255,255,0.05)] text-gray-300 flex flex-col justify-between z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[70px]" : "w-[260px]"
      }`}
    >
      {/* Sidebar Header / Logo */}
      <div>
        <div id="sidebar-logo-container" className="h-16 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0ea5e9] to-[#0284c7] flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(14,165,233,0.3)]">
              C
            </div>
            {!isCollapsed && (
              <span id="sidebar-logo-text" className="font-bold text-lg select-none text-white tracking-tight animate-fade-in whitespace-nowrap">
                Carteira<span className="text-[#0ea5e9]">Alpha</span>
              </span>
            )}
          </div>
          
          <button
            id="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white transition-colors"
            title={isCollapsed ? "Expandir" : "Recolher"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-[rgba(14,165,233,0.1)] text-white font-medium border-l-4 border-[#0ea5e9]" 
                    : "hover:bg-[rgba(255,255,255,0.03)] hover:text-white text-gray-400"
                }`}
              >
                <div className="flex items-center justify-center">
                  <Icon size={18} className={isActive ? "text-[#0ea5e9]" : "group-hover:text-gray-200"} />
                </div>
                {!isCollapsed && (
                  <span className="text-sm tracking-wide transition-opacity duration-300">
                    {item.label}
                  </span>
                )}
                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-[80px] bg-[#1a1a24] text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 whitespace-nowrap border border-[rgba(255,255,255,0.05)] shadow-xl z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Container */}
      <div id="sidebar-footer" className="p-3 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Avatar holding active or mock investor profile photo */}
          <div className="flex-shrink-0 relative">
            <div 
              id="user-profile-avatar"
              className="w-10 h-10 rounded-xl bg-white border border-white/20 hover:scale-105 transition-transform flex items-center justify-center font-extrabold text-slate-950 font-sans text-xs cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.25)]"
              title="Tarsis William (tarsis.william@discente.ufma.br)"
            >
              TW
            </div>
            <span className="absolute bottom-[-1px] right-[-1px] w-3.5 h-3.5 bg-[#10b981] border-2 border-[#1a1a24] rounded-full" title="Online" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 select-none animate-fade-in">
              <span id="user-display-name" className="text-sm font-semibold text-white truncate leading-tight">
                Tarsis William
              </span>
              <span id="user-display-email" className="text-[11px] text-gray-400 truncate mt-0.5" title="tarsis.william@discente.ufma.br">
                tarsis.william@discente.ufma.br
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
