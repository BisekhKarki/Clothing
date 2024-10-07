"use client"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
   
import { Dispatch, SetStateAction, useState } from "react";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { useToast } from "@/components/ui/use-toast";
import { MdArrowOutward } from "react-icons/md";
import { DialogClose } from "@radix-ui/react-dialog";
import Pricing from "./Pricing";
import { MdArrowDropDown } from "react-icons/md";

const formSchema = z.object({
  email: z.string().optional(),
  role:z.string().optional()
});

function EditMembersPortfolio({
  color,
  portfolioId,
  accessToken,
  email,
  role,
  id,
  onMemberUpdated
}: {
 
  color?: string;
    portfolioId:string;
  accessToken: string;
  email:string;
  role:string;
  id:string
  onMemberUpdated: (updatedMember: any) => void;
}) {
  const { toast } = useToast();
  const { user } = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [preventOpen, setPreventOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role:""
    },
  });

  const [userRole, setUserRole] = useState(role)
  const userId = id;
 

 const updateUser = async ()=>{
    const roleData = userRole.toUpperCase();
    const response = await fetch(`${BASE_URL}/api/portfolios/${portfolioId}/members/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(
       {
        role:roleData
       }
      ),
    });
    if(response.ok){
        const updatedMember = await response.json();
        onMemberUpdated(updatedMember);
        setOpen(false);
        form.reset();
        toast({
            title: "Success",
            description: "Role of user edited successfully",
          });
    }
    
    if (!response.ok) {
      const data = await response.json();
      if(response.status === 400){
        toast({
            title: "Bad Request",
            description: data.error[0].msg,
            variant: "destructive",
          });
      }
      else if (response.status === 401) {
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
      }
      else if( response.status === 404){
        toast({
            title: "Portfolio/Member Not Found",
            description: data.message,
            variant: "destructive",
          });
      } else if (response.status === 429) {
        toast({
          title: "Too many requests.",
          description: data.message,
          variant: "destructive",
        });
      } else if (response.status === 500) {
        toast({
          title: "Internal server error",
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
      setUserRole("Select a role")
      return;
    }

    
  }

 
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`${
          color === "white"
            ? "bg-[#ffffff] text-[#000000] hidden md:flex"
            : "bg-[#181818] text-[#e3e0e0]"
        } `}
        asChild
      >
        <div
          className="w-92 flex items-center justify-center gap-[5px] cursor-pointer px-4 py-2"
        >
          <span
            className={` ${
              color === "white" ? "text-[#000000]" : "text-[#CCCCCC]"
            } font-medium`}
          >
           Edit Member
          </span>
        </div>
      </DialogTrigger>
      {!preventOpen ? (
        <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff]">
          <DialogHeader>
            <DialogTitle className="font-bold text-3xl">
              Edit Member
            </DialogTitle>
            <DialogDescription className="text-sm text-[#807f7f]">
            Edit the role of the user
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">User email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="User email"
                        {...field}
                        value={email}
                        className="bg-black border-[#807f7f] text-[#fff]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <label>{userRole}</label>
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="ml-5"><MdArrowDropDown /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 left-4" defaultValue={userRole}>
                <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={userRole} onValueChange={setUserRole}>
                <DropdownMenuRadioItem value="Read" >Read</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Write">Write</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
            </DropdownMenu>
              <div className="flex gap-2">
                <DialogClose className="w-1/2 border rounded text-lg">
                  Cancel
                </DialogClose>
                <Button
                  variant="default"
                  onClick={()=>updateUser()}
                  className="w-1/2 bg-white text-black flex justify-center items-center gap-[5px] text-lg hover:bg-[#f3f3f3] hover:text-black"
                
                >
                  <span > Save</span>
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

export default EditMembersPortfolio;
