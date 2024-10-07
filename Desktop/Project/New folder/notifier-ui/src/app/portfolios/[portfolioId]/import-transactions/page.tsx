"use client";
import { TransactionsContext } from "@/components/TransactionsContext";
import React, { useContext, useEffect, useState } from "react";
import { StockData, structuredTransaction } from "../../../../../global";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditTransactions from "@/components/EditImportTransactions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdArrowOutward } from "react-icons/md";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useStore from "@/states/authStore";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BASE_URL } from "@/constant/constant";
import Loading from "@/components/Loading";

function Page() {
  const { transactions, setTransactions } = useContext(TransactionsContext);
  const [symbols, setSymbols] = useState<StockData[]>([]);

  const [structuredTransactions, setStructuredTransactions] = useState<
    structuredTransaction[]
  >([]);
  const pathnames = usePathname();
  const router = useRouter();
  const portfolioId = pathnames.split("/")[2];
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useStore((state) => state);

  async function handleImport() {
    setIsLoading(true);
    const res = await fetch(
      `${BASE_URL}/api/portfolios/${portfolioId}/import-transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ transactions }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 400) {
        toast({
          title: "Error",
          description: `Invalid transaction found. Please check the transactions`,
        });
        setIsLoading(false);
        return;
      }
      toast({
        title: "Error",
        description: data.message,
      });
      setIsLoading(false);
      return;
    }
    toast({
      title: "Success",
      description: "Transactions imported successfully",
    });
    setTransactions([]);
    setIsLoading(false);

    router.push(`/portfolios/${portfolioId}`);
    router.refresh();
  }

  useEffect(() => {
    if (!accessToken) return;
    async function getSymbols() {
      const response = await fetch(`${BASE_URL}/api/stocks?limit=1000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setSymbols(data.data);
    }
    getSymbols();
  }, [accessToken]);
  useEffect(() => {
    if (!accessToken) return;
    function structureTransactions() {
      const structuredTransactions: structuredTransaction[] = [];

      transactions.forEach((transaction) => {
        const existingIndex = structuredTransactions.findIndex(
          (st) => st.symbol === transaction.symbol
        );

        if (existingIndex === -1) {
          structuredTransactions.push({
            symbol: transaction.symbol,
            transactions: [transaction],
          });
        } else {
          structuredTransactions[existingIndex].transactions.push(transaction);
        }
      });

      setStructuredTransactions(structuredTransactions);
    }

    structureTransactions();
  }, [transactions, accessToken]);

  return (
    <>
      {!transactions.length ? (
        <div className="flex justify-center items-center h-[85vh] relative">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">No transactions found</h1>
            <p className="text-lg text-[#888888]">
              Please add some transactions to view here
            </p>
          </div>
        </div>
      ) : (
        <section className="md:px-[20%] px-5 min-h-[85vh] relative">
          {isLoading && (
            <div className="z-[9999] absolute top-0 left-0 w-full bg-[#2222224a]  backdrop-blur-sm  h-[85vh] flex items-center justify-center">
              <Loading />
            </div>
          )}
          <h1 className="text-[32px] text-[#fff] font-semibold mb-[28px]">
            Verify Transactions
          </h1>
          <Tabs defaultValue={transactions[0].symbol} className="w-full">
            <ScrollArea className="w-full h-[50px] flex gap-5 justify-start">
              <TabsList className="flex justify-start gap-5 w-full bg-transparent">
                {structuredTransactions.map((st) => (
                  <TabsTrigger
                    key={st.symbol}
                    value={st.symbol}
                    className="bg-[#9b9b9b1a] border border-none border-[#] text-[#fff] w-[121px] h-[55px] data-[state=active]:bg-[#9b9b9b4d] data-[state=active]:text-[#fff] data-[state=active]:border-[#fbfbfb33]"
                  >
                    {st.symbol}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {structuredTransactions.map((st, index) => (
              <TabsContent key={st.symbol} value={st.symbol} className="w-full">
                <Table className=" border-spacing-y-5 border-separate">
                  <ScrollArea className="h-[50vh]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-[100px] text-[#888888]">
                          SN.
                        </TableHead>
                        <TableHead className="text-[#888888]">Units</TableHead>
                        <TableHead className="text-[#888888]">Price</TableHead>
                        <TableHead className="text-[#888888]">Type</TableHead>
                        <TableHead className="text-[#888888]">Date</TableHead>
                        <TableHead className="text-[#888888]">Edit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="">
                      {st.transactions.map((transaction, index) => (
                        <TableRow
                          key={index}
                          className="bg-[#9b9b9b1a] border border-[#9b9b9b4d] w-full rounded-[5px] overflow-hidden"
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{transaction.quantity}</TableCell>
                          <TableCell>{transaction.price}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>
                            {transaction.date.split("T")[0]}
                          </TableCell>
                          <TableCell>
                            <EditTransactions
                              transaction={transaction}
                              symbols={symbols}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </ScrollArea>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
          <div className="flex gap-2 items-center">
            <Link
              href={`/portfolios/${portfolioId}`}
              className="px-5 py-2 border rounded text-lg"
            >
              Cancel
            </Link>
            <Button
              variant="default"
              type="submit"
              className="px-5 py-3 border bg-white text-black flex justify-center items-center gap-[5px] text-lg hover:bg-[#f3f3f3] hover:text-black"
              onClick={handleImport}

              //   disabled={disabled}
            >
              <span>Import Transactions</span>
              <MdArrowOutward />
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

export default Page;
