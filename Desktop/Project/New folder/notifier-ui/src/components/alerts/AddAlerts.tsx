import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from ".././ui/button";
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
import { Input } from ".././ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert, StockData, StockDataResponse } from "../../../global";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { Textarea } from ".././ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from ".././ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from ".././ui/command";
import { useToast } from "@/components/ui/use-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { ScrollArea } from ".././ui/scroll-area";
import Pricing from "../Pricing";
import { VirtualizedCombobox } from "../VirtualCombobox";

const formSchema = z.object({
  symbol: z.string().min(1),
  type: z.enum(["LESS_THAN", "GREATER_THAN"]),
  target: z.coerce.number().nonnegative(),
  notes: z.string().min(5),
  frequency: z.enum(["DAILY", "ONE_TIME"]),
});

function AddAlerts({
  setAlerts,
  alertCount,
  setAlertCount,
  symbols,
  accessToken,
}: {
  setAlerts: Dispatch<SetStateAction<Alert[]>>;
  alertCount: number;
  setAlertCount: Dispatch<SetStateAction<number>>;
    symbols: StockDataResponse;
  accessToken: string;
}) {
  const toast = useToast();
  const {  user } = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [preventOpen, setPreventOpen] = useState(false);
  const [fieldError, setFieldError] = useState<string>("");

  const maxAlerts = user?.subscription?.permissions?.maxAlerts || 0;

  const disabled = alertCount >= maxAlerts;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      type: "LESS_THAN",
      target: 0,
      notes: "",
      frequency: "DAILY",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { symbol, type, target, notes, frequency } = values;
    const response = await fetch(`${BASE_URL}/api/alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ symbol, type, target, notes, frequency }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        const data = await response.json();
        setFieldError(data.message);
        return;
      } else if (response.status === 400) {
        const data = await response.json();
        setFieldError(data.errors[0].mes);
        return;
      } else if (response.status === 403) {
        const data = await response.json();
        setFieldError(data.message);
      } else if (response.status === 429) {
        const data = await response.json();
        setFieldError(data.message);
        return;
      } else if (response.status === 500) {
        const data = await response.json();
        setFieldError(data.message);
        return;
      }

      return;
    }
    const data = await response.json();
    setAlerts((alerts) => [...alerts, data]);
    setAlertCount((count) => count + 1);

    toast.toast({ title: "Success", description: "Alert added successfully" });
    form.reset();
    setOpen(false);
  }

  return (
    <section className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={`bg-[#353535] py-2 text-[#e3e0e0] w-full ${
            disabled
              ? "opacity-50 justify-center items-center text-center cursor-not-allowed"
              : ""
          }`}
          asChild
        >
          <div
            className="w-full text-center cursor-pointer"
            onClick={() => {
              if (disabled) {
                setPreventOpen(true);
              } else {
                setPreventOpen(false);
                setOpen(true);
              }
            }}
          >
            Add Alert
          </div>
        </DialogTrigger>
        {!preventOpen ? (
          <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]">
            <DialogHeader>
              <DialogTitle className="font-bold text-3xl">
                Add Alerts
              </DialogTitle>
              <DialogDescription className="text-sm text-[#807f7f]">
                Add alerts to get notified when the price of a product reaches a
                certain target.
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
                      <FormLabel>Alert Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="bg-black border">
                              <SelectValue placeholder="Alert Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black text-[#fff]">
                            <SelectItem value="LESS_THAN">LESS_THAN</SelectItem>
                            <SelectItem value="GREATER_THAN">
                              GREATER_THAN
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
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Target</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <p className="text-sm font-thin">
                            Alert me when it reaches
                          </p>
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
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Frequency</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="bg-black border">
                              <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black text-[#fff]">
                            <SelectItem value="ONE_TIME">ONE_TIME</SelectItem>
                            <SelectItem value="DAILY">DAILY</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-black text-[#fff]"
                          placeholder="short note for yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fieldError && <p className="text-red-500">{fieldError}</p>}
                <div className="flex gap-2">
                  <DialogClose className="w-1/2 border rounded">
                    Cancel
                  </DialogClose>
                  <Button
                    variant="default"
                    type="submit"
                    className="w-1/2"
                    disabled={disabled}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        ) : (
          <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff] max-w-[80vw] ">
            <Pricing />
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

export default AddAlerts;
