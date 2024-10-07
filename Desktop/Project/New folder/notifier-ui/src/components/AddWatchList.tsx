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
import { set, useForm } from "react-hook-form";
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
import { Alert, StockData, Watchlist } from "../../global";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useToast } from "@/components/ui/use-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { ScrollArea } from "./ui/scroll-area";
import { VirtualizedCombobox } from "./VirtualCombobox";

const formSchema = z.object({
  symbol: z.string().min(1),
});

function AddWatchlists({
  setWatchlists,
  watchlistCount,
}: {
  setWatchlists: Dispatch<SetStateAction<Watchlist[]>>;
  watchlistCount: number;
}) {
  const [symbols, setSymbols] = useState<StockData[]>([]);
  const { toast } = useToast();
  const { accessToken, user } = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [preventOpen, setPreventOpen] = useState(false);

  const maxWatchlists = user?.subscription?.permissions?.maxWatchlists || 0;

  const disabled = watchlistCount >= maxWatchlists;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { symbol } = values;

    const response = await fetch(`${BASE_URL}/api/watchlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ symbol }),
    });
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
    if (response.ok) {
      const data = await response.json();
      toast({
        title: "Success",
        description: "Added to watchlist",
      });
      //   setWatchlists((prev) => [...prev, data.data]);
      setOpen(false);
      form.reset();
    }
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

  return (
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
          Add on Watchlist
        </div>
      </DialogTrigger>
      {!preventOpen && (
        <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]">
          <DialogHeader>
            <DialogTitle className="font-bold text-3xl">
              Add a Watchlist
            </DialogTitle>
            <DialogDescription className="text-sm text-[#807f7f]">
              Add a watch list to track your favorite stocks
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
                      options={symbols.map((sym ) => {return {symbol: sym.symbol, securityName: sym.securityName}})}
                    field={field} form={form}
                    />
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <DialogTrigger className="w-1/2 border rounded">
                  Cancel
                </DialogTrigger>
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
      )}
    </Dialog>
  );
}

export default AddWatchlists;
