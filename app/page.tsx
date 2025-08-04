import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Target, TrendingUp, Users } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Unlate</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Never Be <span className="text-indigo-600">Late</span> on Your Habits
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build consistency, track progress, and achieve your goals with the productivity app 
            that keeps you accountable every single day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Building Habits
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                I Already Have an Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Daily Habit Tracking</h3>
            <p className="text-gray-600">
              Simple, intuitive habit tracking that fits into your daily routine. 
              Mark habits complete and build streaks.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
            <p className="text-gray-600">
              Visualize your progress with detailed analytics and insights. 
              See how far you've come and stay motivated.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Daily Reflection</h3>
            <p className="text-gray-600">
              Capture your thoughts and learnings with daily feedback entries. 
              Reflect on your journey and growth.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-indigo-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Better Habits?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Join thousands of people who are already building consistency with Unlate.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t mt-24">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Unlate. Built for consistency and growth.</p>
        </div>
      </footer>
    </div>
  )
}
