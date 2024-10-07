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

import { Dispatch, SetStateAction, useState } from "react";
import { Portfolio, StockData } from "../../global";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { Textarea } from "./ui/textarea";

import { useToast } from "@/components/ui/use-toast";
import { MdArrowOutward } from "react-icons/md";
import { BiSolidPlusCircle } from "react-icons/bi";
import { DialogClose } from "@radix-ui/react-dialog";
import Pricing from "./Pricing";

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
});

function AddPortfolios({
  setPortfolios,
  portfolioCount,
  color,
  setPortfolioCount,
  accessToken,
}: {
  setPortfolios: Dispatch<SetStateAction<Portfolio[]>>;
  portfolioCount: number;
  color?: string;
    setPortfolioCount: Dispatch<SetStateAction<number>>;
  accessToken: string;
}) {
  const { toast } = useToast();
  const { user } = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [preventOpen, setPreventOpen] = useState(false);

  const maxPortfolios = user?.subscription?.permissions?.maxPortfolios || 0;

  const disabled = portfolioCount >= maxPortfolios;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, description } = values;

    const response = await fetch(`${BASE_URL}/api/portfolios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(
        description?.length ? { title, description } : { title }
      ),
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

    const data = await response.json();
    toast({
      title: "Success",
      description: "Added to watchlist",
    });
    setPortfolios((prev) => [...prev, data]);
    setPortfolioCount((count) => count + 1);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`${
          color === "white"
            ? "bg-[#ffffff] text-[#000000] hidden md:flex"
            : "bg-[#181818] text-[#e3e0e0]"
        } py-2 w-full ${
          disabled
            ? "opacity-50 justify-center items-center text-center cursor-not-allowed"
            : ""
        }`}
        asChild
      >
        <div
          className="w-full flex items-center justify-center gap-[5px] cursor-pointer"
          onClick={() => {
            if (disabled) {
              setPreventOpen(true);
            } else {
              setPreventOpen(false);
              setOpen(true);
            }
          }}
        >
          <BiSolidPlusCircle size={24} />
          <span
            className={` ${
              color === "white" ? "text-[#000000]" : "text-[#CCCCCC]"
            } font-medium`}
          >
            Add Portfolio
          </span>
        </div>
      </DialogTrigger>
      {!preventOpen ? (
        <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]">
          <DialogHeader>
            <DialogTitle className="font-bold text-3xl">
              Add a Portfolio
            </DialogTitle>
            <DialogDescription className="text-sm text-[#807f7f]">
              Add a new portfolio to your for your transactions
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Portfolio Title"
                        {...field}
                        className="bg-black border-[#807f7f] text-[#fff]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">
                      Description
                    </FormLabel>
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
              <div className="flex gap-2">
                <DialogClose className="w-1/2 border rounded text-lg">
                  Cancel
                </DialogClose>
                <Button
                  variant="default"
                  type="submit"
                  className="w-1/2 bg-white text-black flex justify-center items-center gap-[5px] text-lg hover:bg-[#f3f3f3] hover:text-black"
                  disabled={disabled}
                >
                  <span> Create Portfolio</span>
                  <MdArrowOutward />
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
  );
}

export default AddPortfolios;
