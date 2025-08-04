import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, mood } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Use upsert to create or update today's feedback
    const feedback = await prisma.feedback.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today
        }
      },
      update: {
        content,
        mood: mood || null
      },
      create: {
        userId: session.user.id,
        date: today,
        content,
        mood: mood || null
      }
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}