import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function GET() {
  const results: Record<string, unknown>[] = []
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 400 })
  }

  results.push({ step: "API key found", prefix: apiKey.slice(0, 8) + "...", length: apiKey.length })

  let client: GoogleGenAI
  try {
    client = new GoogleGenAI({ apiKey })
    results.push({ step: "Client created", success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    results.push({ step: "Client creation failed", error: msg })
    return NextResponse.json({ results })
  }

  // Test 1: Simple ping with gemini-2.0-flash
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"]
  for (const model of models) {
    try {
      const result = await client.models.generateContent({
        model,
        contents: "Say exactly: HELLO_WORLD_SUCCESS and nothing else.",
        config: {
          maxOutputTokens: 100,
          temperature: 0,
        },
      })
      results.push({
        step: `Test ${model}`,
        success: true,
        response: result.text?.trim().slice(0, 100),
      })
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e))
      results.push({
        step: `Test ${model}`,
        success: false,
        error: err.message,
        status: "status" in err ? (err as { status: unknown }).status : undefined,
        details: "cause" in err ? String((err as { cause: unknown }).cause) : undefined,
      })
    }
  }

  // Test 2: With system instruction (our actual use case)
  try {
    const result = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: "Rewrite this: Hello world, this is a test." }] }],
      config: {
        systemInstruction: "You rewrite text to sound more human.",
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    })
    results.push({
      step: "With systemInstruction",
      success: true,
      response: result.text?.trim().slice(0, 100),
    })
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e))
    results.push({
      step: "With systemInstruction",
      success: false,
      error: err.message,
    })
  }

  return NextResponse.json({ results })
}
