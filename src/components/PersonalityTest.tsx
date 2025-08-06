import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Brain, Target } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; personality: string }[];
}

const questions: Question[] = [
  {
    id: "1",
    question: "When you're running late, what's your typical reaction?",
    options: [
      { value: "panic", label: "I panic and stress out", personality: "anxious" },
      { value: "rush", label: "I rush but stay focused", personality: "optimistic" },
      { value: "accept", label: "I accept it and move calmly", personality: "procrastinator" },
      { value: "blame", label: "I blame external factors", personality: "external" }
    ]
  },
  {
    id: "2", 
    question: "How do you typically estimate travel time?",
    options: [
      { value: "exact", label: "I calculate exact time needed", personality: "optimistic" },
      { value: "buffer", label: "I add extra buffer time", personality: "anxious" },
      { value: "hope", label: "I hope for the best case scenario", personality: "procrastinator" },
      { value: "forget", label: "I often forget to check", personality: "external" }
    ]
  },
  {
    id: "3",
    question: "What's your relationship with preparation?",
    options: [
      { value: "prepare", label: "I prepare everything in advance", personality: "anxious" },
      { value: "lastminute", label: "I do things at the last minute", personality: "procrastinator" },
      { value: "efficient", label: "I'm efficient but sometimes underestimate", personality: "optimistic" },
      { value: "distracted", label: "I get distracted by other things", personality: "external" }
    ]
  }
];

const personalityTypes = {
  anxious: {
    title: "The Worrier",
    description: "You know you'll be late and stress about it, but struggle with time management despite caring deeply.",
    strategy: "Gradual confidence building with plenty of buffer time and positive reinforcement.",
    icon: Brain
  },
  optimistic: {
    title: "The Optimist", 
    description: "You underestimate how long things take, always believing you can make it in time.",
    strategy: "Reality-based planning with gentle time tracking and realistic scheduling.",
    icon: Target
  },
  procrastinator: {
    title: "The Last-Minute Rush",
    description: "You work well under pressure but consistently leave things until the last possible moment.",
    strategy: "Early motivation triggers and breaking down preparation into smaller, manageable steps.",
    icon: Clock
  },
  external: {
    title: "The Externally Focused",
    description: "You get caught up in other people, tasks, or distractions, losing track of your own schedule.",
    strategy: "Boundary setting and environmental cues to maintain focus on your timeline.",
    icon: Target
  }
};

interface PersonalityTestProps {
  onComplete: (personality: string) => void;
}

export default function PersonalityTest({ onComplete }: PersonalityTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [personality, setPersonality] = useState<string>("");

  const handleAnswer = (value: string) => {
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
          <Button 
            onClick={() => onComplete(personality)} 
            variant="hero" 
            size="lg"
            className="w-full"
          >
            Start Building Better Habits
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