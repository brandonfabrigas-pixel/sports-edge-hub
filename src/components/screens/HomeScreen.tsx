import { DashboardCard } from "../DashboardCard";
import { TrendingUp, Trophy, Wallet, Target } from "lucide-react";

export const HomeScreen = () => {
  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Your fantasy and betting overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DashboardCard
          title="Total Balance"
          value="$1,247"
          subtitle="+$182 this week"
          icon={Wallet}
          trend="up"
        />
        <DashboardCard
          title="Active Bets"
          value="8"
          subtitle="5 pending"
          icon={TrendingUp}
          trend="neutral"
        />
        <DashboardCard
          title="Fantasy Wins"
          value="12/15"
          subtitle="80% win rate"
          icon={Trophy}
          trend="up"
        />
        <DashboardCard
          title="ROI"
          value="+18%"
          subtitle="Last 30 days"
          icon={Target}
          trend="up"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { type: "win", text: "Won Fantasy League - Week 14", amount: "+$250" },
            { type: "win", text: "Parlay Hit - NBA", amount: "+$180" },
            { type: "loss", text: "Single Bet - NFL", amount: "-$50" },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
            >
              <span className="text-sm text-foreground">{activity.text}</span>
              <span
                className={
                  activity.type === "win"
                    ? "text-accent font-semibold"
                    : "text-destructive font-semibold"
                }
              >
                {activity.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
