/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SECTOR_BENCHMARKS } from "../data";
import { ShieldCheck, ArrowUpRight, Award, Info } from "lucide-react";

export default function SectorBenchmarksCard() {
  return (
    <div id="benchmarks-container-card" className="bg-[#1a1a24] rounded-[14px] border border-[rgba(255,255,255,0.05)] p-6 mt-6">
      
      {/* Title */}
      <div id="benchmarks-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="text-[#0ea5e9]" size={18} />
            Benchmarks Históricos da B3
          </h3>
          <span className="text-xs text-gray-400 mt-1">
            Parâmetros médios do mercado brasileiro para triagem fundamentalista (múltiplos padrão)
          </span>
        </div>
        <span className="text-xs text-gray-300 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded-xl font-medium select-none">
          Média Histórica Regulada
        </span>
      </div>

      {/* Grid of Sector benchmarks */}
      <div id="benchmarks-sectors-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {SECTOR_BENCHMARKS.map((item, index) => (
          <div 
            id={`benchmark-sector-card-${index}`}
            key={item.setor} 
            className="p-5 rounded-xl bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(14,165,233,0.15)] transition-all duration-300 relative group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white tracking-wide font-sans truncate pr-2">
                {item.setor}
              </span>
              <ShieldCheck size={16} className="text-[#10b981] opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Metrics row */}
            <div className="space-y-2 mt-4 text-xs font-sans">
              <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.03)]">
                <span className="text-gray-400">P/L (Preço / Lucro)</span>
                <span className="font-semibold text-white [font-variant-numeric:tabular-nums]">{item.pl}</span>
              </div>
              
              {item.evEbitda && (
                <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-gray-400">EV / EBITDA</span>
                  <span className="font-semibold text-white [font-variant-numeric:tabular-nums]">{item.evEbitda}</span>
                </div>
              )}

              {item.pvpa && (
                <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-gray-400">P / VPA (Preço / VPA)</span>
                  <span className="font-semibold text-white [font-variant-numeric:tabular-nums]">{item.pvpa}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Dividend Yield Esperado</span>
                <span className="font-semibold text-[#10b981] [font-variant-numeric:tabular-nums]">{item.dy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* General tutorial tip */}
      <div id="benchmarks-footer-tip" className="bg-[rgba(16,185,129,0.02)] border border-[rgba(16,185,129,0.1)] p-4 rounded-xl mt-6 flex items-start gap-3">
        <Info size={18} className="text-[#10b981] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 leading-relaxed font-sans">
          <span className="font-bold text-white">Como utilizar estes marcos de mercado? </span>
          Compare os múltiplos do seu ativo (indicados na Tabela de Ativos) com os valores exibidos acima. 
          Empresas que negociam <strong>abaixo</strong> da média de P/L ou EV/EBITDA do setor e oferecem um indicador de 
          Dividend Yield <strong>superior ao benchmark</strong> histórico podem sinalizar oportunidades de investimento de valor 
          (estilo Graham/Buffett) com margem de segurança atrativa.
        </div>
      </div>

    </div>
  );
}
