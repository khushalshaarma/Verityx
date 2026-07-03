export interface TextAnalysis {
  humanScore: number
  aiProbability: number
  readability: number
  sentenceVariety: number
  passiveVoice: number
  vocabulary: number
  wordCount: number
  readingTime: number
  changes: string[]
}

export function analyzeText(text: string): TextAnalysis {
  const words = text.match(/\b\w+\b/g) || []
  const sentences = text.split(/[.!?]+/).filter(Boolean)
  const wordCount = words.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const readability = calculateFleschScore(text)
  const vocabulary = calculateVocabularyDiversity(words)
  const passiveVoice = calculatePassiveVoice(text, sentences.length)
  const sentenceVariety = calculateSentenceVariety(sentences)
  const aiProbability = calculateAiProbability(text, words, sentences)

  const humanScore = Math.max(0, Math.min(100,
    Math.round(
      (readability * 0.15) +
      ((100 - aiProbability) * 0.35) +
      (vocabulary * 0.15) +
      (sentenceVariety * 0.15) +
      ((100 - passiveVoice) * 0.1) +
      15
    )
  ))

  return {
    humanScore,
    aiProbability,
    readability,
    sentenceVariety,
    passiveVoice,
    vocabulary,
    wordCount,
    readingTime,
    changes: [],
  }
}

function calculateFleschScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1
  const words = text.split(/\s+/).filter(Boolean).length || 1
  const syllables = words
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.min(100, Math.max(0, Math.round(score)))
}

function calculateVocabularyDiversity(words: string[]): number {
  if (words.length < 2) return 0
  const unique = new Set(words.map((w) => w.toLowerCase()))
  return Math.min(100, Math.round((unique.size / words.length) * 100))
}

function calculatePassiveVoice(text: string, sentenceCount: number): number {
  const passivePatterns = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi
  const matches = text.match(passivePatterns)
  return Math.min(100, Math.round(((matches?.length || 0) / Math.max(1, sentenceCount)) * 100))
}

function calculateSentenceVariety(sentences: string[]): number {
  if (sentences.length < 2) return 50
  const lengths = sentences.map((s) => s.split(/\s+/).length)
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length
  const stdDev = Math.sqrt(variance)
  const idealStdDev = avg * 0.4
  const variety = Math.min(100, Math.max(0, Math.round((stdDev / idealStdDev) * 100)))
  return variety
}

const AI_PATTERNS_CHECK = [
  /\bas an AI\b/i,
  /\bas a language model\b/i,
  /\bI don't have personal\b/i,
  /\bI cannot\b/i,
  /\bit is important to note\b/i,
  /\bit is worth mentioning\b/i,
  /\bit should be noted\b/i,
  /\bin order to\b/i,
  /\bdue to the fact that\b/i,
  /\bin the event that\b/i,
  /\bfor the purpose of\b/i,
  /\bwith regard to\b/i,
  /\bwith respect to\b/i,
  /\b(the )?utilization of\b/i,
  /\bfurthermore\b/i,
  /\bmoreover\b/i,
  /\bnevertheless\b/i,
  /\bnotwithstanding\b/i,
  /\bherein\b/i,
  /\bhereby\b/i,
  /\btherein\b/i,
  /\bthereby\b/i,
  /\baforementioned\b/i,
  /\bcommence\b/i,
  /\bterminate\b/i,
  /\bendeavor\b/i,
  /\bpivotal role\b/i,
  /\btestament to\b/i,
  /\bin the realm of\b/i,
  /\bin the context of\b/i,
  /\bfirst and foremost\b/i,
  /\blast but not least\b/i,
  /\bin today's digital age\b/i,
  /\bin this modern era\b/i,
  /\ba significant number of\b/i,
  /\bthe majority of\b/i,
  /\bplaying a (pivotal|crucial) role\b/i,
  /\bserves as a\b/i,
]

function calculateAiProbability(text: string, words: string[], sentences: string[]): number {
  let score = 0

  for (const pattern of AI_PATTERNS_CHECK) {
    if (pattern.test(text)) {
      score += 5
    }
  }

  if (words.length > 0) {
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length
    if (avgWordLength > 6) score += 5
    if (avgWordLength > 7) score += 5
  }

  if (sentences.length > 0) {
    const avgSentenceLength = words.length / sentences.length
    if (avgSentenceLength > 25) score += 5
    if (avgSentenceLength > 30) score += 5
  }

  const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
  const diversity = uniqueWords.size / Math.max(1, words.length)
  if (diversity < 0.4) score += 10
  if (diversity < 0.3) score += 10

  return Math.min(100, Math.round(score))
}

export function compareAnalyses(before: TextAnalysis, after: TextAnalysis) {
  return {
    humanScore: { before: before.humanScore, after: after.humanScore, change: after.humanScore - before.humanScore },
    aiProbability: { before: before.aiProbability, after: after.aiProbability, change: after.aiProbability - before.aiProbability },
    readability: { before: before.readability, after: after.readability, change: after.readability - before.readability },
    sentenceVariety: { before: before.sentenceVariety, after: after.sentenceVariety, change: after.sentenceVariety - before.sentenceVariety },
    passiveVoice: { before: before.passiveVoice, after: after.passiveVoice, change: after.passiveVoice - before.passiveVoice },
    vocabulary: { before: before.vocabulary, after: after.vocabulary, change: after.vocabulary - before.vocabulary },
    wordCount: { before: before.wordCount, after: after.wordCount, change: after.wordCount - before.wordCount },
    readingTime: { before: before.readingTime, after: after.readingTime, change: after.readingTime - before.readingTime },
  }
}
