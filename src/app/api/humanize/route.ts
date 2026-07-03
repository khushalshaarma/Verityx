import { NextResponse } from "next/server"
import { humanizeText } from "@/lib/humanizer"
import { humanizeWithGemini, isGeminiAvailable } from "@/lib/gemini"
import { analyzeText, compareAnalyses } from "@/lib/analysis"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { HumanizerOptions } from "@/types"

export async function POST(req: Request) {
  const startTime = Date.now()
  const debug: Record<string, unknown> & { pipeline: string[] } = {
    pipeline: [] as string[],
    modelSelected: null,
    modelReason: null,
    geminiAvailable: null,
    geminiResponse: null,
    localResponse: null,
    apiKeyPresent: !!process.env.GEMINI_API_KEY,
    apiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 6) + "..." : "none",
  }

  try {
    const session = await getServerSession(authOptions)
    debug.sessionPresent = !!session

    const body = await req.json()
    const { text, options } = body as { text: string; options: HumanizerOptions }
    debug.inputLength = text?.length
    debug.requestedModel = options?.model

    if (!text || !options) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const beforeAnalysis = analyzeText(text)
    debug.beforeAnalysis = {
      humanScore: beforeAnalysis.humanScore,
      wordCount: beforeAnalysis.wordCount,
    }

    let humanizedText = text
    let modelUsed = "local"
    let geminiFailed = false

    // --- MODEL SELECTION ---
    const tryGemini = options.model === "gemini" || (options.model !== "local" && isGeminiAvailable())
    debug.geminiAvailable = isGeminiAvailable()

    let geminiError: string | null = null
    let geminiUsedThisRequest = false
    const MAX_ITERATIONS = 5

    async function humanizeOnce(inputText: string, iteration: number): Promise<{ text: string; model: string; failed: boolean }> {
      // Use Gemini only on the first iteration to save quota
      const shouldTryGemini = tryGemini && iteration === 0
      if (shouldTryGemini) {
        try {
          const geminiResult = await humanizeWithGemini(inputText, options)
          if (geminiResult) {
            geminiUsedThisRequest = true
            return { text: geminiResult, model: "gemini", failed: false }
          }
        } catch (e: unknown) {
          const err = e instanceof Error ? e : new Error(String(e))
          let friendly = err.message
          // Extract readable message from JSON error
          try {
            const parsed = JSON.parse(err.message)
            if (parsed?.error?.message) friendly = parsed.error.message
          } catch {}
          // Shorten common errors
          if (friendly.includes("quota") || friendly.includes("Quota")) {
            const retryMatch = friendly.match(/retry in ([\d.]+)s/)
            const retry = retryMatch ? ` (retry in ${retryMatch[1]}s)` : ""
            friendly = "Free tier quota exceeded" + retry
          }
          geminiError = friendly
          console.error(`[Route] Gemini error: ${friendly}`)
        }
        const localResult = humanizeText(inputText, options)
        return { text: localResult, model: "local", failed: true }
      }
      // Iteration > 0: always use local engine (preserve quota)
      return { text: humanizeText(inputText, options), model: "local", failed: false }
    }

    if (tryGemini) {
      debug.modelSelected = "gemini"
      debug.modelReason = options.model === "gemini"
        ? "User explicitly selected Gemini"
        : "Auto mode: Gemini available, trying Gemini first"
      debug.pipeline.push("select: gemini")
      console.log(`[Route] MODEL SELECTION: ${debug.modelReason}`)
    } else {
      const reason = options.model === "local"
        ? "User explicitly selected Local"
        : "Auto mode: Gemini not available (no/invalid key)"
      debug.modelSelected = "local"
      debug.modelReason = reason
      debug.pipeline.push("select: local")
      console.log(`[Route] MODEL SELECTION: ${reason}`)
    }

    // --- ITERATIVE HUMANIZATION LOOP ---
    let currentText = text
    let iterations = 0
    let finalAiProbability = 100
    const originalWordCount = text.split(/\s+/).length
    const MAX_WORD_GROWTH = 1.8 // never exceed 1.8x original word count

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      iterations++
      console.log(`[Route] Iteration ${i + 1}/${MAX_ITERATIONS}`)
      debug.pipeline.push(`iteration: ${i + 1}`)

      const result = await humanizeOnce(currentText, i)
      modelUsed = result.model
      geminiFailed = result.failed

      const wordCount = result.text.split(/\s+/).length
      const ratio = wordCount / originalWordCount
      console.log(`[Route] Iteration ${i + 1} done. Words: ${wordCount} (${ratio.toFixed(2)}x original). Model: ${result.model}`)

      // Safety: if word count blows up, stop iterating immediately
      if (ratio > MAX_WORD_GROWTH) {
        console.log(`[Route] Word count exceeded ${MAX_WORD_GROWTH}x original. Stopping iterations.`)
        debug.pipeline.push(`word-cap-reached: ${wordCount} words`)
        humanizedText = currentText // use previous iteration's output instead
        // But recalculate analysis on the previous output
        finalAiProbability = analyzeText(humanizedText).aiProbability
        break
      }

      const analysis = analyzeText(result.text)
      finalAiProbability = analysis.aiProbability

      if (finalAiProbability === 0) {
        humanizedText = result.text
        console.log(`[Route] Target reached (aiProbability=0) after ${i + 1} iterations`)
        debug.pipeline.push(`target-reached: iteration ${i + 1}`)
        break
      }

      currentText = result.text
      humanizedText = result.text
    }

    debug.iterations = iterations
    debug.finalAiProbability = finalAiProbability
    debug.geminiUsedThisRequest = geminiUsedThisRequest

    const afterAnalysis = analyzeText(humanizedText)
    const comparison = compareAnalyses(beforeAnalysis, afterAnalysis)

    const toneNames: Record<string, string> = {
      natural: "Natural and authentic",
      friendly: "Warm and friendly",
      formal: "Formal and professional",
      confident: "Confident and authoritative",
      persuasive: "Persuasive and compelling",
      conversational: "Conversational and engaging",
    }

    const toneAnalysis = `${toneNames[options.tone] || "Natural"} tone. Readability score: ${afterAnalysis.readability}/100. Vocabulary diversity: ${afterAnalysis.vocabulary}%.`

    if (session?.user?.id) {
      try {
        const { prisma: db } = await import("@/lib/prisma")
        await db.version.create({
          data: {
            userId: session.user.id,
            documentId: "temp-" + Date.now(),
            originalText: text.slice(0, 50000),
            humanizedText: humanizedText.slice(0, 50000),
            readability: afterAnalysis.readability,
            wordCount: afterAnalysis.wordCount,
            charCount: text.length,
            readingTime: afterAnalysis.readingTime,
            toneAnalysis,
            vocabularyDiversity: afterAnalysis.vocabulary,
            passiveVoice: afterAnalysis.passiveVoice,
            repetition: 0,
          },
        })
      } catch {}
    }

    const elapsed = Date.now() - startTime
    debug.elapsed = elapsed
    console.log(`[Route] COMPLETE in ${elapsed}ms. Model: ${modelUsed}. HumanScore: ${afterAnalysis.humanScore}. Iterations: ${iterations}. AI Prob: ${finalAiProbability}%`)

    return NextResponse.json({
      humanizedText,
      readability: afterAnalysis.readability,
      wordCount: afterAnalysis.wordCount,
      charCount: text.length,
      readingTime: afterAnalysis.readingTime,
      toneAnalysis,
      vocabularyDiversity: afterAnalysis.vocabulary,
      passiveVoice: afterAnalysis.passiveVoice,
      repetition: 0,
      modelUsed,
      geminiFailed,
      geminiError,
      iterations,
      aiProbability: finalAiProbability,
      analysis: {
        before: beforeAnalysis,
        after: afterAnalysis,
        comparison,
      },
      debug,
    })
  } catch (error) {
    const elapsed = Date.now() - startTime
    debug.elapsed = elapsed
    console.error("[Route] HUMANIZE ERROR:", error)
    return NextResponse.json(
      { message: "Failed to humanize text", debug },
      { status: 500 }
    )
  }
}


