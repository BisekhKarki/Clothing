"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaRegFile } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { useToast } from "@/components/ui/use-toast";
import { MdArrowOutward } from "react-icons/md";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useContext } from "react";
import { TransactionsContext } from "@/components/TransactionsContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Loading from "@/components/Loading";
const FormSchema = z.object({
  meroshare: z.any().refine(
    (file) => {
      return file && file.type === "text/csv";
    },
    {
      message: "Please upload a valid CSV file",
    }
  ),
});

function UploadMeroShare() {
  const { toast } = useToast();
  const { accessToken } = useStore((state) => state);
  const [show, setShow] = useState({ file1: false });
  const { setTransactions, transactions } = useContext(TransactionsContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const portId = pathname.split("/")[2];

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: any) => {
    event?.preventDefault();
    setIsLoading(true);
    const { meroshare } = data;

    const formData = new FormData();
    formData.append("file", meroshare);

    const response = await fetch(
      `${BASE_URL}/api/portfolios/upload-transactions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        body: formData,
      }
    );
    if (!response.ok) {
      const data = await response.json();
      setIsLoading(false);

      toast({
        title: "Internal Server Error",
        description: data.message,
        variant: "destructive",
      });
      return;
    }

    const responseData = await response.json();
    setTransactions(responseData.data);
    setIsLoading(false);
    router.push(`/portfolios/${portId}/import-transactions`);
  };

  return (
    <>
      {isLoading && (
        <div className="z-[9999] absolute top-0 left-0 w-full bg-[#2222224a] backdrop- backdrop-blur-sm  h-[85vh] text-2xl flex items-center justify-center">
          <Loading />
        </div>
      )}
      <Dialog>
        <DialogTrigger className="w-full h-[125px] flex  flex-col gap-2 bg-[#9b9b9b1a] items-center justify-center border-[#9b9b9b4d] border text-[#c5c5c5]">
          <AiOutlineCloudUpload className="text-lg" />
          <p className="text-[14px]">
            Browse and choose the file you want <br /> to improve.
          </p>
        </DialogTrigger>
        <DialogContent className="bg-black border border-[#807f7f] px-[15px] py-4 m-0 text-[#fff]">
          <DialogHeader>
            <DialogTitle className="text-[40px] font-semibold">
              Upload Transactions
            </DialogTitle>
            <DialogDescription>
              Import meroshare transaction history
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 grow-0 max-w-[480px]"
            >
              <FormField
                control={form.control}
                name="meroshare"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="relative">
                    <FormLabel>Mero Share</FormLabel>
                    <div className="bg-transparent text-white h-[88px] -z-10">
                      {value ? (
                        <label
                          htmlFor="meroshare"
                          className="w-full grow-0 h-full px-2 flex items-center justify-between gap-2 bg-[#9b9b9b1a] border-[#9b9b9b4d] border text-[#c5c5c5] cursor-pointer"
                        >
                          <div className="w-[200px]">
                            <h1 className="overflow-ellipsis overflow-clip ...">
                              {value.name}
                            </h1>
                          </div>
                          <div className="flex flex-col items-center">
                            <AiOutlineCloudUpload className="text-lg" />
                            <p className="text-[14px]">choose another file</p>
                          </div>
                        </label>
                      ) : (
                        <label
                          htmlFor="meroshare"
                          className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#9b9b9b1a] border-[#9b9b9b4d] border text-[#c5c5c5] cursor-pointer"
                        >
                          <AiOutlineCloudUpload className="text-lg" />
                          <p className="text-[14px]">choose a file</p>
                        </label>
                      )}
                    </div>
                    {show.file1 && (
                      <div className="absolute flex items-center justify-between px-[18px] rounded-[5px] z-50 top-[23.9px] left-0 h-[90px] text-[#717171] w-full bg-[#202020] border-2 border-[#9b9b9b4d]">
                        <div className="flex gap-2">
                          <FaRegFile className="text-[50px] text-[#9b9b9b4d] mx-auto" />
                          <div className="flex flex-col gap-1 w-[200px]">
                            <h1 className="overflow-ellipsis overflow-clip ...">
                              {value.name}
                            </h1>
                            <p>{value.size}</p>
                          </div>
                        </div>
                        <RxCross2
                          className="text-red-500 cursor-pointer"
                          size={20}
                          onClick={() =>
                            setShow((prev) => {
                              return { ...prev, file1: false };
                            })
                          }
                        />
                      </div>
                    )}
                    <FormControl>
                      <Input
                        {...fieldProps}
                        placeholder="mero share"
                        type="file"
                        id="meroshare"
                        accept=".csv"
                        className="bg-trasnparent text-white h-[88px] -z-10 hidden"
                        onChange={(event) => {
                          onChange(
                            event.target.files ? event.target.files[0] : null
                          );
                          setShow((prev) => {
                            return { ...prev, file1: true };
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-1">
                Need help?{" "}
                <a
                  className="text-blue-500 transition-all hover:underline flex items-center gap-1"
                  href="https://www.canva.com/design/DAGMP1XoSfg/oTWrHX-WctZ1d0vhrDnz9A/view"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Demo <MdArrowOutward />
                </a>
              </div>
              <div className="flex items-center gap-1">
                <a
                  className="text-blue-500 transition-all hover:underline flex items-center gap-1"
                  href="https://meroshare.cdsc.com.np/#/transaction"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Mero Share <MdArrowOutward />
                </a>
              </div>
              <div className="flex gap-2 w-full">
                <DialogClose className="w-1/2 border rounded text-lg">
                  Cancel
                </DialogClose>
                <Button
                  variant="default"
                  type="submit"
                  className="w-1/2 bg-white text-black flex justify-center items-center gap-[5px] text-sm md:text-lg hover:bg-[#f3f3f3] hover:text-black"
                >
                  <span>Import and Verify</span>
                  <MdArrowOutward />
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadMeroShare;
