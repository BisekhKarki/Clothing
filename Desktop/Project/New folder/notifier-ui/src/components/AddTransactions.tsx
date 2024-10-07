import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { symbol, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Alert, StockData, StockDataResponse, Transaction } from "../../global";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

import { useToast } from "@/components/ui/use-toast";
import { MdArrowOutward } from "react-icons/md";
import { BiSolidPlusCircle } from "react-icons/bi";
import { ScrollArea } from "./ui/scroll-area";
import { PopoverClose } from "@radix-ui/react-popover";
import { Calendar } from "./ui/calendar";
import { useQueryClient } from "@tanstack/react-query";
import { IoIosArrowDown } from "react-icons/io";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { VirtualizedCombobox } from "./VirtualCombobox";
import { revalidateTag } from "next/cache";

const formSchema = z.object({
  symbol: z.string().min(1),
  price: z.coerce.number().optional(),
  quantity: z.coerce.number().min(1),
  type: z.enum([
    "BUY",
    "SELL",
    "BONUS",
    "IPO",
    "RIGHTS",
    "MERGER_DEBIT",
    "MERGER_CREDIT",
  ]),
  date: z.coerce.date(),
  commission: z.coerce.number().optional(),
  tax: z.coerce.number().optional(),
  dp: z.coerce.number().optional(),
  sebon: z.coerce.number().optional(),
});

