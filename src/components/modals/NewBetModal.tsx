import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Platform, Bet } from "@/hooks/useDemoData";

interface NewBetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bet: Omit<Bet, "id" | "createdAt" | "status">) => void;
  platforms: Platform[];
}

const sampleGames = [
  "LAL vs GSW",
  "MIA vs BOS",
  "DAL vs PHX",
  "NYK vs BKN",
  "CHI vs DET",
  "KC vs BUF",
  "SF vs SEA",
  "PHI vs DAL",
];

const sampleBetTypes = [
  "Spread -3.5",
  "Spread +3.5",
  "Over 220.5",
  "Under 220.5",
  "Moneyline",
  "1st Half Over",
  "Player Props",
];

export const NewBetModal = ({ open, onClose, onSubmit, platforms }: NewBetModalProps) => {
  const [game, setGame] = useState("");
  const [betType, setBetType] = useState("");
  const [stake, setStake] = useState("");
  const [odds, setOdds] = useState("-110");
  const [platform, setPlatform] = useState("");

  const connectedPlatforms = platforms.filter(p => p.connected);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!game || !betType || !stake || !odds || !platform) return;

    onSubmit({
      game,
      bet: betType,
      stake: parseFloat(stake),
      odds,
      platform,
    });

    // Reset form
    setGame("");
    setBetType("");
    setStake("");
    setOdds("-110");
    setPlatform("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place New Bet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Game</Label>
            <Select value={game} onValueChange={setGame}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a game" />
              </SelectTrigger>
              <SelectContent>
                {sampleGames.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bet Type</Label>
            <Select value={betType} onValueChange={setBetType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose bet type" />
              </SelectTrigger>
              <SelectContent>
                {sampleBetTypes.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stake ($)</Label>
              <Input
                type="number"
                placeholder="100"
                value={stake}
                onChange={e => setStake(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Odds</Label>
              <Input
                placeholder="-110"
                value={odds}
                onChange={e => setOdds(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Choose platform" />
              </SelectTrigger>
              <SelectContent>
                {connectedPlatforms.map(p => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name} (${p.balance.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-accent">
              Place Bet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
