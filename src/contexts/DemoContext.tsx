import React, { createContext, useContext, ReactNode } from "react";
import { useDemoData, Bet, Platform, Activity } from "@/hooks/useDemoData";

interface DemoContextType {
  bets: Bet[];
  platforms: Platform[];
  activities: Activity[];
  totalBalance: number;
  weeklyProfit: number;
  addBet: (bet: Omit<Bet, "id" | "createdAt" | "status">) => void;
  resolveBet: (betId: string, outcome: "won" | "lost") => void;
  deposit: (platformId: string, amount: number) => void;
  connectPlatform: (platformId: string) => void;
  disconnectPlatform: (platformId: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const demoData = useDemoData();
  
  return (
    <DemoContext.Provider value={demoData}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
};
