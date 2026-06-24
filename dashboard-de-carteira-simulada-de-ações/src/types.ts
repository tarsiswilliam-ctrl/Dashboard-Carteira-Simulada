/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StockAsset {
  ticker: string;
  empresa: string;
  setor: string;
  cotacao: number;
  psr: number;
  divEbitda: number | "N/A"; // compatible with string or number
  cart: number; // percentage in portfolio according to multiples sheet
  qtd: number;
  total: number;
  
  // Multiples from the main sheet
  pl?: number;
  evEbitda?: number | "N/A";
  pvpa?: number;
  dy?: number;
  lpa?: number;
  divLiqEbitda?: number | "N/A";
}

export interface BuyTransaction {
  data: string;
  ticker: string;
  qtd: number; // positive for buy, negative for sell
  preco: number;
  total: number;
}

export interface DividendTransaction {
  empresa: string;
  dataCom: string;
  qtdDataCom: number;
  dataPagamento: string;
  tipo: string;
  valorPorAcao: number;
  totalRecebido: number;
}

export interface SectorBenchmark {
  setor: string;
  pl: string;
  pvpa?: string;
  evEbitda?: string;
  dy: string;
}

export interface HistoricalState {
  data: string;
  aporteAcumulado: number;
  totalInvestidoAcumulado: number;
  saldoDisponivel: number;
  ativos: StockAsset[];
}
