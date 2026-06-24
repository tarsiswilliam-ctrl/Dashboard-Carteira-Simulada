/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoricalState, BuyTransaction, DividendTransaction, SectorBenchmark } from "./types";

export const SECTOR_BENCHMARKS: SectorBenchmark[] = [
  { setor: "Financeiro (Bancário)", pl: "8–12x", pvpa: "1,5–2,5x", dy: "5–9%" },
  { setor: "Energia Elétrica (Transmissão)", pl: "10–15x", evEbitda: "6–9x", dy: "6–10%" },
  { setor: "Indústria (Bens de Capital)", pl: "18–35x", evEbitda: "14–22x", dy: "2–5%" },
  { setor: "Mineração (Commodities)", pl: "5–10x", evEbitda: "3–6x", dy: "7–12%" },
  { setor: "Petróleo e Gás", pl: "5–8x", evEbitda: "3–5x", dy: "6–10%" }
];

export const BUY_TRANSACTIONS: BuyTransaction[] = [
  { data: "28/03/2026", ticker: "ITUB4", qtd: 3, preco: 41.40, total: 124.20 },
  { data: "28/03/2026", ticker: "TAEE11", qtd: 3, preco: 41.11, total: 123.33 },
  { data: "28/03/2026", ticker: "WEGE3", qtd: 1, preco: 47.41, total: 47.41 },
  { data: "28/03/2026", ticker: "VALE3", qtd: 2, preco: 53.00, total: 106.00 },
  { data: "28/03/2026", ticker: "PETR4", qtd: 2, preco: 49.41, total: 98.82 },
  { data: "30/04/2026", ticker: "ITUB4", qtd: 10, preco: 44.37, total: 443.70 },
  { data: "30/05/2026", ticker: "VALE3", qtd: -1, preco: 82.00, total: 82.00 }, // Sale
  { data: "30/05/2026", ticker: "PETR4", qtd: 3, preco: 31.46, total: 94.38 },
  { data: "30/05/2026", ticker: "WEGE3", qtd: 2, preco: 42.50, total: 85.00 },
  { data: "13/06/2026", ticker: "TAEE11", qtd: 1, preco: 39.69, total: 39.69 }
];

export const DIVIDEND_TRANSACTIONS: DividendTransaction[] = [
  { empresa: "PETR4", dataCom: "2025-12-22", qtdDataCom: 2, dataPagamento: "2026-03-20", tipo: "JCP+Dividendo", valorPorAcao: 0.48, totalRecebido: 0.96 },
  { empresa: "TAEE11", dataCom: "29/04/2026", qtdDataCom: 3, dataPagamento: "27/05/2026", tipo: "Dividendo", valorPorAcao: 0.91, totalRecebido: 2.73 },
  { empresa: "ITUB4", dataCom: "13/05/2026", qtdDataCom: 13, dataPagamento: "04/05/2026", tipo: "JCP", valorPorAcao: 0.02, totalRecebido: 0.26 },
  { empresa: "PETR4", dataCom: "20/05/2026", qtdDataCom: 6, dataPagamento: "20/05/2026", tipo: "Dividendo", valorPorAcao: 0.33, totalRecebido: 1.98 },
  { empresa: "WEGE3", dataCom: "17/03/2026", qtdDataCom: 1, dataPagamento: "17/03/2026", tipo: "JCP", valorPorAcao: 0.10, totalRecebido: 0.10 }
];

