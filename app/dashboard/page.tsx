import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format, startOfDay, endOfDay } from "date-fns"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { HabitsList } from "@/components/habits/habits-list"
import { DailyFeedbackForm } from "@/components/feedback/daily-feedback-form"
import { ProgressOverview } from "@/components/dashboard/progress-overview"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  // Fetch user's habits
  const habits = await prisma.habit.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    include: {
      entries: {
        where: {
          date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  // Fetch today's feedback
  const todayFeedback = await prisma.dailyFeedback.findFirst({
    where: {
      userId: session.user.id,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  })

  // Calculate completion stats
  const totalHabits = habits.length
  const completedHabits = habits.filter(habit => 
    habit.entries.some(entry => entry.completed)
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good {getTimeOfDay()}, {session.user.name || 'there'}!
          </h1>
          <p className="text-gray-600">
            {format(today, 'EEEE, MMMM do, yyyy')}
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressOverview 
          totalHabits={totalHabits}
          completedHabits={completedHabits}
        />

        {/* Today's Habits */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Today's Habits
            </h2>
            <a 
              href="/habits/new"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              + Add Habit
            </a>
          </div>
          
          <HabitsList habits={habits} userId={session.user.id} />
        </div>

        {/* Daily Feedback */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Daily Reflection
          </h2>
          <DailyFeedbackForm 
            userId={session.user.id}
            existingFeedback={todayFeedback}
          />
        </div>
      </main>
    </div>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
