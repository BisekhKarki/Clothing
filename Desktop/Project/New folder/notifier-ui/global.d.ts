import { symbol } from "zod";

export interface User {
  _id: string;
  username: string;
  email: string;
  googleId: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Alert {
  stock: {
    symbol: string;
    title: string;
    open: number;
    high: number;
    low: number;
    close: number;
    last: number;
    prevClose: number;
  };
  type: "LESS_THAN" | "GREATER_THAN"; // Assuming these are the only two types
  target: number;
  notes: string;
  status: "OPEN" | "TRIGGERED" | "ARCHIVED"; // Assuming these are the only two statuses
  frequency: "DAILY" | "ONE_TIME"; // Assuming these are the only three frequencies
  _id: string;
  triggers: {
    price: number;
    method: "EMAIL" | "SMS" | "APP"; // Assuming these are the only three methods
    createdAt: string; // Date string in ISO format
  }[];
}

export interface AlertResponse {
  data: Alert[];
  total: number;
  count: number;
  limit: number;
  offset: number;
}

export interface StockData {
  symbol: string;
  title: string;
  securityName: string;
  open: number;
  high: number;
  low: number;
  close: number;
  last: number;
  prevClose: number;
}

export interface StockDataResponse {
  data: StockData[];
  total: number;
  count: number;
  limit: number;
  offset: number;
}

export interface Watchlist {
  _id: string;
  user: string;
  stock: {
    _id: string;
    symbol: string;
    title: string;
    open: number;
    high: number;
    low: number;
    close: number;
    last: number;
    prevClose: number;
  };
  watchlistedPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistResponse {
  data: Watchlists[];
  total: number;
  count: number;
  limit: number;
  offset: number;
  createdAt: string;
}

export interface LiveMarket {
  _id: string;
  symbol: string;
  title: string;
  open: number;
  high: number;
  low: number;
  close: number;
  last: number;
  prevClose: number;
  createdAt: string;
  updatedAt: string;
}

export interface LiveMarketResponse {
  data: LiveMarket[];
  total: number;
  count: number;
  limit: number;
  offset: number;
  createdAt: string;
}

export interface Portfolio {
  _id: string;
  title: string;
  description: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  value: number;
  realizedGain: number;
  soldCapital: number;
  investedCapital: number;
  dailyGain: number;
  dailyGainPercentage: number;
  status: "ACTIVE" | "INACTIVE";
  __v: number;
}

export interface PortfolioResponse {
  data: Portfolio[];
  total: number;
  count: number;
  limit: number;
  offset: number;
}

export interface Transaction {
  _id?: string;
  portfolio?: string;
  stock?: string;
  symbol: string;
  type: "BUY" | "SELL" | "BONUS" | "IPO" | "MERGER_DEBIT" | "MERGER_CREDIT";
  date: string;
  price: number;
  quantity: number;
  fees: {
    commission: number;
    dp: number;
    sebon: number;
    tax: number;
  };

  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  count: number;
  limit: number;
  offset: number;
}

export interface structTransaction {
  symbol: string;
  quantity: number;
  price: number;
  type: "BUY" | "SELL" | "BONUS" | "IPO" | "MERGER_DEBIT" | "MERGER_CREDIT";
  date: string;
  fees: {
    commission: number;
    dp: number;
    sebon: number;
    tax: number;
  };
}
export interface structuredTransaction {
  symbol: string;
  transactions: structTransaction[];
}

export interface Position {
  _id: string;
  portfolio: string;
  stock: StockData;
  symbol: string;
  quantity: number;
  costOfCapital: number;
  investedCapital: number;
  wacc: number;
  soldQuantity: number;
  soldCapital: number;
  realizedGain: number;
  noOfTransactions: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceType {
  investedCapital: number;
  realizedGain: number;
  value: number;
  dailyGain: number;
  dailyGainPercentage: number;
  unrealizedGain: number;
  unrealizedGainPercentage: number;
}

export interface Setors {
  stock: string;
  symbol: string;
  sector: string;
  quantity: number;
  value: number;
}
export interface Dashboard {
  sectors: Sectors[];
  positions: Position[];
  performance: Performance[];
}
