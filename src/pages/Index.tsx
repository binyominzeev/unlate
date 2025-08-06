import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalityTest from "@/components/PersonalityTest";
import HabitProfile from "@/components/HabitProfile";
import Dashboard from "@/components/Dashboard";
import FeedbackModal from "@/components/FeedbackModal";
import heroImage from "@/assets/hero-image.jpg";
import { Clock, Target, Brain, Smartphone, TrendingUp, Zap } from "lucide-react";

type AppState = 'landing' | 'test' | 'profile' | 'dashboard';

interface TimeSlot {
  id: string;
  name: string;
  targetTime: string;
  preparationTime: string;
  frequency: string;
  description?: string;
}

interface UserProfile {
  personality: string;
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleTestComplete = (personality: string) => {
    setUserProfile({ ...userProfile, personality } as UserProfile);
    setAppState('profile');
  };

  const handleProfileComplete = (profile: { timeSlots: TimeSlot[], selectedSlot: TimeSlot }) => {
    setUserProfile({
      personality: userProfile?.personality || '',
      timeSlots: profile.timeSlots,
      selectedSlot: profile.selectedSlot
    });
    setAppState('dashboard');
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    // Here you would send feedback to your backend/AI system
  };

  if (appState === 'test') {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <PersonalityTest onComplete={handleTestComplete} />
      </div>
    );
  }

  if (appState === 'profile' && userProfile) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <HabitProfile 
          personality={userProfile.personality} 
          onComplete={handleProfileComplete} 
        />
      </div>
    );
  }

  if (appState === 'dashboard' && userProfile) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <Dashboard
          personality={userProfile.personality}
          selectedSlot={userProfile.selectedSlot}
          onShowFeedback={() => setShowFeedback(true)}
          onSettings={() => setAppState('profile')}
        />
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          personality={userProfile.personality}
          onSubmit={handleFeedbackSubmit}
        />
      </div>
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Unlate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Break the habit of being late with AI-powered, personality-driven habit formation
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => setAppState('test')}
              variant="hero" 
              size="lg"
              className="px-8 py-6 text-lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              <Smartphone className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Personality-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Discover your lateness style and get personalized strategies
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Gradual Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on one habit at a time for lasting change
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Smart Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  AI-adapted notifications that work with your style
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Unlate Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A personalized approach to building punctuality habits that actually stick
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Take the Test",
                description: "Discover your unique lateness personality type",
                icon: Brain
              },
              {
                step: "2", 
                title: "Build Your Profile",
                description: "Identify when and why you're typically late",
                icon: Target
              },
              {
                step: "3",
                title: "Start Small",
                description: "Focus on one habit with personalized reminders",
                icon: Clock
              },
              {
                step: "4",
                title: "Track Progress",
                description: "Build streaks and refine your approach with AI feedback",
                icon: TrendingUp
              }
            ].map((item, index) => (
              <Card key={index} className="text-center bg-card border-0 shadow-soft">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">STEP {item.step}</div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to break the cycle of lateness?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who've transformed their relationship with time
          </p>
          <Button 
            onClick={() => setAppState('test')}
            variant="hero" 
            size="lg"
            className="px-12 py-6 text-lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Get Started for Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;