import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { FantasyScreen } from "@/components/screens/FantasyScreen";
import { BettingScreen } from "@/components/screens/BettingScreen";
import { DepositScreen } from "@/components/screens/DepositScreen";
import { LandingPage } from "@/components/LandingPage";
import { DemoProvider } from "@/contexts/DemoContext";

const Index = () => {
  const [activeScreen, setActiveScreen] = useState("landing");

  const renderScreen = () => {
    switch (activeScreen) {
      case "landing":
        return <LandingPage onGetStarted={() => setActiveScreen("home")} />;
      case "home":
        return <HomeScreen />;
      case "fantasy":
        return <FantasyScreen />;
      case "betting":
        return <BettingScreen />;
      case "deposit":
        return <DepositScreen />;
      default:
        return <LandingPage onGetStarted={() => setActiveScreen("home")} />;
    }
  };

  const showNav = activeScreen !== "landing";

  return (
    <DemoProvider>
      <div className="min-h-screen bg-background">
        {showNav ? (
          <div className="max-w-md mx-auto p-6">
            {renderScreen()}
          </div>
        ) : (
          renderScreen()
        )}
        {showNav && <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />}
      </div>
    </DemoProvider>
  );
};

export default Index;
