/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoricalState, DividendTransaction } from "../types";
import { DIVIDEND_TRANSACTIONS } from "../data";
import { TrendingUp, Wallet, Coins, ArrowUpRight, ArrowDownRight, CircleDollarSign } from "lucide-react";

interface KPIGridProps {
  state: HistoricalState;
}

export default function KPIGrid({ state }: KPIGridProps) {
  // Sum dividends received up to state date
  const parseDate = (dStr: string) => {
    // converts "28/03/2026" to Date
    const parts = dStr.split("/");
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  const currentDate = parseDate(state.data);

  const getCumulativeDividends = () => {
    return DIVIDEND_TRANSACTIONS.reduce((sum, div) => {
      // payment dates in base de dados:
      // PETR4: 2026-03-20, TAEE11: 27/05/2026, ITUB4: 04/05/2026, PETR4: 20/05/2026, WEGE3: 17/03/2026
      let divPayDate: Date;
      if (div.dataPagamento.includes("-")) {
        const parts = div.dataPagamento.split("-");
        divPayDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        const parts = div.dataPagamento.split("/");
        divPayDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }

      if (divPayDate <= currentDate) {
        return sum + div.totalRecebido;
      }
      return sum;
    }, 0);
  };

  // Portfolio Current Valuation
  const portfolioValuation = state.ativos.reduce((sum, item) => sum + item.total, 0);
  
  // Cost basis of active assets in the selected period (as listed in our sheet summaries):
  // 28/03/2026: 499.76
  // 30/04/2026: 943.46 (576.81 + 132.33 + 47.80 + 171.74 + 141.48) = 1070.16 cost basis.
  // Wait, let's look at the active total cost basis from the sheets:
  // 28/03/2026: Capital Applied was 499.76.
  // 30/04/2026: Capital Applied was 999.76.
  // 30/05/2026: Capital Applied was 1499.76.
  // 13/06/2026: Capital Applied was 1499.76.
  const capitalApplied = state.totalInvestidoAcumulado;

  // Rentabilidade (Yield)
  const totalDividends = getCumulativeDividends();
  
  // Realized profit calculation: Sale of VALE3 in May bought at 53 (Average cost), sold at 82. Qty: 1. Profit = 29.00
  const realizedSalesProfit = currentDate >= parseDate("30/05/2026") ? 29.00 : 0.00;

  // Performance total = (Market value + cash remaining + dividends + sale profits) - Aportes
  // Let's make it intuitive: Current asset value vs Capital Applied Cost basis.
  // Or: Rentabilidade real = (Portfolio Value + Cash + Cumulative Dividends) - Aportes.
  // Let's use the standard asset appreciation: Portfolio Valuation - Cost basis.
  // Let's calculate based on standard asset valuation vs capital applied:
  const isLoss = portfolioValuation < capitalApplied;
  const netAppreciation = portfolioValuation - capitalApplied;
  const appreciationPercent = (netAppreciation / capitalApplied) * 100;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  return (
    <div id="kpi-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* KPI Card 1: Patrimônio Atual */}
      <div 
        id="kpi-card-patrimonio" 
        className="bg-[#1a1a24] p-6 rounded-[14px] border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(14,165,233,0.1)] group"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Patrimônio Ativo</span>
          <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.08)] flex items-center justify-center text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all duration-300">
            <Wallet size={20} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white tracking-tight font-sans select-none [font-variant-numeric:tabular-nums]">
            {formatCurrency(portfolioValuation)}
          </span>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
              isLoss 
                ? "bg-[rgba(239,68,68,0.1)] text-[#ef4444]" 
                : "bg-[rgba(16,185,129,0.1)] text-[#10b981]"
            }`}>
              {isLoss ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
              {isLoss ? "" : "+"}{appreciationPercent.toFixed(2)}%
            </span>
            <span className="text-[11px] text-gray-400 select-none">vs. custo de aquisição</span>
          </div>
        </div>
      </div>

      {/* KPI Card 2: Aportes Acumulados */}
      <div 
        id="kpi-card-aportes" 
        className="bg-[#1a1a24] p-6 rounded-[14px] border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,255,255,0.03)] group"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Aportes Acumulados</span>
          <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.08)] flex items-center justify-center text-[#f59e0b] group-hover:bg-[#f59e0b] group-hover:text-white transition-all duration-300">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white tracking-tight font-sans select-none [font-variant-numeric:tabular-nums]">
            {formatCurrency(capitalApplied)}
          </span>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.05)] text-gray-300">
              Ref. {state.data}
            </span>
            <span className="text-[11px] text-gray-400 select-none">Total depositado</span>
          </div>
        </div>
      </div>

      {/* KPI Card 3: Lucro/Prejuízo da Carteira */}
      <div 
        id="kpi-card-rendimento" 
        className="bg-[#1a1a24] p-6 rounded-[14px] border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)] group"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium font-sans">Resultado Líquido</span>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isLoss 
              ? "bg-[rgba(239,68,68,0.08)] text-[#ef4444] group-hover:bg-[#ef4444] group-hover:text-white" 
              : "bg-[rgba(16,185,129,0.08)] text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white"
          }`}>
            <CircleDollarSign size={20} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className={`text-2xl font-bold tracking-tight font-sans select-none [font-variant-numeric:tabular-nums] ${
            isLoss ? "text-[#ef4444]" : "text-[#10b981]"
          }`}>
            {isLoss ? "" : "+"}{formatCurrency(netAppreciation)}
          </span>
          <div className="flex items-center gap-1.5 mt-2.5">
            {realizedSalesProfit > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[rgba(16,185,129,0.15)] text-[#10b981] font-sans">
                + {formatCurrency(realizedSalesProfit)} lucro realizado
              </span>
            )}
            <span className="text-[11px] text-gray-400 select-none">
              {isLoss ? "Remuneração negativa temporária" : "Valorização cambial líquida"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Card 4: Dividendos Recebidos */}
      <div 
        id="kpi-card-proventos" 
        className="bg-[#1a1a24] p-6 rounded-[14px] border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)] group"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Proventos Recebidos</span>
          <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.08)] flex items-center justify-center text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white transition-all duration-300">
            <Coins size={20} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white tracking-tight font-sans select-none [font-variant-numeric:tabular-nums]">
            {formatCurrency(totalDividends)}
          </span>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[rgba(16,185,129,0.1)] text-[#10b981]">
              99+ Atividade
            </span>
            <span className="text-[11px] text-gray-400 select-none">Total acumulado em caixa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
