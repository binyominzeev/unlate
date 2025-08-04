import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function getStreakDays(entries: Array<{ date: Date; completed: boolean }>): number {
  if (!entries.length) return 0
  
  const sortedEntries = entries
    .filter(entry => entry.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  
  if (!sortedEntries.length) return 0
  
  let streak = 0
  let currentDate = new Date()
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date)
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
      currentDate = entryDate
    } else {
      break
    }
  }
  
  return streak
}

export function calculateCompletionRate(
  entries: Array<{ completed: boolean }>,
  totalDays: number
): number {
  if (totalDays === 0) return 0
  const completedDays = entries.filter(entry => entry.completed).length
  return Math.round((completedDays / totalDays) * 100)
}
