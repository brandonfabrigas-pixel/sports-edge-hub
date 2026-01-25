import { DashboardCard } from "../DashboardCard";
import { TrendingUp, Trophy, Wallet, Target } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";

export const HomeScreen = () => {
  const { bets, activities, totalBalance, weeklyProfit } = useDemo();
  
  const pendingBets = bets.filter(b => b.status === "pending").length;
  const winCount = bets.filter(b => b.status === "won").length;
  const totalResolved = bets.filter(b => b.status !== "pending").length;
  const winRate = totalResolved > 0 ? Math.round((winCount / totalResolved) * 100) : 0;
  const roi = weeklyProfit > 0 ? Math.round((weeklyProfit / 500) * 100) : 0;

  const recentActivities = activities.slice(0, 5);

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
          value={`$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`${weeklyProfit >= 0 ? "+" : ""}$${weeklyProfit.toFixed(0)} this week`}
          icon={Wallet}
          trend={weeklyProfit >= 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Active Bets"
          value={bets.length.toString()}
          subtitle={`${pendingBets} pending`}
          icon={TrendingUp}
          trend="neutral"
        />
        <DashboardCard
          title="Win Rate"
          value={`${winCount}/${totalResolved}`}
          subtitle={`${winRate}% success`}
          icon={Trophy}
          trend={winRate >= 50 ? "up" : "down"}
        />
        <DashboardCard
          title="ROI"
          value={`${roi >= 0 ? "+" : ""}${roi}%`}
          subtitle="Last 30 days"
          icon={Target}
          trend={roi >= 0 ? "up" : "down"}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <div className="p-4 bg-card rounded-lg border border-border text-center text-muted-foreground">
              No recent activity
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
              >
                <span className="text-sm text-foreground">{activity.text}</span>
                <span
                  className={
                    activity.amount >= 0
                      ? "text-accent font-semibold"
                      : "text-destructive font-semibold"
                  }
                >
                  {activity.amount >= 0 ? "+" : ""}${Math.abs(activity.amount).toFixed(0)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
