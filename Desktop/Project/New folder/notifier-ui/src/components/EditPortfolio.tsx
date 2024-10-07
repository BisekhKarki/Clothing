import {
  Dialog,
  DialogClose,
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

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Portfolio, StockData } from "../../global";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { Textarea } from "./ui/textarea";

import { useToast } from "@/components/ui/use-toast";
import { MdArrowOutward, MdOutlineEdit } from "react-icons/md";

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
});

function EditPortfolio({
  portfolioId,
  portfolioDetail,
  updatePortfolio,
  accessToken,
}: {
  portfolioId: string;
  portfolioDetail: Portfolio;
    updatePortfolio: Dispatch<SetStateAction<Portfolio[]>>;
  accessToken: string;
}) {
  const { toast } = useToast();
  const { user } = useStore((state) => state);
  const [open, setOpen] = useState(false);

  const maxPortfolios = user?.subscription?.permissions?.maxPortfolios || 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: portfolioDetail.title,
      description: portfolioDetail.description,
    },
  });

  // useEffect(() => {
  //   form.setValue("title", portfolioDetail.title);
  //   form.setValue("description", portfolioDetail.description);
  // }, [portfolioDetail]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, description } = values;

    const response = await fetch(`${BASE_URL}/api/portfolios/${portfolioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(description ? { title, description }: {title}),
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
      description: "Edited Portfolio Successfully",
    });
    updatePortfolio((prev) => {
      const updated = prev.map((portfolio) => {
        if (portfolio._id === portfolioId) {
          return data;
        }
        return portfolio;
      });
      return updated;
    });

    setOpen(false);
 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`bg-[#4f4f4f] py-2 text-[#e3e0e0] w-full`}
        asChild
      >
        <div className="flex items-center hover:bg-[#4f4f4fe1] cursor-pointer gap-[5px] px-[14px] py-[10px]">
          <MdOutlineEdit size={20} /> Edit
        </div>
      </DialogTrigger>

      <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            Edit Portfolio
          </DialogTitle>
          <DialogDescription className="text-sm text-[#807f7f]">
            Edit your portfolio
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
                      onKeyDown={(e) => e.stopPropagation()}
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
                      onKeyDown={(e) => e.stopPropagation()}
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
              >
                <span> Edit Portfolio</span>
                <MdArrowOutward />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPortfolio;
