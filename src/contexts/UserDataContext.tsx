import React, { createContext, useContext, ReactNode } from "react";
import { useUserData, Bet, Platform, Activity } from "@/hooks/useUserData";

interface UserDataContextType {
  bets: Bet[];
  platforms: Platform[];
  activities: Activity[];
  totalBalance: number;
  weeklyProfit: number;
  loading: boolean;
  addBet: (bet: Omit<Bet, "id" | "created_at" | "status">) => Promise<void>;
  resolveBet: (betId: string, outcome: "won" | "lost") => Promise<void>;
  deposit: (platformId: string, amount: number) => Promise<void>;
  connectPlatform: (platformId: string) => Promise<void>;
  disconnectPlatform: (platformId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const userData = useUserData();
  
  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserDataContext must be used within a UserDataProvider");
  }
  return context;
};