function AddTransactions({
  setTransactions,
  portfolioId,
  color,
  symbols,
  accessToken
}: {
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  portfolioId: string;
  color?: string;
    symbols: StockDataResponse;
  accessToken: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
    },
  });

  const formType = useWatch({
    control: form.control,
    name: "type",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { symbol, price, quantity, type, date } = values;
    const dateObj = new Date(date);

    // Get the year, month, and day from the date object
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(dateObj.getDate()).padStart(2, "0");

    // Format the date as yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    const response = await fetch(
      `${BASE_URL}/api/portfolios/${portfolioId}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(
          formType !== "BONUS" &&
            formType !== "IPO" &&
            formType !== "RIGHTS" &&
            formType !== "MERGER_CREDIT" &&
            formType !== "MERGER_DEBIT"
            ? { symbol, price, quantity, type, date: formattedDate }
            : { symbol, price: 100, quantity, type, date: formattedDate }
        ),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      if (response.status === 401) {
        toast({
          title: "Unauthorized",
          description: data.message,
          variant: "destructive",
        });
      } else if (response.status === 403) {
        toast({
          title: "Forbidden",
          description: data.message,
          variant: "destructive",
        });
      } else if (response.status === 500) {
        toast({
          title: "Internal Server Error",
          description: data.message,
          variant: "destructive",
        });
      } else if (response.status === 400) {
        toast({
          title: "Bad Request",
          description: data.errors[0].msg,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
      form.reset();
      return;
    }

    const data = await response.json();
    toast({
      title: "Success",
      description: "Transaction added successfully.",
    });

    queryClient.invalidateQueries({ queryKey: ["snapshots", portfolioId] });
    queryClient.invalidateQueries({
      queryKey: ["positions", portfolioId, "active"],
    });
    queryClient.invalidateQueries({ queryKey: ["performance", portfolioId] });
    queryClient.invalidateQueries({ queryKey: ["allocations", portfolioId] });
    queryClient.invalidateQueries({ queryKey: ["positions", portfolioId, "sold"] });

    setTransactions((prev) => [data, ...prev]);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`${
          color === "white"
            ? "bg-transparent text-[#fff] w-[200px]"
            : "bg-[#181818] text-[#e3e0e0] w-full"
        } py-2 
                `}
        asChild
      >
        <div className="flex md:text-base text-sm md:items-start items-center justify-center md:gap-[4px] gap-[2px] cursor-pointer">
          <BiSolidPlusCircle className="md:text-[22px] text-[16px]" />
          <span
            className={` ${
              color === "white"
                ? "text-[#ffffff]"
                : "text-[#CCCCCC] font-medium"
            } `}
          >
            Add Transactions
          </span>
        </div>
      </DialogTrigger>

      <DialogContent
        className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]"
        tabIndex={undefined}
      >
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            Add a Transaction
          </DialogTitle>
          <DialogDescription className="text-sm text-[#807f7f]">
            Add a transation to you portfolio
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full max-h-[65vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Symbol</FormLabel>
                    <VirtualizedCombobox
                      options={symbols.data.map((sym) => {
                        return {
                          symbol: sym.symbol,
                          securityName: sym.securityName,
                        };
                      })}
                      field={field}
                      form={form}
                    />

                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} {...field}>
                        <FormControl>
                          <SelectTrigger className="bg-black border">
                            <SelectValue placeholder="Select Transaction Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black text-[#fff]">
                          <SelectItem value="BUY">BUY</SelectItem>
                          <SelectItem value="SELL">SELL</SelectItem>
                          <SelectItem value="IPO">IPO</SelectItem>
                          <SelectItem value="BONUS">BONUS</SelectItem>
                          <SelectItem value="RIGHTS">RIGHTS</SelectItem>
                          <SelectItem value="MERGER_DEBIT">
                            MERGER_DEBIT
                          </SelectItem>
                          <SelectItem value="MERGER_CREDIT">
                            MERGER_CREDIT
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`
                              w-full pl-3 bg-transparent text-left font-normal${
                                !field.value && "text-muted-foreground"
                              } `}
                          >
                            {field.value ? (
                              <span>{field.value.toDateString()}</span>
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          placeholder="20000"
                          {...field}
                          type="number"
                          className="bg-black border-[#807f7f] text-[#fff] w-[150px] h-8 ml-2"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formType !== "BONUS" &&
                formType !== "IPO" &&
                formType !== "RIGHTS" &&
                formType !== "MERGER_CREDIT" &&
                formType !== "MERGER_DEBIT" && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input
                              placeholder="20000"
                              {...field}
                              type="number"
                              className="bg-black border-[#807f7f] text-[#fff] w-[150px] h-8 ml-2"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              <div
                className="flex items-center gap-1 font-semibold hover:text-[#c9c9c9] transition-colors cursor-pointer"
                onClick={() => setShowAdvance((prev) => !prev)}
              >
                Advance{" "}
                <IoIosArrowDown
                  className={`transition-transform ${
                    showAdvance && "rotate-180"
                  }`}
                />
              </div>
              {showAdvance && (
                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="commission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type={"button"}>
                                  {" "}
                                  <Input
                                    disabled
                                    {...field}
                                    type="number"
                                    className="bg-black border-[#807f7f] text-[#fff] w-[150px] h-8 ml-2"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="bg-green-500 px-3 py-1 text-sm text-[#fff] rounded-sm">
                                    values will be calculated by system
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type={"button"}>
                                  {" "}
                                  <Input
                                    {...field}
                                    type="number"
                                    disabled
                                    className="bg-black border-[#807f7f] text-[#fff] w-[150px] h-8 ml-2"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="bg-green-500 px-3 py-1 text-sm text-[#fff] rounded-sm">
                                    values will be calculated by system
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DP</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type={"button"}>
                                  {" "}
                                  <Input
                                    {...field}
                                    type="number"
                                    disabled
                                    className="bg-black border-[#807f7f] text-[#fff] w-[150px] h-8 ml-2"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="bg-green-500 px-3 py-1 text-sm text-[#fff] rounded-sm">
                                    values will be calculated by system
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sebon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sebon</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type={"button"}>
                                  {" "}
                                  <Input
                                    {...field}
                                    type="number"
                                    disabled
                                    className="bg-black border-[#807f7f] text-[#fff] w-[150px] h-8 ml-2"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="bg-green-500 px-3 py-1 text-sm text-[#fff] rounded-sm">
                                    values will be calculated by system
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <DialogTrigger className="w-1/2 border rounded text-lg">
                  Cancel
                </DialogTrigger>
                <Button
                  variant="default"
                  type="submit"
                  className="w-1/2 bg-white text-black flex justify-center items-center gap-[5px] text-lg hover:bg-[#f3f3f3] hover:text-black"
                  //   disabled={disabled}
                >
                  <span> Create Transaction</span>
                  <MdArrowOutward />
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AddTransactions;
