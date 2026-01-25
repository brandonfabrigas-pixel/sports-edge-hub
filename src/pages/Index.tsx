import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { FantasyScreen } from "@/components/screens/FantasyScreen";
import { BettingScreen } from "@/components/screens/BettingScreen";
import { DepositScreen } from "@/components/screens/DepositScreen";
import { LandingPage } from "@/components/LandingPage";
import { AuthPage } from "@/components/auth/AuthPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { Loader2 } from "lucide-react";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeScreen, setActiveScreen] = useState("landing");

  useEffect(() => {
    // If user is logged in and on landing/auth, go to home
    if (user && (activeScreen === "landing" || activeScreen === "auth")) {
      setActiveScreen("home");
    }
    // If user logs out, go to landing
    if (!user && !loading && activeScreen !== "landing" && activeScreen !== "auth") {
      setActiveScreen("landing");
    }
  }, [user, loading, activeScreen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleGetStarted = () => setActiveScreen("auth");
  const handleAuthSuccess = () => setActiveScreen("home");

  const renderScreen = () => {
    switch (activeScreen) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} />;
      case "auth":
        return <AuthPage onSuccess={handleAuthSuccess} />;
      case "home":
        return <HomeScreen />;
      case "fantasy":
        return <FantasyScreen />;
      case "betting":
        return <BettingScreen />;
      case "deposit":
        return <DepositScreen />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  const showNav = user && activeScreen !== "landing" && activeScreen !== "auth";

  return (
    <div className="min-h-screen bg-background">
      {showNav ? (
        <UserDataProvider>
          <div className="max-w-md mx-auto p-6">
            {renderScreen()}
          </div>
          <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
        </UserDataProvider>
      ) : (
        renderScreen()
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
