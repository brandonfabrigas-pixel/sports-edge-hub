import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, CreditCard, Building2, Smartphone } from "lucide-react";

export const DepositScreen = () => {
  const platforms = [
    { name: "DraftKings", balance: "$487.50", icon: Building2 },
    { name: "FanDuel", balance: "$325.00", icon: Building2 },
    { name: "BetMGM", balance: "$434.20", icon: Building2 },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Wallet
        </h1>
        <p className="text-muted-foreground">Manage funds across platforms</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary via-primary to-accent border-0">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-6 h-6 text-white" />
          <h3 className="font-semibold text-white">Total Balance</h3>
        </div>
        <div className="text-4xl font-bold text-white mb-2">$1,246.70</div>
        <div className="text-sm text-white/80">Across all platforms</div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Platform Balances</h2>
        <div className="space-y-3">
          {platforms.map((platform, i) => (
            <Card key={i} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <platform.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{platform.name}</div>
                    <div className="text-sm text-muted-foreground">Available balance</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-foreground">{platform.balance}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-5 border-border">
        <h3 className="font-semibold mb-4 text-foreground">Add Funds</h3>
        <div className="space-y-4">
          <Input type="number" placeholder="Amount ($)" className="text-lg" />
          
          <div className="grid grid-cols-3 gap-3">
            {[50, 100, 250].map((amount) => (
              <Button key={amount} variant="outline" size="sm">
                ${amount}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start gap-2">
                <CreditCard className="w-4 h-4" />
                Card
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <Smartphone className="w-4 h-4" />
                PayPal
              </Button>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Deposit Funds
          </Button>
        </div>
      </Card>
    </div>
  );
};
