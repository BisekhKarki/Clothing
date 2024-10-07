export type User = {
  _id: string;
  googleId: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Store = {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  user: User | undefined;
  setAuthDetail: (accessToken: string, refreshToken: string) => void;
  deleteAuthDetail: () => void;
  setUser: (user: User | undefined) => void;
};
