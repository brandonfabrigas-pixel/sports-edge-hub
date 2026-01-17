import { useState, useCallback } from "react";

export interface Bet {
  id: string;
  game: string;
  bet: string;
  stake: number;
  odds: string;
  status: "pending" | "won" | "lost";
  payout?: number;
  platform: string;
  createdAt: Date;
}

export interface Platform {
  id: string;
  name: string;
  balance: number;
  connected: boolean;
  logo?: string;
}

export interface Activity {
  id: string;
  type: "win" | "loss" | "deposit" | "withdrawal";
  text: string;
  amount: number;
  timestamp: Date;
}

const initialBets: Bet[] = [
  { id: "1", game: "LAL vs GSW", bet: "LAL -3.5", stake: 100, odds: "-110", status: "pending", platform: "DraftKings", createdAt: new Date() },
  { id: "2", game: "MIA vs BOS", bet: "Over 218.5", stake: 50, odds: "+105", status: "pending", platform: "FanDuel", createdAt: new Date() },
  { id: "3", game: "DAL vs PHX", bet: "DAL ML", stake: 75, odds: "+150", status: "won", payout: 112.50, platform: "BetMGM", createdAt: new Date(Date.now() - 86400000) },
];

const initialPlatforms: Platform[] = [
  { id: "dk", name: "DraftKings", balance: 487.50, connected: true },
  { id: "fd", name: "FanDuel", balance: 325.00, connected: true },
  { id: "mgm", name: "BetMGM", balance: 434.20, connected: true },
  { id: "caesars", name: "Caesars", balance: 0, connected: false },
  { id: "espn", name: "ESPN Bet", balance: 0, connected: false },
];

const initialActivities: Activity[] = [
  { id: "1", type: "win", text: "Won Fantasy League - Week 14", amount: 250, timestamp: new Date(Date.now() - 3600000) },
  { id: "2", type: "win", text: "Parlay Hit - NBA", amount: 180, timestamp: new Date(Date.now() - 7200000) },
  { id: "3", type: "loss", text: "Single Bet - NFL", amount: -50, timestamp: new Date(Date.now() - 86400000) },
];

export const useDemoData = () => {
  const [bets, setBets] = useState<Bet[]>(initialBets);
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const totalBalance = platforms.reduce((sum, p) => sum + p.balance, 0);
  const weeklyProfit = activities
    .filter(a => a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, a) => sum + a.amount, 0);

  const addBet = useCallback((bet: Omit<Bet, "id" | "createdAt" | "status">) => {
    const newBet: Bet = {
      ...bet,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date(),
    };
    setBets(prev => [newBet, ...prev]);
    
    // Deduct from platform balance
    setPlatforms(prev => prev.map(p => 
      p.name === bet.platform 
        ? { ...p, balance: p.balance - bet.stake }
        : p
    ));
    
    // Add activity
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      type: "loss",
      text: `Placed bet: ${bet.bet} on ${bet.game}`,
      amount: -bet.stake,
      timestamp: new Date(),
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  const resolveBet = useCallback((betId: string, outcome: "won" | "lost") => {
    setBets(prev => prev.map(bet => {
      if (bet.id !== betId) return bet;
      
      const payout = outcome === "won" 
        ? bet.stake + calculatePayout(bet.stake, bet.odds)
        : 0;
      
      return { ...bet, status: outcome, payout: outcome === "won" ? payout : undefined };
    }));

    const bet = bets.find(b => b.id === betId);
    if (bet && outcome === "won") {
      const payout = bet.stake + calculatePayout(bet.stake, bet.odds);
      setPlatforms(prev => prev.map(p => 
        p.name === bet.platform 
          ? { ...p, balance: p.balance + payout }
          : p
      ));
      
      setActivities(prev => [{
        id: crypto.randomUUID(),
        type: "win",
        text: `Won: ${bet.bet} on ${bet.game}`,
        amount: payout - bet.stake,
        timestamp: new Date(),
      }, ...prev]);
    }
  }, [bets]);

  const deposit = useCallback((platformId: string, amount: number) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, balance: p.balance + amount }
        : p
    ));
    
    const platform = platforms.find(p => p.id === platformId);
    setActivities(prev => [{
      id: crypto.randomUUID(),
      type: "deposit",
      text: `Deposited to ${platform?.name}`,
      amount: amount,
      timestamp: new Date(),
    }, ...prev]);
  }, [platforms]);

  const connectPlatform = useCallback((platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, connected: true, balance: 0 }
        : p
    ));
  }, []);

  const disconnectPlatform = useCallback((platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, connected: false, balance: 0 }
        : p
    ));
  }, []);

  return {
    bets,
    platforms,
    activities,
    totalBalance,
    weeklyProfit,
    addBet,
    resolveBet,
    deposit,
    connectPlatform,
    disconnectPlatform,
  };
};

function calculatePayout(stake: number, odds: string): number {
  const oddsNum = parseInt(odds);
  if (oddsNum > 0) {
    return (stake * oddsNum) / 100;
  } else {
    return (stake * 100) / Math.abs(oddsNum);
  }
}
