"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction, useState } from "react";
import AddTransactions from "./AddTransactions";
import { StockDataResponse, Transaction } from "../../global";
import { Input } from "./ui/input";
import EditTransactions from "./EditTrasactions";
import Loading from "./Loading";
import numberWithCommas from "@/lib/Comma";
import { PaginationDemo } from "./Pagination";
import { IoIosArrowDown } from "react-icons/io";

function Transcations({
  role,
  accessToken,
  portfolioId,
  symbols,
  search,
  setSearch,
  transactions,
  setTransactions,
  dataList,
  urlData,
  setUrlData,
  isLoading,
}: {
  role:string
  accessToken: string;
  portfolioId: string;
  symbols: StockDataResponse;
  search: string;
  setSearch?: Dispatch<SetStateAction<string>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  dataList: {
    limit: number;
    offset: number;
    total: number;
  };
  urlData: { limit: number; offset: number };
  setUrlData: Dispatch<SetStateAction<{ limit: number; offset: number }>>;
  isLoading: boolean;
}) {
  const [showTransactions, setShowTransactions] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="bg-[#9b9b9b1a] p-6 rounded-xl " id="transactions">
          <div className="flex justify-between border-b-[1px] h-[45px] items-center border-b-[#ffffff33]">
            <h1 className="md:text-[22px] text-sm font-semibold">
              Transactions
            </h1>
            {
              role!== "READ" && <AddTransactions
              portfolioId={portfolioId}
              color="white"
              setTransactions={setTransactions}
              symbols={symbols}
              accessToken={accessToken}
            />
            }
          </div>
          <div className="flex justify-end">
            <IoIosArrowDown
              onClick={() => {
                if (search) {
                  setShowTransactions(false);
                  setSearch!("");
                } else {
                  setShowTransactions((prev) => !prev);
                }
              }}
              className={` text-[#888888] block md:hidden text-end cursor-pointer transition-transform ${
                showTransactions || (search && "transform rotate-180")
              }`}
              size={30}
            />
          </div>
          <div
            className={`${
              showTransactions || search ? "block" : "hidden md:block"
            }`}
          >
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch!(e.target.value)}
              className="bg-transparent outline-none border border-[#ffffff33]"
            />
          </div>
          {isLoading ? (
            <div className="py-4 items-center justify-center w-full">
              <Loading />
            </div>
          ) : (
            <Table
              className={`${
                showTransactions || search ? "table" : "hidden md:table"
              } bg-transparent`}
            >
              <TableHeader className="border-0 w-full">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[250px] text-[#888888] border-b-0">
                    Symbol
                  </TableHead>
                  <TableHead className="text-[#888888]">Units</TableHead>
                  <TableHead className="text-[#888888]">Price</TableHead>
                  <TableHead className="text-[#888888]">Type</TableHead>
                  <TableHead className="text-[#888888]">Date</TableHead>

                  {
                    role !== "READ" && <TableHead className="text-[#888888]">Edit</TableHead>
                  }
                </TableRow>
              </TableHeader>
              <TableBody className="border-0">
                {transactions.length ? (
                  transactions.map((transaction) => (
                    <TableRow
                      className=" border-b-0 border-t-0"
                      key={transaction._id}
                    >
                      <TableCell className="font-medium">
                        {transaction.symbol}
                      </TableCell>
                      <TableCell>
                        {numberWithCommas(transaction.quantity.toString())}
                      </TableCell>
                      <TableCell>
                        {numberWithCommas(transaction.price.toString())}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.date.split("T")[0]}</TableCell>
                      <TableCell>
                       {
                        role !== "READ" &&  <EditTransactions
                        role={role}
                          transaction={transaction}
                          setTransactions={setTransactions}
                          portfolioId={portfolioId}
                          symbols={symbols}
                          setSearch={setSearch!}
                          accessToken={accessToken}
                        />
                       }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className=" border-b-0 border-t-0">
                    <TableCell className="font-medium" colSpan={7}>
                      No Transactions
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <div className={`${showTransactions ? "block" : "hidden md:block"}`}>
            <PaginationDemo
              portfolioId={portfolioId}
              dataList={dataList}
              urlData={urlData}
              setUrlData={setUrlData}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Transcations;
