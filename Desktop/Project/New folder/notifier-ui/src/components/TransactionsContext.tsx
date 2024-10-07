"use client";
import { createContext, useState } from "react";

import { Transaction, structTransaction } from "../../global";

type TransactionsContextType = {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
};

export const TransactionsContext = createContext<TransactionsContextType>({
  transactions: [],
  setTransactions: () => {},
});

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<structTransaction[]>([]);

  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}
