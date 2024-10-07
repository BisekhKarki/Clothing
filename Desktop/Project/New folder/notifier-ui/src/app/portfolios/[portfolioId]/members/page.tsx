import { cookies } from "next/headers";
import ManageMembers from "@/components/ManageMembers";
import { useParams } from "next/navigation";
import { getPortfolioById } from "@/services/api/portfolios";
import { Metadata, ResolvingMetadata } from "next";

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

async function Page({ params }: { params: { portfolioId: string,portfolio:any } }) {
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value || "";

  return <ManageMembers accessToken={accessToken} portfolioId={params.portfolioId} portfolio={params.portfolio} />;
}

export default Page;
