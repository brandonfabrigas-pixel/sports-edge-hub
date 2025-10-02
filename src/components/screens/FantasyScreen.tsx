import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export const FantasyScreen = () => {
  const recommendations = [
    { player: "Patrick Mahomes", position: "QB", action: "start", matchup: "vs DEN", projection: "24.8 pts" },
    { player: "Christian McCaffrey", position: "RB", action: "start", matchup: "@ SEA", projection: "22.3 pts" },
    { player: "Gabe Davis", position: "WR", action: "sit", matchup: "@ LAC", projection: "8.2 pts" },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Fantasy Hub
        </h1>
        <p className="text-muted-foreground">AI-powered start/sit recommendations</p>
      </div>

      <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Week 15 Outlook</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your lineup is projected to score <span className="text-accent font-bold">128.4 points</span> this week.
        </p>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Start/Sit Recommendations</h2>
          <Button variant="outline" size="sm">Import League</Button>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <Card key={i} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {rec.action === "start" ? (
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                  <div>
                    <div className="font-semibold text-foreground">{rec.player}</div>
                    <div className="text-sm text-muted-foreground">
                      {rec.position} • {rec.matchup}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{rec.projection}</div>
                  <div className={`text-xs font-medium uppercase ${rec.action === "start" ? "text-accent" : "text-destructive"}`}>
                    {rec.action}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-5 border-border">
        <h3 className="font-semibold mb-3 text-foreground">Draft Strategy Tools</h3>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start">View Positional Rankings</Button>
          <Button variant="secondary" className="w-full justify-start">Mock Draft Simulator</Button>
          <Button variant="secondary" className="w-full justify-start">Trade Analyzer</Button>
        </div>
      </Card>
    </div>
  );
};
