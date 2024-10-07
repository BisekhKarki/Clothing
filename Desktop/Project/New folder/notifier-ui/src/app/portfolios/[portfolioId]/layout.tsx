import { TransactionProvider } from "@/components/TransactionsContext";

import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return <TransactionProvider>{children}</TransactionProvider>;
}

export default layout;
