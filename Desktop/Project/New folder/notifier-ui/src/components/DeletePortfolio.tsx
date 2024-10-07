import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "./ui/button";
import { BASE_URL } from "@/constant/constant";
import { Portfolio } from "../../global";
import { useToast } from "./ui/use-toast";

function DeletePortfolio({
  portfolioId,
  updatePortfolio,
  accessToken,
}: {
  portfolioId: string;
    updatePortfolio: Dispatch<SetStateAction<Portfolio[]>>;
  accessToken: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const handleDelete = async () => {
    const response = await fetch(`${BASE_URL}/api/portfolios/${portfolioId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
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

      return;
    }
    updatePortfolio((prev) =>
      prev.filter((portfolio) => portfolio._id !== portfolioId)
    );
    toast({
      title: "Success",
      description: "Portfolio Deleted Successfully",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`bg-[#4f4f4f] py-2 text-[#e3e0e0] w-full`}
        asChild
      >
        <div className="flex items-center hover:bg-[#4f4f4fe1] cursor-pointer gap-[5px] px-[14px] py-[10px]">
          <RiDeleteBin6Line size={20} /> Delete
        </div>
      </DialogTrigger>
      <DialogContent className="bg-[#0F0F0F] border-none">
        <DialogHeader>
          <DialogTitle>Delete Portfolio</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this portfolio?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2">
          <DialogClose className="w-1/2 border rounded text-lg">
            Cancel
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="w-1/2 bg-[#C50101] text- flwhiteex justify-center items-center gap-[5px] text-lg hover:bg-[#912929cd]"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeletePortfolio;
