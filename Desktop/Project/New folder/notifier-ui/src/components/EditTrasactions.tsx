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
import { z } from "zod";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StockDataResponse, Transaction } from "../../global";
import { BASE_URL } from "@/constant/constant";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";

import { AiOutlineDelete } from "react-icons/ai";

import { useToast } from "@/components/ui/use-toast";
import { MdArrowOutward } from "react-icons/md";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar } from "./ui/calendar";
import { ImPencil } from "react-icons/im";
import { useQueryClient } from "@tanstack/react-query";
import { IoIosArrowDown } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { VirtualizedCombobox } from "./VirtualCombobox";

const formSchema = z.object({
  symbol: z.string().min(1),
  price: z.coerce.number().min(1),
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

function EditTransactions({
  role,
  transaction,
  setTransactions,
  portfolioId,
  symbols,
  setSearch,
  accessToken,
}: {
  role:string
  transaction: Transaction;
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  portfolioId: string;
  symbols: StockDataResponse;
  setSearch: Dispatch<SetStateAction<string>>;
  accessToken: string;
}) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [showAdvance, setShowAdvance] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
    },
  });
  const formType = useWatch({ control: form.control, name: "type" });
  useEffect(() => {
    form.setValue("symbol", transaction.symbol);
    form.setValue("price", transaction.price);
    form.setValue("quantity", transaction.quantity);
    form.setValue("type", transaction.type);
    form.setValue("date", new Date(transaction.date.split("T")[0]));
    form.setValue("commission", transaction.fees.commission);
    form.setValue("tax", transaction.fees.tax);
    form.setValue("dp", transaction.fees.dp);
    form.setValue("sebon", transaction.fees.sebon);
  }, [transaction, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //date without time
    const { symbol, price, quantity, type, date } = values;
    const dateObj = new Date(date);

    // Get the year, month, and day from the date object
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(dateObj.getDate()).padStart(2, "0");

    // Format the date as yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    const response = await fetch(
      `${BASE_URL}/api/portfolios/${portfolioId}/transactions/${transaction._id}`,
      {
        method: "PUT",
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
            : formType === "IPO"
            ? {
                symbol,
                price: transaction.price,
                quantity,
                type,
                date: formattedDate,
              }
            : { symbol, price: 100, quantity, type, date: formattedDate }
        ),
      }
    );
    if (!response.ok) {
      if (response.status === 401) {
        setFieldError("Unauthorized");
        return;
      } else if (response.status === 400) {
        const data = await response.json();
        setFieldError(data.errors[0].msg);
        return;
      } else if (response.status === 429) {
        setFieldError("Too many requests");
        return;
      }

      return;
    }
    const data = await response.json();

    queryClient.invalidateQueries({ queryKey: ["snapshots", portfolioId] });
    queryClient.invalidateQueries({
      queryKey: ["positions", portfolioId, "active"],
    });
    queryClient.invalidateQueries({ queryKey: ["performance", portfolioId] });
    queryClient.invalidateQueries({ queryKey: ["allocations", portfolioId] });

    queryClient.invalidateQueries({
      queryKey: ["positions", portfolioId, "sold"],
    });
    setTransactions((prev) =>
      prev.map((t) => (t._id === transaction._id ? data : t))
    );

    toast({
      title: "Success",
      description: "Alert edited successfully !!",
    });
    setOpen(false);
  }

  async function deleteTransaction() {
    const response = await fetch(
      `${BASE_URL}/api/portfolios/${portfolioId}/transactions/${transaction._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      if (response.status === 401) {
        setFieldError("Unauthorized");
        return;
      } else if (response.status === 400) {
        const data = await response.json();
        setFieldError(data.errors[0].msg);
        return;
      } else if (response.status === 429) {
        setFieldError("Too many requests");
        return;
      }
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["snapshots", portfolioId] });
    queryClient.invalidateQueries({
      queryKey: ["positions", portfolioId, "active"],
    });
    queryClient.invalidateQueries({ queryKey: ["performance", portfolioId] });
    queryClient.invalidateQueries({ queryKey: ["allocations", portfolioId] });
    queryClient.invalidateQueries({
      queryKey: ["positions", portfolioId, "sold"],
    });

    setTransactions((prev) => {
      if (prev.length === 1) {
        setSearch("");
      }
      return prev.filter((t) => {
        return t._id !== transaction._id;
      });
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="">
        <ImPencil className="inline-block" />
      </DialogTrigger>

      <DialogContent
        className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]"
        tabIndex={undefined}
      >
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            Update Transaction
          </DialogTitle>
          <DialogDescription className="text-sm text-[#807f7f]">
            Update a transation for your portfolio
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full max-h-[65vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" w-full space-y-6"
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
                      isDisabled={true}
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
                          <SelectItem value="BONUS">BONUS</SelectItem>
                          <SelectItem value="IPO">IPO</SelectItem>
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
                        <FormLabel>Purchased Price</FormLabel>
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
                                    onSubmit={(e) => e.preventDefault()}
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
              {fieldError && <p className="text-red-500">{fieldError}</p>}
              <div className="flex items-center flex-col gap-4">
                <Button
                  variant="default"
                  type="submit"
                  className="w-full cursor-pointer bg-white text-black flex justify-center items-center gap-[5px] text-lg hover:bg-[#f3f3f3] hover:text-black"
                  //   disabled={disabled}
                >
                  <span> Edit Transaction</span>
                  <MdArrowOutward />
                </Button>
               {
                role === "ADMIN" &&  <div
                className="w-1/2 flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors justify-center text-lg"
                onClick={deleteTransaction}
              >
                <AiOutlineDelete />
                <span>Delete</span>
              </div>
               }
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default EditTransactions;
