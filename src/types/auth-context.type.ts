import { ReactNode } from "react";

export type AuthContextType = {
    isAuthenticated: boolean | null;
    isLoading: boolean;
    userId: string | null;
    userName: string | null;
  };
  
  
 export type AuthProviderProps = {
    children: ReactNode;
    initialSession?: {
      user?: {
        id?: string;
        name?: string | null;
        email?: string | null;
      } | null;
    } | null;
  };