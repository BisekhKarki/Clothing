
import { cookies } from "next/headers";
import { getStocks } from "@/services/api/stocks";
import Dashboards from "@/components/portfolios/Dashboards";
import { Metadata, ResolvingMetadata } from "next";
import { getPortfolioById } from "@/services/api/portfolios";
import UploadTms from "@/components/transactions/UploadTms";
import UploadMeroShare from "@/components/transactions/UploadMeroShare";
import Transcations from "@/components/Transcations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import SharePortfolio from "@/components/SharePortfolio";
import useStore from "@/states/authStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VscKebabVertical } from "react-icons/vsc";



type Props = {
  params: { portfolioId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value || "";
  const id = params.portfolioId;

  // fetch data
  const portfolio = await getPortfolioById(accessToken, id);

  return {
    title: portfolio.title + ` | Portfolios | Dharke`,
  };
}

async function page({ params }: { params: { portfolioId: string } }) {
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value || "";

  const portfolio = await getPortfolioById(accessToken, params.portfolioId);


  const symbols = await getStocks(accessToken);

  let show = false;

  const showCard = ()=>{
    show = true;
  }




  return (
    <section className="min-h-[86vh] md:py-[45px] sm:px-[3%] md:px-[8%] lg:px-[12%]  py-5 px-1 relative">
      <div className="flex flex-col w-full justify-between mb-12 gap-8">
        <div className="flex justify-between items-center">
          <h1 className="md:text-[26px] text-xl  font-semibold">
            {portfolio.title}
          </h1>
         
          <Popover>
            <PopoverTrigger>
              {" "}
              <VscKebabVertical />
            </PopoverTrigger>
            <PopoverContent className="bg-[#5b5b5b] w-[200px] m-0 p-0  overflow-hidden border-none">
            <UploadTms  />

            <Link href={"/portfolios/"+params.portfolioId+"/members"} 
            className="text-[#0b0b0b] bg-white hover:bg-black hover:text-[#fff] cursor pointer h-10 px-2 w-full flex items-center justify-center cursor-pointer"  >Members</Link>
            </PopoverContent>
            </Popover>
        
        </div>

        <Dashboards
        portfolio={portfolio}
          token={accessToken}
          portfolioId={params.portfolioId}
          symbols={symbols}
        />
      </div>
    </section>
  );
}

export default page;
