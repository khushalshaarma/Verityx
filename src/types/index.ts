export type WritingMode =
  | "standard"
  | "academic"
  | "professional"
  | "casual"
  | "creative"
  | "student"
  | "blog"
  | "business"

export type ToneOption =
  | "natural"
  | "friendly"
  | "formal"
  | "confident"
  | "persuasive"
  | "conversational"

export interface HumanizerOptions {
  mode: WritingMode
  tone: ToneOption
  intensity: number
  creativity: number
  preserveKeywords: boolean
  preserveFormatting: boolean
  keepParagraphStructure: boolean
  model?: "auto" | "gemini" | "local"
}

export interface TextAnalysis {
  humanScore: number
  aiProbability: number
  readability: number
  sentenceVariety: number
  passiveVoice: number
  vocabulary: number
  wordCount: number
  readingTime: number
}

export interface CompareResult {
  humanScore: { before: number; after: number; change: number }
  aiProbability: { before: number; after: number; change: number }
  readability: { before: number; after: number; change: number }
  sentenceVariety: { before: number; after: number; change: number }
  passiveVoice: { before: number; after: number; change: number }
  vocabulary: { before: number; after: number; change: number }
  wordCount: { before: number; after: number; change: number }
  readingTime: { before: number; after: number; change: number }
}

export interface HumanizerResult {
  humanizedText: string
  readability: number
  wordCount: number
  charCount: number
  readingTime: number
  toneAnalysis: string
  vocabularyDiversity: number
  passiveVoice: number
  repetition: number
  modelUsed?: string
  geminiFailed?: boolean
  geminiError?: string | null
  iterations?: number
  aiProbability?: number
  analysis?: {
    before: TextAnalysis
    after: TextAnalysis
    comparison: CompareResult
  }
}

export interface ProgressStep {
  label: string
  status: "pending" | "active" | "complete"
}

export interface DocumentHistory {
  id: string
  originalText: string
  humanizedText: string
  readability: number
  wordCount: number
  charCount: number
  readingTime: number
  toneAnalysis: string
  createdAt: Date
}

export interface SavedDoc {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  credits: number
  defaultModel?: string
}

export type Theme = "dark" | "light" | "system"

export interface DashboardStats {
  totalWords: number
  documents: number
  averageHumanScore: number
  averageReadability: number
  geminiRequests: number
  localRequests: number
  creditsUsed: number
  weeklyUsage: { day: string; requests: number }[]
  humanScoreTrend: { date: string; score: number }[]
  wordsHumanized: { date: string; words: number }[]
  readabilityTrend: { date: string; score: number }[]
}
