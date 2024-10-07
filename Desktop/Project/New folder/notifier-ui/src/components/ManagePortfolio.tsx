"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import EditPortfolio from "./EditPortfolio";
import { Portfolio } from "../../global";
import DeletePortfolio from "./DeletePortfolio";
import useStore from "@/states/authStore";
import { useToast } from "./ui/use-toast";

function ManagePortfolio({
  role,
  portfolioId,
  portfolioDetail,
  updatePortfolio,
  setPortfolioCount,
  accessToken,
}: {
  role:string;
  portfolioId: string;
  portfolioDetail: Portfolio;
  updatePortfolio: Dispatch<SetStateAction<Portfolio[]>>;
    setPortfolioCount: Dispatch<SetStateAction<number>>;
  accessToken: string;
}) {

  const { user } = useStore((state)=>state)

    const userRole = role
    const userId = user._id
    const inviterId = portfolioDetail.user
    
    const adminUser = () => {
      return (
        <>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
            <EditPortfolio
              portfolioId={portfolioId}
              portfolioDetail={portfolioDetail}
              updatePortfolio={updatePortfolio}
              accessToken={accessToken}
            />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
            <DeletePortfolio
              portfolioId={portfolioId}
              updatePortfolio={updatePortfolio}
              accessToken={accessToken}
            />
          </DropdownMenuItem>
        </>
      );
    };
  
    const writeMode = () => {
      return (
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <EditPortfolio
            portfolioId={portfolioId}
            portfolioDetail={portfolioDetail}
            updatePortfolio={updatePortfolio}
            accessToken={accessToken}
          />
        </DropdownMenuItem>
      );
    };

  
    const onRole = () => {
      switch (userRole) {
        case "ADMIN":
          return adminUser();
        case "WRITE":
          return writeMode();
        default:
          return null;
      }
    };


  return (
   userRole !== "READ" ?  <DropdownMenu>
     
   <DropdownMenuTrigger asChild>
  <div className="cursor-pointer">
    <BsThreeDotsVertical size={24} />
  </div>
</DropdownMenuTrigger>
  <DropdownMenuContent
    className="w-[220px] bg-[#4F4F4F] border-none text-[#cfcfcf] p-0"
    align="end"
    forceMount
  >
   {

    userId === inviterId ? 
     <>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
      
      <EditPortfolio
        portfolioId={portfolioId}
        portfolioDetail={portfolioDetail}
        updatePortfolio={updatePortfolio}
        accessToken={accessToken}
      />
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
      <DeletePortfolio
        portfolioId={portfolioId}
        updatePortfolio={updatePortfolio}
        accessToken={accessToken}
      />
    </DropdownMenuItem>
     </>
     : onRole()
   }
  </DropdownMenuContent>
</DropdownMenu> : ""
  );
}

export default ManagePortfolio;
