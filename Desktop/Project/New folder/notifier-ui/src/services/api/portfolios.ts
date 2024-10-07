import { BASE_URL } from "@/constant/constant";
import endpoints from "../endpoints";

class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super("Something went wrong status " + res.status.toString());
  }
}

export const getAllPortfolios = async (token: string): Promise<any> => {
  const response = await fetch(BASE_URL + endpoints.portfolios, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export const getAllMembers = async(token:string,portfolioId:any):Promise<any>=>{
  const response = await fetch(BASE_URL + `/api/portfolios/${portfolioId}/members`,{
    headers:{
      Authorization: `Bearer ${token}`,
    }
  })
  return response
}


export const getPortfolioById = async (
  token: string,
  id: string,
): Promise<any> => {
  const response = await fetch(BASE_URL + endpoints.portfolio(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getPosition = async (
  token: string,
  id: string,
  status: string,
  limit: number,
  offset: number
): Promise<any> => {
  const response = await fetch(BASE_URL + endpoints.position(id, limit, offset, status), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new FetchError(response);
  }

  const data = await response.json();
  return data;
};

export const getPerformance = async (
  token: string,
  id: string
): Promise<any> => {
  const response = await fetch(BASE_URL + endpoints.performance(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new FetchError(response);
  }

  const data = await response.json();
  return data;
};

// export const getTransactions = async (
//   token: string,
//   id: string
// ): Promise<any> => {
//   const response = await fetch(`${BASE_URL}${endpoints.transactions(id)}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     next: { tags: ['transactions'] }
//   },
//   );
//   const data = await response.json();
//   return data;
// };

export const getAllocation = async(
  token: string,
  id: string
): Promise<any> => {
  const response = await fetch(`${BASE_URL}${endpoints.allocation(id)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}


// const response = await fetch(
//   search.length <= 0
//     ? `${BASE_URL}/api/portfolios/${portfolioId}/transactions?limit=${urlData.limit}&offset=${urlData.offset}`
//     : `${BASE_URL}/api/portfolios/${portfolioId}/transactions?symbol=${search}&limit=${urlData.limit}&offset=${urlData.offset}`,

//   {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   }


export const getTransactionsBySymbol = async (
  token: string,
  id: string,
  symbol: string,
  limit: number,
  offset: number,
): Promise<any> => {
  const response = await fetch(`${BASE_URL}${endpoints.transactions(id, symbol, limit, offset)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
   const data = {data: [], limit:10, offset: 0, total: 0};
    return data;
  }
  const data = await response.json();
  return data;
};

export { FetchError };
