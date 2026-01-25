import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, Plus, CheckCircle2, XCircle, RefreshCw, Loader2 } from "lucide-react";
import { useUserDataContext } from "@/contexts/UserDataContext";
import { NewBetModal } from "@/components/modals/NewBetModal";
import { useLiveOdds } from "@/hooks/useLiveOdds";

export const BettingScreen = () => {
  const { bets, platforms, weeklyProfit, addBet, resolveBet, loading } = useUserDataContext();
  const { odds, loading: oddsLoading, isDemo, refetch: refetchOdds } = useLiveOdds();
  const [newBetOpen, setNewBetOpen] = useState(false);

  const pendingBets = bets.filter(b => b.status === "pending");
  const resolvedBets = bets.filter(b => b.status !== "pending");
  const winCount = bets.filter(b => b.status === "won").length;
  const totalResolved = resolvedBets.length;
  const winRate = totalResolved > 0 ? Math.round((winCount / totalResolved) * 100) : 0;
  const roi = weeklyProfit > 0 ? Math.round((weeklyProfit / 500) * 100) : 0;

  // Format platforms for the modal (adapt to new schema)
  const formattedPlatforms = platforms.map(p => ({
    id: p.id,
    name: p.platform_name,
    balance: p.balance,
    connected: p.connected,
  }));

  const handleAddBet = async (bet: { game: string; bet: string; stake: number; odds: string; platform: string }) => {
    await addBet(bet);
    setNewBetOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Betting Tracker
        </h1>
        <p className="text-muted-foreground">Track bets and analyze performance</p>
      </div>

      <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">This Week's Performance</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className={`text-2xl font-bold ${weeklyProfit >= 0 ? "text-accent" : "text-destructive"}`}>
              {weeklyProfit >= 0 ? "+" : ""}${Math.abs(weeklyProfit).toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Profit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{winCount}/{totalResolved}</div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${roi >= 0 ? "text-primary" : "text-destructive"}`}>
              {roi >= 0 ? "+" : ""}{roi}%
            </div>
            <div className="text-xs text-muted-foreground">ROI</div>
          </div>
        </div>
      </Card>

      {/* Live Odds Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Live Odds</h2>
            {isDemo && (
              <Badge variant="secondary" className="text-xs">Demo</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={refetchOdds} disabled={oddsLoading}>
            <RefreshCw className={`w-4 h-4 ${oddsLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {oddsLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : odds.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">
            No live odds available
          </Card>
        ) : (
          <div className="space-y-2">
            {odds.slice(0, 3).map((game) => (
              <Card key={game.id} className="p-3">
                <div className="text-sm font-medium text-foreground">
                  {game.away_team} @ {game.home_team}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(game.commence_time).toLocaleString()}
                </div>
                {game.bookmakers[0]?.markets[0] && (
                  <div className="flex gap-2 mt-2">
                    {game.bookmakers[0].markets[0].outcomes.map((outcome, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {outcome.name}: {outcome.price > 0 ? "+" : ""}{outcome.price}
                        {outcome.point !== undefined && ` (${outcome.point > 0 ? "+" : ""}${outcome.point})`}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Bets ({pendingBets.length})</h2>
          <Button size="sm" onClick={() => setNewBetOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Bet
          </Button>
        </div>

        <div className="space-y-3">
          {pendingBets.length === 0 ? (
            <Card className="p-6 text-center border-dashed">
              <p className="text-muted-foreground mb-3">No active bets</p>
              <Button onClick={() => setNewBetOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Place Your First Bet
              </Button>
            </Card>
          ) : (
            pendingBets.map((bet) => (
              <Card key={bet.id} className="p-4 hover:border-primary/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{bet.game}</h4>
                    <Badge variant="secondary">{bet.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{bet.bet}</span>
                    <span className="text-foreground">{bet.odds}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      {bet.platform} • ${bet.stake.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-accent border-accent/50 hover:bg-accent/10"
                        onClick={() => resolveBet(bet.id, "won")}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Won
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-destructive border-destructive/50 hover:bg-destructive/10"
                        onClick={() => resolveBet(bet.id, "lost")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Lost
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {resolvedBets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Results</h2>
          <div className="space-y-3">
            {resolvedBets.slice(0, 5).map((bet) => (
              <Card key={bet.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{bet.game}</h4>
                    <span className="text-sm text-muted-foreground">{bet.bet}</span>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={bet.status === "won" ? "default" : "destructive"}
                      className={bet.status === "won" ? "bg-accent hover:bg-accent" : ""}
                    >
                      {bet.status}
                    </Badge>
                    {bet.payout && (
                      <div className="text-sm font-semibold text-accent mt-1">
                        +${bet.payout.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="p-5 border-destructive/30 bg-destructive/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">AI Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">
              You've placed {bets.length} bets this week. Consider your bankroll management and avoid chasing losses.
            </p>
          </div>
        </div>
      </Card>

      <NewBetModal
        open={newBetOpen}
        onClose={() => setNewBetOpen(false)}
        onSubmit={handleAddBet}
        platforms={formattedPlatforms}
      />
    </div>
  );
};
