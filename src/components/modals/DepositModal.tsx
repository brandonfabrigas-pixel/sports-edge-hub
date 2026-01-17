import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { Platform } from "@/hooks/useDemoData";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  onDeposit: (platformId: string, amount: number) => void;
  platforms: Platform[];
  preselectedPlatform?: string;
}

export const DepositModal = ({ open, onClose, onDeposit, platforms, preselectedPlatform }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [platformId, setPlatformId] = useState(preselectedPlatform || "");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const connectedPlatforms = platforms.filter(p => p.connected);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformId || !amount) return;

    onDeposit(platformId, parseFloat(amount));
    setAmount("");
    setPlatformId("");
    onClose();
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Platform</Label>
            <Select value={platformId} onValueChange={setPlatformId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose platform" />
              </SelectTrigger>
              <SelectContent>
                {connectedPlatforms.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {p.name} - ${p.balance.toFixed(2)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount ($)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map(amt => (
              <Button
                key={amt}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
                className={amount === amt.toString() ? "border-primary bg-primary/10" : ""}
              >
                ${amt}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "card" ? "default" : "secondary"}
                onClick={() => setPaymentMethod("card")}
                className="justify-start gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Card
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "paypal" ? "default" : "secondary"}
                onClick={() => setPaymentMethod("paypal")}
                className="justify-start gap-2"
              >
                <Smartphone className="w-4 h-4" />
                PayPal
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-accent">
              Deposit ${amount || "0"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
