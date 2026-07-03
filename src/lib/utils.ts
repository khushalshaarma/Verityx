import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function formatTime(minutes: number) {
  if (minutes < 1) return "< 1 min"
  return `${Math.ceil(minutes)} min read`
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function calculateWordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function calculateCharCount(text: string): number {
  return text.length
}

export function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1
  const words = text.split(/\s+/).filter(Boolean).length || 1
  const syllables = words
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.min(100, Math.max(0, Math.round(score)))
}

export function calculateVocabularyDiversity(text: string): number {
  const words = text.toLowerCase().match(/\b\w+\b/g)
  if (!words || words.length < 2) return 0
  const unique = new Set(words)
  return Math.round((unique.size / words.length) * 100)
}

export function calculatePassiveVoice(text: string): number {
  const passivePatterns = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi
  const matches = text.match(passivePatterns)
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1
  return Math.min(100, Math.round(((matches?.length || 0) / sentences) * 100))
}

export function calculateRepetition(text: string): number {
  const words = text.toLowerCase().match(/\b\w{3,}\b/g)
  if (!words || words.length < 5) return 0
  const freq: Record<string, number> = {}
  words.forEach((w) => (freq[w] = (freq[w] || 0) + 1))
  const repeated = Object.values(freq).filter((c) => c > 2).length
  return Math.min(100, Math.round((repeated / Object.keys(freq).length) * 100))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.substring(0, length) + "..."
}
