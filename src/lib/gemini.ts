import { GoogleGenAI } from "@google/genai"

let geminiClient: GoogleGenAI | null = null
let geminiInitError: string | null = null

export function getGeminiClient(): GoogleGenAI | null {
  if (geminiInitError) return null
  if (geminiClient) return geminiClient
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    geminiInitError = "GEMINI_API_KEY not set"
    console.error("[Gemini] GEMINI_API_KEY environment variable is not set")
    return null
  }
  if (!apiKey.startsWith("AIza") && !apiKey.startsWith("AQ.")) {
    console.warn("[Gemini] API key has unusual format (doesn't start with AIza... or AQ...)")
  }
  try {
    geminiClient = new GoogleGenAI({ apiKey })
    console.log("[Gemini] Client initialized successfully")
    return geminiClient
  } catch (e) {
    geminiInitError = String(e)
    console.error("[Gemini] Failed to initialize client:", e)
    return null
  }
}

export function isGeminiAvailable(): boolean {
  const available = !!process.env.GEMINI_API_KEY
  console.log(`[Gemini] isGeminiAvailable: ${available} (key ${process.env.GEMINI_API_KEY ? "present" : "missing"})`)
  return available
}

const SYSTEM_PROMPT = `You are an elite human writing specialist. Your ONLY job is to rewrite AI-generated text so it sounds like a real person wrote it naturally.

## Core Mission
Transform robotic, stiff, or AI-sounding text into authentic human prose. The output must be INDISTINGUISHABLE from text written by a skilled human writer.

## Mandatory Rules
1. RESTRUCTURE every sentence — never keep original sentence structure
2. REMOVE all AI-sounding patterns, formal markers, and robotic phrasing
3. VARY sentence length — mix short punchy sentences with longer flowing ones
4. ADD natural imperfections — occasional sentence fragments, colloquialisms, varied punctuation
5. PRESERVE all meaning, facts, names, URLs, code blocks, and markdown exactly
6. NEVER summarize or shorten — keep all information from the original
7. NEVER add meta-commentary like "I've rewritten this" or "Here's your text"
8. NEVER copy-paste the original — every sentence must be rewritten
9. MATCH the requested mode (academic/casual/etc.) and tone (formal/friendly/etc.)
10. Return ONLY the rewritten text — no explanations, no notes, no prefixes`

const MODE_PROMPTS: Record<string, string> = {
  standard: "Write in a clear, balanced, natural style for general audiences. Avoid jargon.",
  academic: "Use formal academic language with proper scholarly tone. Maintain rigor while sounding human.",
  professional: "Use polished professional language. Authoritative but not robotic.",
  casual: "Write in a relaxed, conversational style. Use everyday language, contractions, and natural flow.",
  creative: "Use vivid, engaging language. Be expressive and original while staying true to the content.",
  student: "Write at an appropriate student level. Clear, educational, and naturally thoughtful.",
  blog: "Write in an engaging blog style. Conversational, personal, and informative with natural rhythm.",
  business: "Use professional business language. Clear, direct, and confident without being stiff.",
}

const TONE_PROMPTS: Record<string, string> = {
  natural: "Sound like a real person — authentic, unforced, genuine.",
  friendly: "Be warm, approachable, and genuinely friendly. Use natural warmth.",
  formal: "Maintain professional formality without sounding like a template.",
  confident: "Project quiet confidence and authority. Not arrogant, just assured.",
  persuasive: "Use compelling, persuasive language while maintaining credibility and warmth.",
  conversational: "Write as if speaking to a friend in a natural conversation.",
}

export async function humanizeWithGemini(
  text: string,
  options: {
    mode: string
    tone: string
    intensity: number
    creativity: number
    preserveKeywords: boolean
    preserveFormatting: boolean
    keepParagraphStructure: boolean
  }
): Promise<string | null> {
  const client = getGeminiClient()
  if (!client) {
    console.error("[Gemini] No client available; reason:", geminiInitError || "unknown")
    return null
  }

  try {
    const modeInstruction = MODE_PROMPTS[options.mode] || MODE_PROMPTS.standard
    const toneInstruction = TONE_PROMPTS[options.tone] || TONE_PROMPTS.natural

    const userPrompt = `Rewrite this text so it sounds 100% human-written. Completely restructure sentences, vary the rhythm, and eliminate every trace of AI generation.

Writing Mode: "${options.mode}"
Mode Instruction: ${modeInstruction}

Tone: "${options.tone}"
Tone Instruction: ${toneInstruction}

Transformation Intensity: ${options.intensity}/100 (higher = more aggressive rewriting)
Creativity Level: ${options.creativity}/100 (higher = more diverse vocabulary and structure)
${options.preserveKeywords ? "CRITICAL: Preserve these exact keywords and domain terms: they must appear in the output." : ""}
${options.preserveFormatting ? "Preserve the original formatting (headings, lists, quotes) but rewrite the text within them." : ""}
${options.keepParagraphStructure ? "Keep the same number of paragraphs but rewrite the content in each one." : ""}

BEGIN TEXT TO REWRITE:
${text}

END TEXT

Rewrite it now. Return ONLY the rewritten text. Every sentence must be different from the original. Never prefix or suffix with any explanation.`

    const startTime = Date.now()
    console.log(`[Gemini] Sending request to gemini-2.0-flash with mode=${options.mode}, tone=${options.tone}, intensity=${options.intensity}, creativity=${options.creativity}`)
    console.log(`[Gemini] Prompt length: ${userPrompt.length} chars, text length: ${text.length} chars`)

    const result = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: Math.max(0.3, options.creativity / 100),
        maxOutputTokens: 8192,
        topP: 0.95,
        topK: 40,
        frequencyPenalty: 0.3,
        presencePenalty: 0.3,
      },
    })

    const elapsed = Date.now() - startTime
    const responseText = result.text
    if (!responseText) {
      console.error("[Gemini] Empty response from API")
      return null
    }

    console.log(`[Gemini] Response received in ${elapsed}ms. Length: ${responseText.length} chars`)
    console.log(`[Gemini] Response preview: ${responseText.slice(0, 200)}...`)

    return responseText.trim()
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    const status = "status" in err ? (err as { status: unknown }).status : "unknown"
    console.error(`[Gemini] API call failed. Status: ${status}. Message: ${err.message}`)
    throw err
  }
}
