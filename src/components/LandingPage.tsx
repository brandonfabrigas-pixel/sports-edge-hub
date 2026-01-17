import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, Target, ChevronRight, Shield, Zap } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: Target,
      title: "Risk Analysis",
      description: "Our proprietary Risk Meter™ visualizes player volatility instantly. Know who's safe and who's a gamble.",
      color: "bg-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "ROI Metrics",
      description: "Calculate exact Return on Investment for every draft pick. Maximize points per dollar spent.",
      color: "bg-rose-500",
    },
    {
      icon: Zap,
      title: "AI Recommendations",
      description: "Get data-backed start/sit advice customized to your specific league scoring settings.",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">FantasyMint</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-primary flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Player Market
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              Analysis Center
            </a>
          </nav>

          <Button 
            onClick={onGetStarted}
            variant="outline" 
            className="border-foreground/20 hover:bg-foreground hover:text-background"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Fantasy Sports Analytics Reimagined
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Draft Smarter.</span>
            <br />
            <span className="text-primary">Win Bigger.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Advanced metrics, ROI tracking, and AI-powered risk analysis for fantasy sports. 
            Get the Moneyball edge your team deserves.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base gap-2"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-12 px-8 text-base border-border hover:bg-muted"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[hsl(220,25%,12%)] p-6 md:p-8 shadow-2xl">
            <div className="grid grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-[hsl(220,20%,18%)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="h-2 bg-[hsl(220,15%,25%)] rounded w-3/4 mb-2" />
                <div className="h-6 bg-emerald-500 rounded w-1/2" />
              </div>
              
              {/* Card 2 */}
              <div className="bg-[hsl(220,20%,18%)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                </div>
                <div className="h-2 bg-[hsl(220,15%,25%)] rounded w-3/4 mb-2" />
                <div className="h-6 bg-rose-500 rounded w-1/2" />
              </div>
              
              {/* Card 3 */}
              <div className="bg-[hsl(220,20%,18%)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                </div>
                <div className="h-2 bg-[hsl(220,15%,25%)] rounded w-3/4 mb-2" />
                <div className="h-6 bg-amber-500 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center md:text-left">
                <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to dominate your leagues?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of fantasy players using data-driven insights to win more.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-12 text-base gap-2"
          >
            Start Winning Today
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">FantasyMint</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 FantasyMint. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};