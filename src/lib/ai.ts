import type { HumanizerOptions, HumanizerResult } from "@/types"

export async function humanizeText(
  text: string,
  options: HumanizerOptions
): Promise<HumanizerResult> {
  const response = await fetch("/api/humanize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, options }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to humanize text")
  }

  return response.json()
}
