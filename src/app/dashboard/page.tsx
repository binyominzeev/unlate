"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Habit {
  id: string
  title: string
  description?: string
  color: string
  isActive: boolean
  entries: {
    id: string
    date: string
    completed: boolean
    notes?: string
  }[]
}

interface Feedback {
  id: string
  date: string
  content: string
  mood?: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [todaysFeedback, setTodaysFeedback] = useState<Feedback | null>(null)
  const [feedbackContent, setFeedbackContent] = useState("")
  const [mood, setMood] = useState<number>(3)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }
    
    fetchData()
  }, [status, router])

  const fetchData = async () => {
    try {
      // Fetch habits
      const habitsResponse = await fetch("/api/habits")
      if (habitsResponse.ok) {
        const habitsData = await habitsResponse.json()
        setHabits(habitsData)
      }

      // Fetch today's feedback
      const feedbackResponse = await fetch("/api/feedback/today")
      if (feedbackResponse.ok) {
        const feedbackData = await feedbackResponse.json()
        setTodaysFeedback(feedbackData)
        if (feedbackData) {
          setFeedbackContent(feedbackData.content)
          setMood(feedbackData.mood || 3)
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/toggle`, {
        method: "POST",
      })
      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error toggling habit:", error)
    }
  }

  const saveFeedback = async () => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: feedbackContent,
          mood,
        }),
      })
      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error saving feedback:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const today = new Date().toISOString().split('T')[0]
  const completedToday = habits.reduce((count, habit) => {
    const todayEntry = habit.entries.find(entry => entry.date.startsWith(today))
    return todayEntry?.completed ? count + 1 : count
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Unlate</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session.user?.name || session.user?.username || session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Today&apos;s Progress</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {completedToday}/{habits.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Habits completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Active Habits</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{habits.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total habits</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Completion Rate</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Today</p>
          </div>
        </div>

        {/* Habits */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Habits</h2>
          </div>
          <div className="p-6">
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No habits yet. Start by creating your first habit!</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Add Habit
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => {
                  const todayEntry = habit.entries.find(entry => entry.date.startsWith(today))
                  const isCompleted = todayEntry?.completed || false

                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{habit.title}</h3>
                          {habit.description && (
                            <p className="text-sm text-gray-600">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-500"
                        }`}
                      >
                        {isCompleted && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Daily Feedback */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Daily Reflection</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling today? (1-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setMood(value)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                        mood === value
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Feedback
                </label>
                <textarea
                  id="feedback"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How did today go? What did you accomplish? What could be improved?"
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                />
              </div>
              <button
                onClick={saveFeedback}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {todaysFeedback ? "Update Feedback" : "Save Feedback"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}