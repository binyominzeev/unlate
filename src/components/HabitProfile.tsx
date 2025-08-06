import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, X, Calendar } from "lucide-react";

interface TimeSlot {
  id: string;
  name: string;
  targetTime: string;
  preparationTime: string;
  frequency: string;
  description?: string;
}

interface HabitProfileProps {
  personality: string;
  onComplete: (profile: { timeSlots: TimeSlot[], selectedSlot: TimeSlot }) => void;
}

const commonTimeSlots = [
  { name: "Morning Prayer", icon: "🕌", category: "spiritual" },
  { name: "Afternoon Prayer", icon: "🕌", category: "spiritual" },
  { name: "Going to Bed", icon: "🛏️", category: "personal" },
  { name: "Work Start", icon: "💼", category: "work" },
  { name: "Meetings", icon: "📅", category: "work" },
  { name: "Gym/Exercise", icon: "🏃", category: "health" },
  { name: "Family Dinner", icon: "🍽️", category: "family" },
  { name: "School/Classes", icon: "📚", category: "education" }
];

export default function HabitProfile({ personality, onComplete }: HabitProfileProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedForFocus, setSelectedForFocus] = useState<TimeSlot | null>(null);
  const [customSlot, setCustomSlot] = useState({
    name: "",
    targetTime: "",
    preparationTime: "30",
    frequency: "daily",
    description: ""
  });

  const addTimeSlot = (name: string, isCustom = false) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      name: isCustom ? customSlot.name : name,
      targetTime: isCustom ? customSlot.targetTime : "",
      preparationTime: isCustom ? customSlot.preparationTime : "30",
      frequency: isCustom ? customSlot.frequency : "daily",
      description: isCustom ? customSlot.description : ""
    };
    
    setTimeSlots([...timeSlots, newSlot]);
    
    if (isCustom) {
      setCustomSlot({
        name: "",
        targetTime: "",
        preparationTime: "30", 
        frequency: "daily",
        description: ""
      });
      setShowCustomForm(false);
    }
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    if (selectedForFocus?.id === id) {
      setSelectedForFocus(null);
    }
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
    
    if (selectedForFocus?.id === id) {
      setSelectedForFocus({ ...selectedForFocus, [field]: value });
    }
  };

  const handleStart = () => {
    if (selectedForFocus && timeSlots.length > 0) {
      onComplete({ timeSlots, selectedSlot: selectedForFocus });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            When Are You Usually Late?
          </CardTitle>
          <CardDescription>
            Let's identify the situations where you struggle with punctuality. We'll start with one and build from there.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common Time Slots */}
          <div>
            <h4 className="font-medium mb-3">Common Situations:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commonTimeSlots.map((slot) => (
                <Button
                  key={slot.name}
                  variant="outline"
                  onClick={() => addTimeSlot(slot.name)}
                  className="h-auto p-3 flex flex-col items-center gap-2"
                  disabled={timeSlots.some(ts => ts.name === slot.name)}
                >
                  <span className="text-2xl">{slot.icon}</span>
                  <span className="text-xs text-center">{slot.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Time Slot */}
          <div>
            <Button
              variant="outline"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Situation
            </Button>
            
            {showCustomForm && (
              <Card className="mt-4 border-dashed">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-name">Situation Name</Label>
                      <Input
                        id="custom-name"
                        value={customSlot.name}
                        onChange={(e) => setCustomSlot({...customSlot, name: e.target.value})}
                        placeholder="e.g., Weekend plans"
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-frequency">Frequency</Label>
                      <Select value={customSlot.frequency} onValueChange={(value) => 
                        setCustomSlot({...customSlot, frequency: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="weekdays">Weekdays</SelectItem>
                          <SelectItem value="weekends">Weekends</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="custom-description">Description (Optional)</Label>
                    <Textarea
                      id="custom-description"
                      value={customSlot.description}
                      onChange={(e) => setCustomSlot({...customSlot, description: e.target.value})}
                      placeholder="Any specific details about this situation..."
                      rows={2}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => addTimeSlot("", true)}
                    disabled={!customSlot.name}
                    className="w-full"
                  >
                    Add This Situation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Time Slots */}
      {timeSlots.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Your Situations</CardTitle>
            <CardDescription>
              Configure each situation and choose which one to focus on first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeSlots.map((slot) => (
              <Card key={slot.id} className={`p-4 ${selectedForFocus?.id === slot.id ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{slot.name}</h4>
                    <Badge variant="secondary" className="mt-1">
                      {slot.frequency}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedForFocus?.id === slot.id ? "default" : "outline"}
                      onClick={() => setSelectedForFocus(slot)}
                    >
                      {selectedForFocus?.id === slot.id ? "Focus" : "Select"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTimeSlot(slot.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Time</Label>
                    <Input
                      type="time"
                      value={slot.targetTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'targetTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Preparation Time (minutes)</Label>
                    <Select 
                      value={slot.preparationTime}
                      onValueChange={(value) => updateTimeSlot(slot.id, 'preparationTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      {timeSlots.length > 0 && selectedForFocus && (
        <div className="flex justify-center">
          <Button 
            onClick={handleStart}
            variant="hero"
            size="lg"
            className="px-8"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Start with "{selectedForFocus.name}"
          </Button>
        </div>
      )}
    </div>
  );
}