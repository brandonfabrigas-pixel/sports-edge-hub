import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Check, Loader2 } from "lucide-react";
import { Platform } from "@/hooks/useDemoData";

interface ConnectPlatformModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: (platformId: string) => void;
  onDisconnect: (platformId: string) => void;
  platforms: Platform[];
}

export const ConnectPlatformModal = ({ open, onClose, onConnect, onDisconnect, platforms }: ConnectPlatformModalProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConnect(platformId);
    setConnecting(null);
    setCredentials({ email: "", password: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Platforms</DialogTitle>
          <DialogDescription>
            Connect or disconnect your betting platforms
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {platforms.map(platform => (
            <div
              key={platform.id}
              className={`p-4 rounded-lg border ${
                platform.connected 
                  ? "border-accent/50 bg-accent/5" 
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    platform.connected ? "bg-accent/20" : "bg-muted"
                  }`}>
                    <Building2 className={`w-5 h-5 ${
                      platform.connected ? "text-accent" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{platform.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {platform.connected 
                        ? `Balance: $${platform.balance.toFixed(2)}` 
                        : "Not connected"}
                    </div>
                  </div>
                </div>
                
                {platform.connected ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDisconnect(platform.id)}
                  >
                    Disconnect
                  </Button>
                ) : connecting === platform.id ? (
                  <Button disabled size="sm">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(platform.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>

              {connecting === platform.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={credentials.email}
                      onChange={e => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo mode - credentials are not saved
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={onClose} className="w-full mt-2">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
};
