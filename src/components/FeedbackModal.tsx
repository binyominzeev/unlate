import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Clock, Zap } from "lucide-react";

interface FeedbackQuestion {
  id: string;
  question: string;
  type: 'multiple' | 'text';
  options?: { value: string; label: string; emoji?: string }[];
}

// AI-generated questions based on personality and recent patterns
const generateQuestions = (personality: string): FeedbackQuestion[] => {
  const baseQuestions = [
    {
      id: "success",
      question: "How did you feel about your timing today?",
      type: "multiple" as const,
      options: [
        { value: "great", label: "Felt great and confident", emoji: "😊" },
        { value: "okay", label: "Okay, but could be better", emoji: "😐" },
        { value: "stressed", label: "Stressed and rushed", emoji: "😰" },
        { value: "frustrated", label: "Frustrated with myself", emoji: "😤" }
      ]
    },
    {
      id: "challenge",
      question: "What was your biggest challenge today?",
      type: "multiple" as const,
      options: [
        { value: "preparation", label: "Taking too long to prepare", emoji: "⏱️" },
        { value: "distraction", label: "Got distracted by other things", emoji: "📱" },
        { value: "underestimate", label: "Underestimated travel time", emoji: "🚗" },
        { value: "motivation", label: "Lacked motivation to start early", emoji: "😴" }
      ]
    }
  ];

  // Personality-specific questions
  const personalityQuestions: Record<string, FeedbackQuestion> = {
    anxious: {
      id: "anxiety",
      question: "How well did you manage your time anxiety today?",
      type: "multiple",
      options: [
        { value: "calm", label: "Stayed calm and organized", emoji: "🧘" },
        { value: "worried", label: "Worried but pushed through", emoji: "😟" },
        { value: "overwhelmed", label: "Felt overwhelmed", emoji: "😵" }
      ]
    },
    optimistic: {
      id: "reality",
      question: "How realistic was your time planning today?",
      type: "multiple",
      options: [
        { value: "realistic", label: "Very realistic and accurate", emoji: "🎯" },
        { value: "close", label: "Close but still optimistic", emoji: "🤞" },
        { value: "unrealistic", label: "Too optimistic as usual", emoji: "🤗" }
      ]
    },
    procrastinator: {
      id: "start",
      question: "When did you start preparing compared to your plan?",
      type: "multiple",
      options: [
        { value: "early", label: "Started earlier than planned", emoji: "⚡" },
        { value: "ontime", label: "Started exactly when planned", emoji: "⏰" },
        { value: "late", label: "Started later than planned", emoji: "😅" }
      ]
    },
    external: {
      id: "focus",
      question: "How well did you maintain focus on your schedule?",
      type: "multiple",
      options: [
        { value: "focused", label: "Stayed focused throughout", emoji: "🎯" },
        { value: "distracted", label: "Got distracted a few times", emoji: "👀" },
        { value: "lost", label: "Lost track completely", emoji: "🤯" }
      ]
    }
  };

  return [
    ...baseQuestions,
    personalityQuestions[personality] || baseQuestions[0]
  ];
};

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  personality: string;
  onSubmit: (feedback: any) => void;
}

export default function FeedbackModal({ isOpen, onClose, personality, onSubmit }: FeedbackModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [textFeedback, setTextFeedback] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const questions = generateQuestions(personality);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setIsComplete(true);
    }
  };

  const handleSubmit = () => {
    const feedbackData = {
      personality,
      answers,
      textFeedback,
      timestamp: new Date().toISOString()
    };
    
    onSubmit(feedbackData);
    onClose();
    
    // Reset for next time
    setCurrentQuestion(0);
    setAnswers({});
    setTextFeedback("");
    setIsComplete(false);
  };

  const currentQ = questions[currentQuestion];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Quick Feedback
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= currentQuestion ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Card className="border-dashed">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{currentQ.question}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentQ.type === 'multiple' && currentQ.options ? (
                  <RadioGroup
                    onValueChange={(value) => handleAnswer(currentQ.id, value)}
                    className="space-y-3"
                  >
                    {currentQ.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label 
                          htmlFor={option.value} 
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          {option.emoji && <span className="text-lg">{option.emoji}</span>}
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div>
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={textFeedback}
                      onChange={(e) => setTextFeedback(e.target.value)}
                      rows={4}
                    />
                    <Button
                      onClick={() => handleAnswer(currentQ.id, textFeedback)}
                      className="mt-3"
                      disabled={!textFeedback.trim()}
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center">
              <ThumbsUp className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Thanks for your feedback!</h3>
              <p className="text-muted-foreground">
                Your insights help us personalize your experience and improve your success rate.
              </p>
            </div>

            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Want to add more details?</h4>
                <Textarea
                  placeholder="Any additional thoughts, challenges, or suggestions..."
                  value={textFeedback}
                  onChange={(e) => setTextFeedback(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Skip for now
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}