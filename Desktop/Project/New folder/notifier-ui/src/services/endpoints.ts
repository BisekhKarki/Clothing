
const endpoints = {
  //cookies
 

  health: "/health",

  //auth

  googleLogin: "/api/auth/o/google",
  createJWT: "/api/auth/jwt/create",
  refreshToken: "/api/auth/jwt/refresh",

  //users
  getUser: "/api/users/me",
  subscription: (id: string) => `/api/users/${id}/subscription`,

  //symbols



  // alerts
  alerts: "/api/alerts",
  alert: (id: string) => `/api/alerts/${id}`,
  alertStatus: (id: string) => `/api/alerts/${id}/status`,

  //stocks
  stocks: "/api/stocks",
  liveMarket: "/api/stocks/live-market",

  // subscriptions
  subscriptions: "/api/subscriptions",

  //watchlists
  watchlists: "/api/watchlist",
  watchlist: (id: string) => `/api/watchlist/${id}`,

  //portfolios
  portfolios: "/api/portfolios",
  portfolio: (id: string) => `/api/portfolios/${id}`,

  //transactions
  transactions: (id: string, symbol:string, limit:number, offset:number) => `/api/portfolios/${id}/transactions?${`limit=${limit}&offset=${offset}${symbol && `&symbol=${symbol}`}`}`,
  transaction: (id: string, transactionId: string) =>
    `/api/portfolios/${id}/transactions/${transactionId}`,

  importTransactions: (id: string) =>
    `/api/portfolios/${id}/import-transactions`,
  uploadTransactions: `/api/portfolios/upload-transactions`,

  //dashpboard
  // dashboard: (id: string) => `/api/portfolios/${id}/dashboard`,

  position: (id: string, limit:number, offset:number, query?: string, ) => `/api/portfolios/${id}/positions?${`limit=${limit}&offset=${offset}${query && `&status=${query}`}`}`,

  performance: (id: string) => `/api/portfolios/${id}/performance`,
  allocation: (id: string) => `/api/portfolios/${id}/allocations`,


  //snapShots
  snapshots: (id: string) => `/api/portfolios/${id}/snapshots`,
};

export default endpoints;