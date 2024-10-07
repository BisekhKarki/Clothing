"use client"
import React, { useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { cookies } from "next/headers";
import { BASE_URL } from '@/constant/constant';
import { useToast } from "@/components/ui/use-toast";
import SharePortfolios from './SharePortfolio';
import EditMembersPortfolio from './EditMembersPortfolio';
import useStore from '@/states/authStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getAllMembers } from '@/services/api/portfolios';



const ManageMembers = ({ accessToken,portfolioId,portfolio }: { accessToken: string,portfolioId:string, portfolio:any; }) => {
  
  const { toast } = useToast();
  const [data, setData] = useState([]); // Explicitly type the state

  const [errorMessage,setMessage] = useState<{ message?: string } | null>(null)

  const fetchData = async () => {
    try {
      const response = await  fetch(`${BASE_URL}/api/portfolios/${portfolioId}/members`,{
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      setMessage(result)
      setData(result.data);
      if (!response.ok) {
        const data = await response.json();
        console.log(data)
        setData(data)
        if (response.status === 400) {
          toast({
            title: "Too may requests",
            description: data.errors[0].msg,
            variant: "destructive",
          });
        }  else if (response.status === 401) {
          toast({
            title: "Unauthorized request",
            description: data.message,
            variant: "destructive",
          });
        }else if (response.status === 403) {
          toast({
            title: "Forbidden",
            description: data.message,
            variant: "destructive",
          });
        } else if (response.status === 404) {
          toast({
            title: "portfolio not found",
            description: data.message,
            variant: "destructive",
          });
        } else if (response.status === 429) {
          toast({
            title: "Too may requests",
            description: data.message,
            variant: "destructive",
          });
        } else if(response.status === 500) {
          toast({
            title: "Internal server error",
            description: data.message,
            variant: "destructive",
          });
        }
    }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken,portfolio,portfolioId]);

  const refreshData = ()=>{
    fetchData()
  }

  


  const deleteMember = async (userId:string)=>{
    try {
      const response = await fetch(`${BASE_URL}/api/portfolios/${portfolioId}/members/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "User removed successfully",
        });
        setData(prevData => prevData.filter((member:any) => (member._id !== userId)));
      }
      if (!response.ok) {
        const data = await response.json();
        
        if (response.status === 400) {
          toast({
            title: "Too may requests",
            description: data.errors[0].msg,
            variant: "destructive",
          });
        }  else if (response.status === 401) {
          toast({
            title: "Unauthorized request",
            description: data.message,
            variant: "destructive",
          });
        }else if (response.status === 403) {
          toast({
            title: "Forbidden",
            description: data.message,
            variant: "destructive",
          });
        } else if (response.status === 404) {
          toast({
            title: "portfolio/member not found",
            description: data.message,
            variant: "destructive",
          });
        } else if (response.status === 429) {
          toast({
            title: "Too may requests",
            description: data.message,
            variant: "destructive",
          });
        } else if(response.status === 500) {
          toast({
            title: "Internal server error",
            description: data.message,
            variant: "destructive",
          });
        }
    }
   } catch (error) {
      console.error("Error fetching members:", error);
    }
  }

  
  const updateRole = async (userId:string,newRole:string)=>{
    const updatedRole = newRole.toUpperCase();

    const response = await fetch(`${BASE_URL}/api/portfolios/${portfolioId}/members/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(
       {
        role:updatedRole
       }
      ),
    });
    if(response.ok){
      setData((prevData:any) => prevData.map((member:any) => 
        member._id === userId ? { ...member, role: updatedRole } : member
      ));
        toast({
            title: "Success",
            description: "Role of user changed successfully",
          });
    }
    
    if (!response.ok) {
      const data = await response.json();
       if(response.status === 400){
        toast({
            title: "Bad Request",
            description: data.errors[0].msg,
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
      return;
    }
  }


  if (errorMessage && !data) {
    return (
        <h1 className="text-center mb-32 mt-20 text-lg md:text-xl lg:text-2xl">
            {errorMessage.message}
        </h1>
    );
}

  
  return (
    
    <div className="overflow-x-auto min-h-[86vh] md:py-[45px] md:px-[110px] py-5 px-5"> 
    <h1 className="text-[40px] font-semibold">Manage Members</h1>
    <Table className="sm:w-full w-full "> 
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-white">User</TableHead>
          <TableHead className="text-white">User Email</TableHead>
          <TableHead className="text-white">User Role</TableHead>
          <TableCell className="text-right">Options</TableCell>
        </TableRow>
      </TableHeader>
      {!data ? (
        <TableBody>
          <TableRow>
            <TableCell colSpan={11} className="text-center text-xl w-full">
              No users Available
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        data.map((d:any) => (
          <TableBody key={d._id}>
            <TableRow>
              <TableCell className="font-medium">{d.user.username}</TableCell>
              <TableCell>{d.user.email}</TableCell>
              <TableCell>
                <Select onValueChange={(value) => updateRole(d._id, value)}>
                  <SelectTrigger className="w-full text-black">
                    <SelectValue placeholder={d.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a Role</SelectLabel>
                      <SelectItem value="READ">Read</SelectItem>
                      <SelectItem value="WRITE">Write</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
  
              <TableCell className="flex flex-row gap-5 justify-end text-right">
                <AlertDialog>
                  <AlertDialogTrigger className="border bg-white text-black rounded px-5 py-2">
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-black">
                        Do you want to delete this user?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will delete the user and also the access of user to this portfolio.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-black">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMember(d._id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          </TableBody>
        ))
      )}
    </Table>
    <SharePortfolios
          portfolio={portfolio}
          color={"white"}
          portfolioId={portfolioId}
          accessToken={accessToken}
          text="Add Member"
          onUserAdded={refreshData}
        />
     
  </div>
  

  
  )
}

export default ManageMembers
