import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle } from "lucide-react";

export const BettingScreen = () => {
  const activeBets = [
    { game: "LAL vs GSW", bet: "LAL -3.5", stake: "$100", odds: "-110", status: "pending" },
    { game: "MIA vs BOS", bet: "Over 218.5", stake: "$50", odds: "+105", status: "pending" },
    { game: "DAL vs PHX", bet: "DAL ML", stake: "$75", odds: "+150", status: "won", payout: "+$112.50" },
  ];

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
            <div className="text-2xl font-bold text-accent">+$247</div>
            <div className="text-xs text-muted-foreground">Profit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">12/18</div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">+18%</div>
            <div className="text-xs text-muted-foreground">ROI</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Bets</h2>
          <Button size="sm">New Bet</Button>
        </div>

        <div className="space-y-3">
          {activeBets.map((bet, i) => (
            <Card key={i} className="p-4 hover:border-primary/50 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{bet.game}</h4>
                  <Badge
                    variant={
                      bet.status === "won"
                        ? "default"
                        : bet.status === "lost"
                        ? "destructive"
                        : "secondary"
                    }
                    className={bet.status === "won" ? "bg-accent hover:bg-accent" : ""}
                  >
                    {bet.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{bet.bet}</span>
                  <span className="text-foreground">{bet.odds}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Stake: {bet.stake}</span>
                  {bet.payout && (
                    <span className="text-sm font-semibold text-accent">{bet.payout}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-5 border-destructive/30 bg-destructive/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">AI Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">
              You've placed 8 bets this week. Consider your bankroll management and avoid chasing losses.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
