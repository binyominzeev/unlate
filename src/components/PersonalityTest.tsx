import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Brain, Target, Heart, AlarmClock } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; personality: string }[];
}

const questions: Question[] = [
  {
    id: "1",
    question: "When you're running late, what's usually the main reason?",
    options: [
      { value: "perfectionist_reason", label: "I spent too much time getting everything just right", personality: "perfectionist" },
      { value: "optimist_reason", label: "I thought I had more time than I actually did", personality: "optimist" },
      { value: "social_reason", label: "I got caught up talking to someone or helping others", personality: "social" },
      { value: "overwhelmed_reason", label: "I had too many things to juggle at once", personality: "overwhelmed" },
      { value: "procrastinator_reason", label: "I kept putting off getting ready until the last minute", personality: "procrastinator" }
    ]
  },
  {
    id: "2",
    question: "How do you typically react when you realize you're going to be late?",
    options: [
      { value: "perfectionist_react", label: "I stress about how this affects my reputation", personality: "perfectionist" },
      { value: "optimist_react", label: "I think 'I can still make it if I hurry'", personality: "optimist" },
      { value: "social_react", label: "I immediately call or text to explain and apologize", personality: "social" },
      { value: "overwhelmed_react", label: "I feel anxious and my mind goes blank", personality: "overwhelmed" },
      { value: "procrastinator_react", label: "I feel guilty but also think 'this always happens'", personality: "procrastinator" }
    ]
  },
  {
    id: "3",
    question: "What would motivate you most to be on time?",
    options: [
      { value: "perfectionist_motivation", label: "Knowing that punctuality reflects my competence", personality: "perfectionist" },
      { value: "optimist_motivation", label: "Having a realistic understanding of how long things take", personality: "optimist" },
      { value: "social_motivation", label: "Not wanting to inconvenience or disappoint others", personality: "social" },
      { value: "overwhelmed_motivation", label: "Having a clear, simple system that reduces decision fatigue", personality: "overwhelmed" },
      { value: "procrastinator_motivation", label: "Breaking down preparation into smaller, manageable steps", personality: "procrastinator" }
    ]
  },
  {
    id: "4",
    question: "When planning your schedule, you tend to:",
    options: [
      { value: "perfectionist_plan", label: "Plan every detail but underestimate transition time", personality: "perfectionist" },
      { value: "optimist_plan", label: "Assume everything will go smoothly and perfectly", personality: "optimist" },
      { value: "social_plan", label: "Leave flexibility for unexpected conversations or requests", personality: "social" },
      { value: "overwhelmed_plan", label: "Feel stressed just thinking about fitting everything in", personality: "overwhelmed" },
      { value: "procrastinator_plan", label: "Avoid detailed planning and hope for the best", personality: "procrastinator" }
    ]
  }
];


const personalityTypes = {
  perfectionist: {
    title: "The Perfectionist",
    description: "You care deeply about doing things right, but sometimes get caught up in details.",
    strategy: "Balance your high standards with practicality by setting 'good enough' goals for minor tasks, using the 80/20 rule, and building buffer time into your schedule.",
    icon: Target
  },
  optimist: {
    title: "The Optimist",
    description: "You see the best in every situation and believe things will work out perfectly.",
    strategy: "Keep your positivity but anchor it with time tracking, 25% buffers on your estimates, and using timers to stay aware of time passing.",
    icon: Clock
  },
  social: {
    title: "The Social Connector",
    description: "You value relationships and often prioritize others, sometimes at the cost of your own schedule.",
    strategy: "Maintain your empathy while setting gentle boundaries, clearly communicating your schedule, and practicing graceful exits like 'I need to head out now.'",
    icon: Heart
  },
  overwhelmed: {
    title: "The Overwhelmed Juggler",
    description: "You juggle a lot and often feel scattered or mentally overloaded.",
    strategy: "Reduce cognitive load with simple planning tools, consistent routines, and focusing on one habit at a time.",
    icon: Brain
  },
  procrastinator: {
    title: "The Last-Minute Hustler",
    description: "You thrive under pressure but often start too late, causing stress.",
    strategy: "Use tiny first steps, accountability systems, and reward small wins to help you start earlier and keep momentum.",
    icon: AlarmClock
  }
};


interface PersonalityTestProps {
  onComplete: (personality: string) => void;
}

export default function PersonalityTest({ onComplete }: PersonalityTestProps) {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [personality, setPersonality] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const saveTestResult = async (personalityType: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/personality-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          personality: personalityType,
          answers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save test result');
      }
    } catch (error) {
      console.error('Error saving test result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate personality type
      const personalityCounts: Record<string, number> = {};
      Object.values(newAnswers).forEach(answer => {
        const option = questions.find(q => 
          q.options.some(opt => opt.value === answer)
        )?.options.find(opt => opt.value === answer);
        
        if (option) {
          personalityCounts[option.personality] = (personalityCounts[option.personality] || 0) + 1;
        }
      });

      const dominantPersonality = Object.entries(personalityCounts)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      setPersonality(dominantPersonality);
      
      // Save to database if user is logged in
      if (user) {
        await saveTestResult(dominantPersonality);
      }
      
      setShowResult(true);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const personalityInfo = personalityTypes[personality as keyof typeof personalityTypes];

  if (showResult && personalityInfo) {
    const IconComponent = personalityInfo.icon;
    return (
      <Card className="max-w-2xl mx-auto bg-gradient-card border-0 shadow-soft">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Your Lateness Personality: {personalityInfo.title}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {personalityInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-primary">Your Personalized Strategy:</h4>
            <p className="text-muted-foreground">{personalityInfo.strategy}</p>
          </div>
          {user && (
            <p className="text-sm text-muted-foreground">
              ✅ Your results have been saved to your profile
            </p>
          )}
          <Button 
            onClick={() => onComplete(personality)} 
            variant="hero" 
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Start Building Better Habits"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-gradient-card border-0 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl">Discover Your Lateness Style</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {questions[currentQuestion].question}
          </h3>
          <RadioGroup onValueChange={handleAnswer} className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}