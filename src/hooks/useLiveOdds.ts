import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface OddsOutcome {
  name: string;
  price: number;
  point?: number;
}

export interface OddsMarket {
  key: string;
  outcomes: OddsOutcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  markets: OddsMarket[];
}

export interface LiveOddsGame {
  id: string;
  sport: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers: Bookmaker[];
}

export const useLiveOdds = (sport: string = "basketball_nba") => {
  const [odds, setOdds] = useState<LiveOddsGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchOdds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("get-live-odds", {
        body: { sport },
      });

      if (fnError) throw fnError;

      setOdds(data.data || []);
      setIsDemo(data.isDemo || false);
    } catch (err: any) {
      console.error("Error fetching live odds:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sport]);

  useEffect(() => {
    fetchOdds();
    
    // Refresh odds every 2 minutes
    const interval = setInterval(fetchOdds, 120000);
    return () => clearInterval(interval);
  }, [fetchOdds]);

  return { odds, loading, error, isDemo, refetch: fetchOdds };
};
