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
import { useForm } from "react-hook-form";
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
import { useContext, useEffect, useState } from "react";
import { StockData, structTransaction } from "../../global";
import useStore from "@/states/authStore";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { MdArrowOutward } from "react-icons/md";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar } from "./ui/calendar";
import { ImPencil } from "react-icons/im";
import { TransactionsContext } from "./TransactionsContext";
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
    "MERGER_DEBIT",
    "MERGER_CREDIT",
  ]),
  date: z.coerce.date(),
  commission: z.coerce.number().min(0),
  tax: z.coerce.number().min(0),
  dp: z.coerce.number().min(0),
  sebon: z.coerce.number().min(0),
});

function EditImportTransactions({
  transaction,
  symbols,
}: {
  transaction: structTransaction;
  symbols: StockData[];
}) {
  const { accessToken } = useStore((state) => state);
  const { setTransactions, transactions } = useContext(TransactionsContext);
  const [open, setOpen] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      type: "BUY",
    },
  });
  useEffect(() => {
    if (!accessToken) return;

    form.setValue("symbol", transaction.symbol);
    form.setValue("price", transaction.price);
    form.setValue("quantity", transaction.quantity);
    form.setValue("type", transaction.type);
    form.setValue("date", new Date(transaction.date));
    form.setValue("commission", transaction.fees.commission);
    form.setValue("tax", transaction.fees.tax);
    form.setValue("dp", transaction.fees.dp);
    form.setValue("sebon", transaction.fees.sebon);
  }, [accessToken, transaction, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { symbol, price, quantity, type, date } = values;
    const formattedDate = date.toISOString().split("T")[0] + "T00:00:00.000Z";

    const updatedTransaction: structTransaction[] = transactions.map((t) => {
      if (
        t.date == transaction.date &&
        t.symbol == transaction.symbol &&
        t.price == transaction.price &&
        t.quantity == transaction.quantity &&
        t.type == transaction.type
      ) {
        return {
          ...t,
          symbol,
          price,
          quantity,
          type,
          date: formattedDate,
          fees: {
            commission: values.commission,
            dp: values.dp,
            sebon: values.sebon,
            tax: values.tax,
          },
        };
      }
      return t;
    });
    setTransactions(updatedTransaction);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="">
        <ImPencil className="inline-block" />
      </DialogTrigger>

      <DialogContent
        className="bg-black transition-all border max-h-[85vh] border-[#807f7f] px-3 py-2 m-0 text-[#fff]"
        tabIndex={undefined}
      >
        <ScrollArea className="max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-bold text-3xl">
              Edit Transaction
            </DialogTitle>
            <DialogDescription className="text-sm text-[#807f7f]">
              Edit a transation
            </DialogDescription>
          </DialogHeader>
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
                      options={symbols.map((sym) => {
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
                  <span> Edit Transaction</span>
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

export default EditImportTransactions;
