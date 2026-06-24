/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { StockAsset } from "../types";
import { SECTOR_BENCHMARKS } from "../data";
import { ArrowUpRight, CheckCircle, Info, ShieldAlert, Zap } from "lucide-react";

interface AssetsTableProps {
  ativos: StockAsset[];
}

export default function AssetsTable({ ativos }: AssetsTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<StockAsset | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const formatPercent = (val: number) => {
    return `${val.toFixed(2).replace(".", ",")}%`;
  };

  // Helper to validate and score a stock's ratios against historical B3 benchmarks
  const evaluateMultiplier = (asset: StockAsset, type: "pl" | "pvpa" | "dy" | "evEbitda") => {
    const sector = asset.setor;
    const val = asset[type];

    if (val === undefined || val === "N/A" || typeof val === "string") {
      return { status: "neutral", label: "N/A" };
    }

    // Benchmark lookup
    if (sector.includes("Financeiro")) {
      if (type === "pl") {
        if (val < 8) return { status: "cheap", label: "Abaixo da média (Descontado)" };
        if (val <= 12) return { status: "fair", label: "Preço Justo (Médio)" };
        return { status: "expensive", label: "Acima da média (Esticado)" };
      }
      if (type === "pvpa") {
        if (val < 1.5) return { status: "cheap", label: "P/VPA Descontado" };
        if (val <= 2.5) return { status: "fair", label: "P/VPA Justo" };
        return { status: "expensive", label: "P/VPA Elevado" };
      }
      if (type === "dy") {
        if (val > 9) return { status: "cheap", label: "Alto Dividend Yield" };
        if (val >= 5) return { status: "fair", label: "DY Saudável" };
        return { status: "expensive", label: "DY Baixo" };
      }
    }

    if (sector.includes("Energia Elétrica")) {
      if (type === "pl") {
        if (val < 10) return { status: "cheap", label: "P/L Descontado" };
        if (val <= 15) return { status: "fair", label: "P/L Justo" };
        return { status: "expensive", label: "P/L Elevado" };
      }
      if (type === "evEbitda") {
        if (val < 6) return { status: "cheap", label: "EV/EBITDA Baixo" };
        if (val <= 9) return { status: "fair", label: "EV/EBITDA Justo" };
        return { status: "expensive", label: "EV/EBITDA Elevado" };
      }
      if (type === "dy") {
        if (val > 10) return { status: "cheap", label: "Super Dividendos" };
        if (val >= 6) return { status: "fair", label: "DY Alto Redundante" };
        return { status: "expensive", label: "DY Baixo para Utility" };
      }
    }

    if (sector.includes("Indústria")) {
      if (type === "pl") {
        if (val < 18) return { status: "cheap", label: "P/L Descontado para Indústria" };
        if (val <= 35) return { status: "fair", label: "P/L Médio do Setor" };
        return { status: "expensive", label: "P/L Elevado" };
      }
      if (type === "evEbitda") {
        if (val < 14) return { status: "cheap", label: "EV/EBTIDA Descontado" };
        if (val <= 22) return { status: "fair", label: "EV/EBITDA Saudável" };
        return { status: "expensive", label: "EV/EBITDA Alto" };
      }
      if (type === "dy") {
        if (val > 5) return { status: "cheap", label: "Ótimo Dividend Yield" };
        if (val >= 2) return { status: "fair", label: "DY Padrão de Crescimento" };
        return { status: "expensive", label: "DY Irrisório" };
      }
    }

    if (sector.includes("Mineração")) {
      if (type === "pl") {
        if (val < 5) return { status: "cheap", label: "Múltiplo de commodity barato" };
        if (val <= 10) return { status: "fair", label: "P/L Justo Setor" };
        return { status: "expensive", label: "Commodity esticada" };
      }
      if (type === "evEbitda") {
        if (val < 3) return { status: "cheap", label: "Baixo EV/EBITDA" };
        if (val <= 6) return { status: "fair", label: "EV/EBITDA Justo" };
        return { status: "expensive", label: "EV/EBITDA Elevado" };
      }
      if (type === "dy") {
        if (val > 12) return { status: "cheap", label: "DY Altíssimo" };
        if (val >= 7) return { status: "fair", label: "DY Alto Saudável" };
        return { status: "expensive", label: "DY Baixo" };
      }
    }

    if (sector.includes("Petróleo")) {
      if (type === "pl") {
        if (val < 5) return { status: "cheap", label: "Petróleo Barato" };
        if (val <= 8) return { status: "fair", label: "Preço Justo" };
        return { status: "expensive", label: "P/L Alto para O&G" };
      }
      if (type === "evEbitda") {
        if (val < 3) return { status: "cheap", label: "EBITDA Descontado" };
        if (val <= 5) return { status: "fair", label: "EV/EBITDA Médio" };
        return { status: "expensive", label: "EV/EBITDA Elevado" };
      }
      if (type === "dy") {
        if (val > 10) return { status: "cheap", label: "Dividendos Premium" };
        if (val >= 6) return { status: "fair", label: "DY Médio Saudável" };
        return { status: "expensive", label: "DY Ajustado" };
      }
    }

    return { status: "neutral", label: "Moderado" };
  };

  const getStatusColor = (status: string) => {
    if (status === "cheap") return "text-[#10b981] bg-[rgba(16,185,129,0.1)]";
    if (status === "fair") return "text-[#0ea5e9] bg-[rgba(14,165,233,0.1)]";
    if (status === "expensive") return "text-[#ef4444] bg-[rgba(239,68,68,0.1)]";
    return "text-gray-400 bg-[rgba(255,255,255,0.05)]";
  };

  return (
    <div id="assets-table-section" className="bg-[#1a1a24] rounded-[14px] border border-[rgba(255,255,255,0.05)] p-6 mt-6">
      <div id="assets-table-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white tracking-tight">Análise de Ativos em Carteira</h3>
          <span className="text-xs text-gray-400 mt-1">Cotações atualizadas com cômputo granular de múltiplos financeiros</span>
        </div>
        <div id="ativos-count-badge" className="flex items-center gap-2 self-start md:self-auto text-xs font-semibold text-gray-300 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
          {ativos.length} Ações na Carteira Ativa
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto select-none rounded-xl border border-[rgba(255,255,255,0.03)]">
        <table id="portfolio-assets-table" className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[rgba(0,0,0,0.15)] text-[11px] uppercase tracking-wider text-gray-400 border-b border-[rgba(255,255,255,0.05)]">
              <th className="py-4 px-4 font-semibold text-white">Ticker / Empresa</th>
              <th className="py-4 px-3 font-semibold">Setor Econômico</th>
              <th className="py-4 px-3 font-semibold text-right">Cotação</th>
              <th className="py-4 px-3 font-semibold text-right">Quantidade</th>
              <th className="py-4 px-3 font-semibold text-right">% Cart.</th>
              <th className="py-4 px-3 font-semibold text-right text-[#0ea5e9]">Total Alocado</th>
              <th className="py-4 px-3 font-semibold text-center border-l border-[rgba(255,255,255,0.04)]">P/L</th>
              <th className="py-4 px-3 font-semibold text-center">P/VPA</th>
              <th className="py-4 px-3 font-semibold text-center">EV/EBITDA</th>
              <th className="py-4 px-3 font-semibold text-center">DY %</th>
              <th className="py-4 px-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-sm">
            {ativos.map((at) => {
              const plCheck = evaluateMultiplier(at, "pl");
              const pvpaCheck = evaluateMultiplier(at, "pvpa");
              const dyCheck = evaluateMultiplier(at, "dy");
              const evCheck = evaluateMultiplier(at, "evEbitda");

              return (
                <tr 
                  id={`asset-row-${at.ticker}`}
                  key={at.ticker} 
                  className="hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150 group"
                >
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white tracking-tight text-sm select-all">{at.ticker}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[120px]">{at.empresa}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="text-xs text-gray-300 font-sans">{at.setor}</span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="font-semibold text-white font-sans [font-variant-numeric:tabular-nums]">
                      {formatCurrency(at.cotacao)}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="font-medium text-gray-300 font-sans [font-variant-numeric:tabular-nums]">
                      {at.qtd} un
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-white font-sans [font-variant-numeric:tabular-nums]">
                        {at.cart.toFixed(1)}%
                      </span>
                      {/* Mini Bar */}
                      <div className="w-12 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div className="bg-[#0ea5e9] h-full" style={{ width: `${at.cart}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right font-bold text-white border-r border-[rgba(255,255,255,0.04)] font-sans [font-variant-numeric:tabular-nums]">
                    {formatCurrency(at.total)}
                  </td>
                  
                  {/* Multiplier P/L with highlight */}
                  <td className="py-4 px-3 text-center border-l border-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center justify-center">
                      <span 
                        className={`text-xs px-2.5 py-1 rounded-[6px] font-bold font-sans [font-variant-numeric:tabular-nums] ${getStatusColor(plCheck.status)}`}
                        title={plCheck.label}
                      >
                        {at.pl !== undefined ? `${at.pl}x` : "—"}
                      </span>
                    </div>
                  </td>

                  {/* Multiplier P/VPA */}
                  <td className="py-4 px-3 text-center">
                    <div className="flex items-center justify-center">
                      <span 
                        className={`text-xs px-2.5 py-1 rounded-[6px] font-bold font-sans [font-variant-numeric:tabular-nums] ${getStatusColor(pvpaCheck.status)}`}
                        title={pvpaCheck.label}
                      >
                        {at.pvpa !== undefined ? `${at.pvpa}x` : "—"}
                      </span>
                    </div>
                  </td>

                  {/* Multiplier EV/EBITDA */}
                  <td className="py-4 px-3 text-center">
                    <div className="flex items-center justify-center">
                      <span 
                        className={`text-xs px-2.5 py-1 rounded-[6px] font-bold font-sans [font-variant-numeric:tabular-nums] ${getStatusColor(evCheck.status)}`}
                        title={evCheck.label}
                      >
                        {at.evEbitda !== undefined && at.evEbitda !== "N/A" ? `${at.evEbitda}x` : "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Multiplier DY */}
                  <td className="py-4 px-3 text-center">
                    <div className="flex items-center justify-center">
                      <span 
                        className={`text-xs px-2.5 py-1 rounded-[6px] font-bold font-sans [font-variant-numeric:tabular-nums] ${getStatusColor(dyCheck.status)}`}
                        title={dyCheck.label}
                      >
                        {at.dy !== undefined ? `${at.dy}%` : "—"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button 
                      id={`btn-inspect-asset-${at.ticker}`}
                      onClick={() => setSelectedAsset(at)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(14,165,233,0.1)] text-xs text-gray-300 hover:text-white rounded-lg border border-[rgba(255,255,255,0.05)] hover:border-[rgba(14,165,233,0.3)] transition-colors"
                    >
                      <Zap size={12} className="text-[#0ea5e9]" />
                      Detalhes
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail inspect modal drawer interface */}
      {selectedAsset && (
        <div id="inspector-modal-overlay" className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.8)] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div 
            id="inspector-modal-card" 
            className="bg-[#1a1a24] rounded-2xl border border-[rgba(255,255,255,0.08)] max-w-lg w-full overflow-hidden shadow-2xl relative"
          >
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight font-sans">{selectedAsset.ticker}</h2>
                  <span className="text-xs px-2.5 py-0.5 bg-[rgba(14,165,233,0.15)] text-[#0ea5e9] rounded-md font-semibold select-none">
                    {selectedAsset.setor}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">{selectedAsset.empresa}</span>
              </div>
              <button 
                id="close-inspector-x"
                onClick={() => setSelectedAsset(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Top value checks */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[rgba(0,0,0,0.15)] p-4 rounded-xl border border-[rgba(255,255,255,0.03)]">
                  <span className="text-[11px] uppercase text-gray-400 tracking-wider">Cotação Período</span>
                  <p className="text-lg font-bold text-white font-sans mt-1 [font-variant-numeric:tabular-nums]">
                    {formatCurrency(selectedAsset.cotacao)}
                  </p>
                </div>
                <div className="bg-[rgba(0,0,0,0.15)] p-4 rounded-xl border border-[rgba(255,255,255,0.03)]">
                  <span className="text-[11px] uppercase text-gray-400 tracking-wider">Total em Carteira</span>
                  <p className="text-lg font-bold text-[#0ea5e9] font-sans mt-1 [font-variant-numeric:tabular-nums]">
                    {formatCurrency(selectedAsset.total)}
                  </p>
                </div>
              </div>

              {/* Comprehensive ratios list */}
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mt-4">Multiplicadores Granulares</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] uppercase text-gray-400 block mb-0.5">P/L (Preço/Lucro)</span>
                  <span className="text-sm font-bold text-white font-sans">{selectedAsset.pl !== undefined ? `${selectedAsset.pl}x` : "—"}</span>
                </div>
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] uppercase text-gray-400 block mb-0.5">P/VPA</span>
                  <span className="text-sm font-bold text-white font-sans">{selectedAsset.pvpa !== undefined ? `${selectedAsset.pvpa}x` : "—"}</span>
                </div>
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] uppercase text-gray-400 block mb-0.5">EV / EBITDA</span>
                  <span className="text-sm font-bold text-white font-sans">{selectedAsset.evEbitda !== undefined ? `${selectedAsset.evEbitda}x` : "N/A"}</span>
                </div>
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] uppercase text-gray-400 block mb-0.5">Div. Yield (DY)</span>
                  <span className="text-sm font-bold text-[#10b981] font-sans">{selectedAsset.dy !== undefined ? `${selectedAsset.dy}%` : "—"}</span>
                </div>
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] uppercase text-gray-400 block mb-0.5">LPA (Lucro por Ação)</span>
                  <span className="text-sm font-bold text-white font-sans">{selectedAsset.lpa !== undefined ? `${formatCurrency(selectedAsset.lpa)}` : "—"}</span>
                </div>
                <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] uppercase text-gray-400 block mb-0.5">PSR</span>
                  <span className="text-sm font-bold text-white font-sans">{selectedAsset.psr !== undefined ? `${selectedAsset.psr}x` : "—"}</span>
                </div>
              </div>

              {/* Sector checks card */}
              <div className="bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.15)] p-4 rounded-xl mt-4 flex items-start gap-3">
                <Info size={18} className="text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-300 leading-relaxed font-sans">
                  <span className="font-bold text-white">Análise de Adequação: </span>
                  Ativo {selectedAsset.ticker} apresenta um P/L de {selectedAsset.pl}x. O benchmark histórico de B3 para o setor <span className="text-[#0ea5e9] font-medium">{selectedAsset.setor}</span> sugere uma média de <span className="text-white font-semibold">
                    {SECTOR_BENCHMARKS.find(sb => sb.setor === selectedAsset.setor)?.pl || "8–12x"}
                  </span>.
                </div>
              </div>
            </div>

            <div className="p-4 bg-[rgba(0,0,0,0.2)] border-t border-[rgba(255,255,255,0.05)] text-right">
              <button 
                id="close-inspector-btn"
                onClick={() => setSelectedAsset(null)}
                className="px-5 py-2 text-sm bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#025a87] text-white font-semibold rounded-xl transition-all shadow-[0_0_12px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
              >
                Concluir Inspeção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
