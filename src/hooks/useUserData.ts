import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Bet {
  id: string;
  game: string;
  bet: string;
  stake: number;
  odds: string;
  status: "pending" | "won" | "lost";
  payout?: number;
  platform: string;
  created_at: string;
}

export interface Platform {
  id: string;
  platform_name: string;
  balance: number;
  connected: boolean;
}

export interface Activity {
  id: string;
  type: "win" | "loss" | "deposit" | "withdrawal";
  text: string;
  amount: number;
  created_at: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [betsRes, platformsRes, activitiesRes] = await Promise.all([
        supabase.from("bets").select("*").order("created_at", { ascending: false }),
        supabase.from("user_platforms").select("*").order("platform_name"),
        supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      if (betsRes.error) throw betsRes.error;
      if (platformsRes.error) throw platformsRes.error;
      if (activitiesRes.error) throw activitiesRes.error;

      setBets(betsRes.data as Bet[]);
      setPlatforms(platformsRes.data as Platform[]);
      setActivities(activitiesRes.data as Activity[]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalBalance = platforms.reduce((sum, p) => sum + (p.connected ? p.balance : 0), 0);
  
  const weeklyProfit = activities
    .filter(a => new Date(a.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, a) => sum + a.amount, 0);

  const addBet = useCallback(async (bet: Omit<Bet, "id" | "created_at" | "status">) => {
    if (!user) return;

    try {
      // Insert bet
      const { data: newBet, error: betError } = await supabase
        .from("bets")
        .insert({
          user_id: user.id,
          game: bet.game,
          bet: bet.bet,
          stake: bet.stake,
          odds: bet.odds,
          platform: bet.platform,
          status: "pending",
        })
        .select()
        .single();

      if (betError) throw betError;

      // Update platform balance
      const platform = platforms.find(p => p.platform_name === bet.platform);
      if (platform) {
        await supabase
          .from("user_platforms")
          .update({ balance: platform.balance - bet.stake })
          .eq("id", platform.id);
      }

      // Add activity
      await supabase.from("activities").insert({
        user_id: user.id,
        type: "loss",
        text: `Placed bet: ${bet.bet} on ${bet.game}`,
        amount: -bet.stake,
      });

      toast.success("Bet placed successfully!");
      fetchData();
    } catch (error) {
      console.error("Error adding bet:", error);
      toast.error("Failed to place bet");
    }
  }, [user, platforms, fetchData]);

  const resolveBet = useCallback(async (betId: string, outcome: "won" | "lost") => {
    if (!user) return;

    const bet = bets.find(b => b.id === betId);
    if (!bet) return;

    try {
      const payout = outcome === "won" ? bet.stake + calculatePayout(bet.stake, bet.odds) : 0;

      // Update bet
      await supabase
        .from("bets")
        .update({ 
          status: outcome, 
          payout: outcome === "won" ? payout : null 
        })
        .eq("id", betId);

      if (outcome === "won") {
        // Update platform balance
        const platform = platforms.find(p => p.platform_name === bet.platform);
        if (platform) {
          await supabase
            .from("user_platforms")
            .update({ balance: platform.balance + payout })
            .eq("id", platform.id);
        }

        // Add win activity
        await supabase.from("activities").insert({
          user_id: user.id,
          type: "win",
          text: `Won: ${bet.bet} on ${bet.game}`,
          amount: payout - bet.stake,
        });

        toast.success(`Won $${(payout - bet.stake).toFixed(2)}!`);
      } else {
        toast.info("Bet marked as lost");
      }

      fetchData();
    } catch (error) {
      console.error("Error resolving bet:", error);
      toast.error("Failed to update bet");
    }
  }, [user, bets, platforms, fetchData]);

  const deposit = useCallback(async (platformId: string, amount: number) => {
    if (!user) return;

    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    try {
      await supabase
        .from("user_platforms")
        .update({ balance: platform.balance + amount })
        .eq("id", platformId);

      await supabase.from("activities").insert({
        user_id: user.id,
        type: "deposit",
        text: `Deposited to ${platform.platform_name}`,
        amount: amount,
      });

      toast.success(`Deposited $${amount.toFixed(2)} to ${platform.platform_name}`);
      fetchData();
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Failed to deposit");
    }
  }, [user, platforms, fetchData]);

  const connectPlatform = useCallback(async (platformId: string) => {
    try {
      await supabase
        .from("user_platforms")
        .update({ connected: true })
        .eq("id", platformId);

      toast.success("Platform connected!");
      fetchData();
    } catch (error) {
      console.error("Error connecting platform:", error);
      toast.error("Failed to connect platform");
    }
  }, [fetchData]);

  const disconnectPlatform = useCallback(async (platformId: string) => {
    try {
      await supabase
        .from("user_platforms")
        .update({ connected: false, balance: 0 })
        .eq("id", platformId);

      toast.success("Platform disconnected");
      fetchData();
    } catch (error) {
      console.error("Error disconnecting platform:", error);
      toast.error("Failed to disconnect platform");
    }
  }, [fetchData]);

  return {
    bets,
    platforms,
    activities,
    totalBalance,
    weeklyProfit,
    loading,
    addBet,
    resolveBet,
    deposit,
    connectPlatform,
    disconnectPlatform,
    refetch: fetchData,
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
