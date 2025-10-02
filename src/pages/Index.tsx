import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { FantasyScreen } from "@/components/screens/FantasyScreen";
import { BettingScreen } from "@/components/screens/BettingScreen";
import { DepositScreen } from "@/components/screens/DepositScreen";

const Index = () => {
  const [activeScreen, setActiveScreen] = useState("home");

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return <HomeScreen />;
      case "fantasy":
        return <FantasyScreen />;
      case "betting":
        return <BettingScreen />;
      case "deposit":
        return <DepositScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-6">
        {renderScreen()}
      </div>
      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
    </div>
  );
};

export default Index;
