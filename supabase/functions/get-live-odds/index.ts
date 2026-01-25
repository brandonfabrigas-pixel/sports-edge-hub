import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ODDS_API_KEY");
    
    if (!apiKey) {
      // Return mock data if no API key is configured
      const mockOdds = [
        {
          id: "1",
          sport: "basketball_nba",
          home_team: "Los Angeles Lakers",
          away_team: "Golden State Warriors",
          commence_time: new Date(Date.now() + 3600000).toISOString(),
          bookmakers: [
            {
              key: "draftkings",
              title: "DraftKings",
              markets: [
                {
                  key: "spreads",
                  outcomes: [
                    { name: "Los Angeles Lakers", price: -110, point: -3.5 },
                    { name: "Golden State Warriors", price: -110, point: 3.5 },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "2",
          sport: "basketball_nba",
          home_team: "Miami Heat",
          away_team: "Boston Celtics",
          commence_time: new Date(Date.now() + 7200000).toISOString(),
          bookmakers: [
            {
              key: "fanduel",
              title: "FanDuel",
              markets: [
                {
                  key: "totals",
                  outcomes: [
                    { name: "Over", price: -105, point: 218.5 },
                    { name: "Under", price: -115, point: 218.5 },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "3",
          sport: "basketball_nba",
          home_team: "Dallas Mavericks",
          away_team: "Phoenix Suns",
          commence_time: new Date(Date.now() + 10800000).toISOString(),
          bookmakers: [
            {
              key: "betmgm",
              title: "BetMGM",
              markets: [
                {
                  key: "h2h",
                  outcomes: [
                    { name: "Dallas Mavericks", price: 150 },
                    { name: "Phoenix Suns", price: -180 },
                  ],
                },
              ],
            },
          ],
        },
      ];

      return new Response(JSON.stringify({ data: mockOdds, isDemo: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch real odds from The Odds API
    const url = new URL(req.url);
    const sport = url.searchParams.get("sport") || "basketball_nba";
    const markets = url.searchParams.get("markets") || "h2h,spreads,totals";

    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=${markets}`,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) {
      throw new Error(`Odds API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({ data, isDemo: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error fetching odds:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
