import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Building2, Plus, Settings, Loader2 } from "lucide-react";
import { useUserDataContext } from "@/contexts/UserDataContext";
import { DepositModal } from "@/components/modals/DepositModal";
import { ConnectPlatformModal } from "@/components/modals/ConnectPlatformModal";

export const DepositScreen = () => {
  const { platforms, totalBalance, deposit, connectPlatform, disconnectPlatform, loading } = useUserDataContext();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>();

  const connectedPlatforms = platforms.filter(p => p.connected);

  // Format platforms for modals (adapt to new schema)
  const formattedPlatforms = platforms.map(p => ({
    id: p.id,
    name: p.platform_name,
    balance: p.balance,
    connected: p.connected,
  }));

  const handleDepositClick = (platformId?: string) => {
    setSelectedPlatform(platformId);
    setDepositModalOpen(true);
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
          Wallet
        </h1>
        <p className="text-muted-foreground">Manage funds across platforms</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary via-primary to-accent border-0">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-6 h-6 text-white" />
          <h3 className="font-semibold text-white">Total Balance</h3>
        </div>
        <div className="text-4xl font-bold text-white mb-2">
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-white/80">Across {connectedPlatforms.length} platforms</div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Platform Balances</h2>
          <Button variant="outline" size="sm" onClick={() => setConnectModalOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
        <div className="space-y-3">
          {connectedPlatforms.map((platform) => (
            <Card key={platform.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{platform.platform_name}</div>
                    <div className="text-sm text-muted-foreground">Available balance</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xl font-bold text-foreground">
                    ${platform.balance.toFixed(2)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDepositClick(platform.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {connectedPlatforms.length === 0 && (
            <Card className="p-6 text-center border-dashed">
              <p className="text-muted-foreground mb-3">No platforms connected yet</p>
              <Button onClick={() => setConnectModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Connect Platform
              </Button>
            </Card>
          )}
        </div>
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
        onClick={() => handleDepositClick()}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Funds
      </Button>

      <DepositModal
        open={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false);
          setSelectedPlatform(undefined);
        }}
        onDeposit={deposit}
        platforms={formattedPlatforms}
        preselectedPlatform={selectedPlatform}
      />

      <ConnectPlatformModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onConnect={connectPlatform}
        onDisconnect={disconnectPlatform}
        platforms={formattedPlatforms}
      />
    </div>
  );
};