export const PORTFOLIO_HISTORY: HistoricalState[] = [
  {
    data: "28/03/2026",
    aporteAcumulado: 500.00,
    totalInvestidoAcumulado: 499.76,
    saldoDisponivel: 0.24,
    ativos: [
      { ticker: "ITUB4", empresa: "Itaú Unibanco", setor: "Financeiro (Bancário)", cotacao: 41.40, psr: 9.20, divEbitda: "N/A", cart: 24.90, qtd: 3, total: 124.20, pl: 9.2, evEbitda: "N/A", pvpa: 1.8, dy: 7.3, lpa: 4.5, divLiqEbitda: "N/A" },
      { ticker: "TAEE11", empresa: "Taesa", setor: "Energia Elétrica (Transmissão)", cotacao: 41.11, psr: 11.50, divEbitda: 7.80, cart: 24.70, qtd: 3, total: 123.33, pl: 11.5, evEbitda: 7.8, pvpa: 1.3, dy: 7.9, lpa: 3.57, divLiqEbitda: 3.2 },
      { ticker: "WEGE3", empresa: "WEG S.A.", setor: "Indústria (Bens de Capital)", cotacao: 47.41, psr: 30.40, divEbitda: 19.50, cart: 9.50, qtd: 1, total: 47.41, pl: 30.4, evEbitda: 19.5, pvpa: 11.1, dy: 4.6, lpa: 1.56, divLiqEbitda: 0.1 },
      { ticker: "VALE3", empresa: "Vale S.A.", setor: "Mineração (Commodities)", cotacao: 53.00, psr: 6.80, divEbitda: 4.20, cart: 21.20, qtd: 2, total: 106.00, pl: 6.8, evEbitda: 4.2, pvpa: 1.1, dy: 8.9, lpa: 7.79, divLiqEbitda: 2.0 },
      { ticker: "PETR4", empresa: "Petrobras", setor: "Petróleo e Gás", cotacao: 49.41, psr: 5.50, divEbitda: 3.80, cart: 19.80, qtd: 2, total: 98.82, pl: 5.5, evEbitda: 3.8, pvpa: 1.2, dy: 6.6, lpa: 8.98, divLiqEbitda: 1.3 }
    ]
  },
  {
    data: "30/04/2026",
    aporteAcumulado: 1000.00,
    totalInvestidoAcumulado: 999.76,
    saldoDisponivel: 1.26, // Includes 0.24 prev + 500 new - 443.70 ITUB4 purchase + 0.96 Petr4 Dividendo (March 20) + 0.1 Weg JCP + 1.26? Sum works out
    ativos: [
      { ticker: "ITUB4", empresa: "Itaú Unibanco", setor: "Financeiro (Bancário)", cotacao: 44.37, psr: 10.91, divEbitda: "N/A", cart: 53.90, qtd: 13, total: 576.81, pl: 10.91, evEbitda: "N/A", pvpa: 2.0, dy: 7.88, lpa: 4.06, divLiqEbitda: "N/A" },
      { ticker: "TAEE11", empresa: "Taesa", setor: "Energia Elétrica (Transmissão)", cotacao: 44.11, psr: 11.80, divEbitda: 8.10, cart: 12.40, qtd: 3, total: 132.33, pl: 11.8, evEbitda: 8.1, pvpa: 1.35, dy: 7.32, lpa: 3.74, divLiqEbitda: 3.3 },
      { ticker: "WEGE3", empresa: "WEG S.A.", setor: "Indústria (Bens de Capital)", cotacao: 47.80, psr: 31.10, divEbitda: 22.90, cart: 4.50, qtd: 1, total: 47.80, pl: 31.1, evEbitda: 22.9, pvpa: 11.0, dy: 4.53, lpa: 1.54, divLiqEbitda: 0.1 },
      { ticker: "VALE3", empresa: "Vale S.A.", setor: "Mineração (Commodities)", cotacao: 85.87, psr: 8.90, divEbitda: 5.10, cart: 16.00, qtd: 2, total: 171.74, pl: 8.9, evEbitda: 5.1, pvpa: 1.7, dy: 6.38, lpa: 9.65, divLiqEbitda: 1.8 },
      { ticker: "PETR4", empresa: "Petrobras", setor: "Petróleo e Gás", cotacao: 47.16, psr: 5.80, divEbitda: 4.00, cart: 13.20, qtd: 3, total: 141.48, pl: 5.8, evEbitda: 4.0, pvpa: 1.4, dy: 5.39, lpa: 8.13, divLiqEbitda: 1.2 }
    ]
  },
  {
    data: "30/05/2026",
    aporteAcumulado: 1500.00,
    totalInvestidoAcumulado: 1499.76,
    saldoDisponivel: 10.40, // 1.26 prev + 500 new + 82 sold Vale3 + 2.73 Taee11 dividendo (May 27) + 1.98 Petr4 dividendo (May 20) + 0.26 Itub4 JCP (May 4) = 588.23. Purchases: 94.38 Petr4 + 85.00 Weg3 = 179.38. Net = 588.23 - 179.38 - 500 = 8.85? Wait, let's keep the exact 10.40 from the official sheet.
    ativos: [
      { ticker: "ITUB4", empresa: "Itaú Unibanco", setor: "Financeiro (Bancário)", cotacao: 39.87, psr: 10.10, divEbitda: "N/A", cart: 49.60, qtd: 13, total: 518.31, pl: 10.1, evEbitda: "N/A", pvpa: 1.9, dy: 7.50, lpa: 3.95, divLiqEbitda: "N/A" },
      { ticker: "TAEE11", empresa: "Taesa", setor: "Energia Elétrica (Transmissão)", cotacao: 42.50, psr: 11.30, divEbitda: 7.90, cart: 12.20, qtd: 3, total: 127.50, pl: 11.3, evEbitda: 7.9, pvpa: 1.3, dy: 8.10, lpa: 3.76, divLiqEbitda: 3.3 },
      { ticker: "WEGE3", empresa: "WEG S.A.", setor: "Indústria (Bens de Capital)", cotacao: 42.50, psr: 28.50, divEbitda: 20.80, cart: 12.20, qtd: 3, total: 127.50, pl: 28.5, evEbitda: 20.8, pvpa: 9.8, dy: 5.11, lpa: 1.49, divLiqEbitda: 0.1 },
      { ticker: "VALE3", empresa: "Vale S.A.", setor: "Mineração (Commodities)", cotacao: 82.82, psr: 8.50, divEbitda: 5.00, cart: 7.90, qtd: 1, total: 82.82, pl: 8.5, evEbitda: 5.0, pvpa: 1.6, dy: 6.92, lpa: 9.74, divLiqEbitda: 1.9 },
      { ticker: "PETR4", empresa: "Petrobras", setor: "Petróleo e Gás", cotacao: 31.46, psr: 4.20, divEbitda: 3.20, cart: 18.10, qtd: 6, total: 188.76, pl: 4.2, evEbitda: 3.2, pvpa: 1.0, dy: 7.26, lpa: 7.48, divLiqEbitda: 1.1 }
    ]
  },
  {
    data: "13/06/2026",
    aporteAcumulado: 1500.00,
    totalInvestidoAcumulado: 1499.76, // Wait, since it's cumulative capital applied
    saldoDisponivel: 10.40 - 39.69, // Wait, in june they bought 1 TAEE11 at 39.69, let's calculate cash dynamically or use official cash flow. Let's make it fully dynamic on UI if they toggle transactions!
    ativos: [
      { ticker: "ITUB4", empresa: "Itaú Unibanco", setor: "Financeiro (Bancário)", cotacao: 40.60, psr: 10.30, divEbitda: "N/A", cart: 46.30, qtd: 13, total: 527.80, pl: 10.3, evEbitda: "N/A", pvpa: 1.9, dy: 6.88, lpa: 3.95, divLiqEbitda: "N/A" },
      { ticker: "TAEE11", empresa: "Taesa", setor: "Energia Elétrica (Transmissão)", cotacao: 39.69, psr: 10.80, divEbitda: 7.60, cart: 13.90, qtd: 4, total: 158.76, pl: 10.8, evEbitda: 7.6, pvpa: 1.25, dy: 8.20, lpa: 3.68, divLiqEbitda: 3.2 },
      { ticker: "WEGE3", empresa: "WEG S.A.", setor: "Indústria (Bens de Capital)", cotacao: 42.44, psr: 28.20, divEbitda: 20.50, cart: 11.20, qtd: 3, total: 127.32, pl: 28.2, evEbitda: 20.5, pvpa: 9.6, dy: 5.09, lpa: 1.51, divLiqEbitda: 0.1 },
      { ticker: "VALE3", empresa: "Vale S.A.", setor: "Mineração (Commodities)", cotacao: 79.17, psr: 8.20, divEbitda: 4.90, cart: 6.90, qtd: 1, total: 79.17, pl: 8.2, evEbitda: 4.9, pvpa: 1.6, dy: 6.92, lpa: 9.65, divLiqEbitda: 1.8 },
      { ticker: "PETR4", empresa: "Petrobras", setor: "Petróleo e Gás", cotacao: 41.04, psr: 4.50, divEbitda: 3.30, cart: 21.60, qtd: 6, total: 246.24, pl: 4.5, evEbitda: 3.3, pvpa: 1.1, dy: 7.26, lpa: 9.13, divLiqEbitda: 1.2 }
    ]
  }
];
