import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Target, 
  Flame, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  Settings
} from "lucide-react";

interface TimeSlot {
  id: string;
  name: string;
  targetTime: string;
  preparationTime: string;
  frequency: string;
  description?: string;
}

interface DashboardProps {
  personality: string;
  selectedSlot: TimeSlot;
  onShowFeedback: () => void;
  onSettings: () => void;
}

export default function Dashboard({ personality, selectedSlot, onShowFeedback, onSettings }: DashboardProps) {
  const [currentStreak, setCurrentStreak] = useState(3);
  const [todayStatus, setTodayStatus] = useState<'pending' | 'success' | 'late'>('pending');
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    // Calculate time until next target
    const updateTimeUntil = () => {
      if (!selectedSlot.targetTime) return;
      
      const now = new Date();
      const [hours, minutes] = selectedSlot.targetTime.split(':').map(Number);
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);
      
      // If target time has passed today, set for tomorrow
      if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const timeDiff = targetTime.getTime() - now.getTime();
      const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilNext(`${hoursUntil}h ${minutesUntil}m`);
    };
    
    updateTimeUntil();
    const interval = setInterval(updateTimeUntil, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [selectedSlot.targetTime]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'late': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'late': return AlertCircle;
      default: return Clock;
    }
  };

  const weekProgress = 5; // Mock data - 5 out of 7 days successful
  const monthProgress = 22; // Mock data - 22 out of 30 days successful

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You're working on: <span className="font-medium text-foreground">{selectedSlot.name}</span>
          </p>
        </div>
        <Button variant="outline" onClick={onSettings}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Current Focus & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Status */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              Today's Status
              <Badge variant={getStatusColor(todayStatus)}>
                {todayStatus === 'pending' ? 'In Progress' : 
                 todayStatus === 'success' ? 'On Time!' : 'Late'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {React.createElement(getStatusIcon(todayStatus), { 
                className: `w-8 h-8 ${todayStatus === 'success' ? 'text-success' : 
                                      todayStatus === 'late' ? 'text-destructive' : 'text-muted-foreground'}` 
              })}
              <div>
                <p className="font-medium">{selectedSlot.name}</p>
                <p className="text-sm text-muted-foreground">Target: {selectedSlot.targetTime}</p>
                {timeUntilNext && todayStatus === 'pending' && (
                  <p className="text-sm text-primary font-medium">Next in: {timeUntilNext}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{currentStreak}</div>
              <p className="text-sm text-muted-foreground">consecutive days</p>
              <div className="mt-3 flex justify-center">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full mx-1 ${
                      i < currentStreak ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              Quick Action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setTodayStatus('success')}
              variant="success" 
              className="w-full"
              disabled={todayStatus === 'success'}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as On Time
            </Button>
            <Button 
              onClick={onShowFeedback} 
              variant="outline" 
              className="w-full"
            >
              Give Feedback
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Progress Overview
          </CardTitle>
          <CardDescription>Your punctuality journey over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This Week */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">This Week</span>
                <span className="text-sm text-muted-foreground">{weekProgress}/7 days</span>
              </div>
              <Progress value={(weekProgress / 7) * 100} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((weekProgress / 7) * 100)}% success rate
              </p>
            </div>

            {/* This Month */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">This Month</span>
                <span className="text-sm text-muted-foreground">{monthProgress}/30 days</span>
              </div>
              <Progress value={(monthProgress / 30) * 100} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((monthProgress / 30) * 100)}% success rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Preparation Reminder */}
            <div className="flex items-center justify-between p-3 bg-warning-light rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium">Preparation Time</p>
                  <p className="text-sm text-muted-foreground">
                    Start preparing {selectedSlot.preparationTime} minutes before {selectedSlot.name}
                  </p>
                </div>
              </div>
              <Badge variant="outline">30 min before</Badge>
            </div>

            {/* Final Reminder */}
            <div className="flex items-center justify-between p-3 bg-success-light rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium">Final Check</p>
                  <p className="text-sm text-muted-foreground">
                    Time to go for {selectedSlot.name}
                  </p>
                </div>
              </div>
              <Badge variant="outline">5 min before</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}