import { Home, Trophy, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "fantasy", label: "Fantasy", icon: Trophy },
  { id: "betting", label: "Betting", icon: TrendingUp },
  { id: "deposit", label: "Wallet", icon: Wallet },
];

export const BottomNav = ({ activeScreen, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all",
              activeScreen === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 transition-transform",
                activeScreen === id && "scale-110"
              )}
            />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
