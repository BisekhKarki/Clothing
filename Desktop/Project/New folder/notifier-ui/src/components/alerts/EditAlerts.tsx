import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert, StockData, StockDataResponse } from "../../../global";
import { BASE_URL } from "@/constant/constant";

import { Textarea } from ".././ui/textarea";
import { ImPencil } from "react-icons/im";

import { useToast } from "@/components/ui/use-toast";

import { VirtualizedCombobox } from "../VirtualCombobox";

const formSchema = z.object({
  symbol: z.string().min(1),
  type: z.enum(["LESS_THAN", "GREATER_THAN"]),
  target: z.coerce.number().nonnegative(),
  notes: z.string().min(1),
  frequency: z.enum(["DAILY", "ONE_TIME"]),
});

function EditAlerts({
  alert,
  setAlerts,
  symbols,
  accessToken
}: {
  alert: Alert;
  setAlerts: Dispatch<SetStateAction<Alert[]>>;
    symbols: StockDataResponse;
  accessToken: string;
}) {

  const [open, setOpen] = useState(false);
  const [fieldError, setFieldError] = useState<string>("");
  const toast = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: alert.stock.symbol,
      type: alert.type,
      target: alert.target,
      frequency: alert.frequency,
      notes: alert.notes,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { symbol, type, target, notes, frequency } = values;
    const response = await fetch(`${BASE_URL}/api/alerts/${alert._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ symbol, type, target, notes, frequency }),
    });
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
    setAlerts((alerts) => {
      return alerts.map((alert) => {
        if (alert._id === data._id) {
          return data;
        }
        return alert;
      });
    });
    toast.toast({
      title: "Success",
      description: "Alert edited successfully !!",
    });
    setOpen(false);
  }
  useEffect(() => {
    if (!accessToken) return;

    // form.setValue("symbol", alert.symbol);
    form.setValue("type", alert.type);
    form.setValue("target", alert.target);
    form.setValue("notes", alert.notes);
    form.setValue("frequency", alert.frequency);
  }, [accessToken, alert, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="">
        <ImPencil className="inline-block" />
      </DialogTrigger>
      <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl"> Edit Alerts</DialogTitle>
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
                    <Select onValueChange={field.onChange} {...field}>
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
                    <Select onValueChange={field.onChange} {...field}>
                      <FormControl>
                        <SelectTrigger className="bg-black border">
                          <SelectValue placeholder="Alert Frequency" />
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
              <DialogClose className="w-1/2 border rounded">Cancel</DialogClose>
              <Button variant="default" type="submit" className="w-1/2">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAlerts;
