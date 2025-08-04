import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: habitId } = await params
    
    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id
      }
    })

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if entry exists for today
    const existingEntry = await prisma.habitEntry.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: today
        }
      }
    })

    if (existingEntry) {
      // Update existing entry
      const updatedEntry = await prisma.habitEntry.update({
        where: {
          id: existingEntry.id
        },
        data: {
          completed: !existingEntry.completed
        }
      })
      return NextResponse.json(updatedEntry)
    } else {
      // Create new entry
      const newEntry = await prisma.habitEntry.create({
        data: {
          habitId,
          date: today,
          completed: true
        }
      })
      return NextResponse.json(newEntry)
    }
  } catch (error) {
    console.error("Error toggling habit:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}