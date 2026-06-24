/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BUY_TRANSACTIONS, DIVIDEND_TRANSACTIONS } from "../data";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  ShoppingCart, 
  PiggyBank, 
  Calculator,
  Calendar,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function DatabaseTables() {
  const [activeSubTab, setActiveSubTab] = useState<"trades" | "dividends">("trades");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const getCumulativeDividends = () => {
    return DIVIDEND_TRANSACTIONS.reduce((sum, item) => sum + item.totalRecebido, 0);
  };

  const getCumulativeTrades = () => {
    return BUY_TRANSACTIONS.reduce((sum, item) => sum + (item.qtd > 0 ? item.total : 0), 0);
  };

  return (
    <div id="database-ledger-card" className="bg-[#1a1a24] rounded-[14px] border border-[rgba(255,255,255,0.05)] p-6 mt-6">
      
      {/* Header Controller */}
      <div id="ledger-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white tracking-tight">Ledger Financeiro & Extratos Oficiais</h3>
          <span className="text-xs text-gray-400 mt-1">Conferência histórica de fluxo de caixa, aportes e rendas passivas</span>
        </div>
        
        {/* Switch tabs controls */}
        <div className="flex bg-[rgba(0,0,0,0.15)] p-1 rounded-xl border border-[rgba(255,255,255,0.05)]">
          <button
            id="subtab-btn-trades"
            onClick={() => setActiveSubTab("trades")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "trades"
                ? "bg-[#0ea5e9] text-white shadow-[0_0_10px_rgba(14,165,233,0.25)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ShoppingCart size={13} />
            Movimentações ({BUY_TRANSACTIONS.length})
          </button>
          <button
            id="subtab-btn-dividends"
            onClick={() => setActiveSubTab("dividends")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "dividends"
                ? "bg-[#0ea5e9] text-white shadow-[0_0_10px_rgba(14,165,233,0.25)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Coins size={13} />
            Proventos ({DIVIDEND_TRANSACTIONS.length})
          </button>
        </div>
      </div>

      {/* Side calculations summary */}
      <div id="ledger-calc-summary" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-[rgba(0,0,0,0.15)] p-4 rounded-xl border border-[rgba(255,255,255,0.03)] flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans">Acumulado em Compras</span>
            <span className="text-base font-bold text-white mt-1 font-sans [font-variant-numeric:tabular-nums]">
              {formatCurrency(getCumulativeTrades())}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[rgba(14,165,233,0.1)] flex items-center justify-center text-[#0ea5e9]">
            <ShoppingCart size={16} />
          </div>
        </div>

        <div className="bg-[rgba(0,0,0,0.15)] p-4 rounded-xl border border-[rgba(255,255,255,0.03)] flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans">Total Dividendos Pagos</span>
            <span className="text-base font-bold text-[#10b981] mt-1 font-sans [font-variant-numeric:tabular-nums]">
              {formatCurrency(getCumulativeDividends())}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-[#10b981]">
            <Coins size={16} />
          </div>
        </div>

        {/* Realized sales gains summary card */}
        <div className="bg-[rgba(245,158,11,0.03)] p-4 rounded-xl border border-[rgba(245,158,11,0.1)] flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#f59e0b] uppercase tracking-widest font-sans">Lucro Realizado (Vendas)</span>
            <span className="text-base font-bold text-[#f59e0b] mt-1 font-sans [font-variant-numeric:tabular-nums]">
              {formatCurrency(29.00)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[#f59e0b]">
            <Calculator size={16} />
          </div>
        </div>
      </div>

      {/* Dynamic render ledger */}
      <div className="mt-6 border border-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden">
        {activeSubTab === "trades" ? (
          <div id="ledger-trades-table-container" className="overflow-x-auto">
            <table id="trades-history-table" className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[rgba(0,0,0,0.12)] text-[10px] uppercase tracking-widest text-gray-400 border-b border-[rgba(255,255,255,0.05)]">
                  <th className="py-3 px-4 font-semibold">Data Operação</th>
                  <th className="py-3 px-3 font-semibold">Papel / Ticker</th>
                  <th className="py-3 px-3 font-semibold">Tipo</th>
                  <th className="py-3 px-3 font-semibold text-right">Quantidade</th>
                  <th className="py-3 px-3 font-semibold text-right">Preço Unitário</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Financeiro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-xs">
                {BUY_TRANSACTIONS.map((tx, i) => {
                  const isSale = tx.qtd < 0;
                  return (
                    <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                      <td className="py-3.5 px-4 text-gray-400 font-sans">{tx.data}</td>
                      <td className="py-3.5 px-3 font-bold text-white tracking-wider select-all">{tx.ticker}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                          isSale 
                            ? "bg-[rgba(239,68,68,0.12)] text-[#ef4444]" 
                            : "bg-[rgba(16,185,129,0.12)] text-[#10b981]"
                        }`}>
                          {isSale ? "VALE3 VENDA" : "COMPRA"}
                        </span>
                      </td>
                      <td className={`py-3.5 px-3 text-right font-bold font-sans [font-variant-numeric:tabular-nums] ${
                        isSale ? "text-[#ef4444]" : "text-white"
                      }`}>
                        {isSale ? "" : "+"}{tx.qtd}
                      </td>
                      <td className="py-3.5 px-3 text-right font-sans text-gray-300 [font-variant-numeric:tabular-nums]">{formatCurrency(tx.preco)}</td>
                      <td className={`py-3.5 px-4 text-right font-bold font-sans [font-variant-numeric:tabular-nums] ${
                        isSale ? "text-[#10b981]" : "text-white"
                      }`}>
                        {formatCurrency(tx.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Sales informative check note */}
            <div className="p-4 bg-[rgba(245,158,11,0.02)] border-t border-[rgba(255,255,255,0.05)] text-[11px] text-gray-400 leading-relaxed font-sans flex items-start gap-2">
              <span className="text-[#f59e0b] font-bold text-xs">ℹ</span>
              <span>
                <strong>Nota sobre vendas:</strong> Em 30/05/2026, foi registrada a venda de 1 unidade de **VALE3** pelo valor de **R$ 82,00**, com custo médio anterior de **R$ 53,00**, apurando-se um lucro líquido apurado de **R$ 29,00** (+54,72% de rentabilidade nominal).
              </span>
            </div>
          </div>
        ) : (
          <div id="ledger-dividends-table-container" className="overflow-x-auto">
            <table id="dividends-history-table" className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[rgba(0,0,0,0.12)] text-[10px] uppercase tracking-widest text-gray-400 border-b border-[rgba(255,255,255,0.05)]">
                  <th className="py-3 px-4 font-semibold">Ativo Ticker</th>
                  <th className="py-3 px-3 font-semibold">Data COM (Ex)</th>
                  <th className="py-3 px-3 font-semibold text-right">Qtd em Custódia</th>
                  <th className="py-3 px-3 font-semibold">Data Pagamento</th>
                  <th className="py-3 px-3 font-semibold">Provento Tipo</th>
                  <th className="py-3 px-3 text-right font-semibold">Valor Unitário</th>
                  <th className="py-3 px-4 text-right font-semibold text-[#10b981]">Total Creditado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-xs">
                {DIVIDEND_TRANSACTIONS.map((div, i) => (
                  <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white tracking-wider select-all">{div.empresa}</td>
                    <td className="py-3.5 px-3 text-gray-400 font-sans">{div.dataCom}</td>
                    <td className="py-3.5 px-3 text-right font-semibold text-gray-300 font-sans [font-variant-numeric:tabular-nums]">{div.qtdDataCom} un</td>
                    <td className="py-3.5 px-3 text-gray-400 font-sans">{div.dataPagamento}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[rgba(16,185,129,0.1)] text-[#10b981] font-bold text-[10px] uppercase font-sans">
                        {div.tipo}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-gray-300 font-sans [font-variant-numeric:tabular-nums]">{formatCurrency(div.valorPorAcao)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#10b981] font-sans [font-variant-numeric:tabular-nums]">{formatCurrency(div.totalRecebido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
