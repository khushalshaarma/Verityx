type HumanizerOptions = {
  mode: string
  tone: string
  intensity: number
  creativity: number
  preserveKeywords: boolean
  preserveFormatting: boolean
  keepParagraphStructure: boolean
}

// Natural word swaps — everyday human vocabulary, not thesaurus bombs
const SYNONYM_GROUPS: [string, string[]][] = [
  ["very", ["really", "pretty", "quite", "especially", "extremely"]],
  ["important", ["key", "big", "major", "essential", "vital"]],
  ["big", ["large", "major", "significant", "substantial", "sizable"]],
  ["good", ["great", "excellent", "solid", "fine", "strong"]],
  ["bad", ["poor", "weak", "tough", "rough", "unfortunate"]],
  ["thing", ["part", "aspect", "piece", "element", "factor"]],
  ["way", ["approach", "method", "technique", "means", "strategy"]],
  ["change", ["adjust", "shift", "alter", "modify", "revise"]],
  ["help", ["assist", "support", "aid", "benefit", "improve"]],
  ["show", ["demonstrate", "reveal", "indicate", "highlight", "illustrate"]],
  ["think", ["believe", "feel", "consider", "reckon", "figure"]],
  ["know", ["understand", "realize", "recognize", "tell", "see"]],
  ["get", ["obtain", "gain", "secure", "land", "score"]],
  ["make", ["create", "build", "develop", "form", "generate"]],
  ["need", ["require", "call for", "demand", "necessitate"]],
  ["try", ["attempt", "aim", "strive", "seek", "work on"]],
  ["use", ["employ", "apply", "leverage", "deploy", "run"]],
  ["start", ["begin", "launch", "initiate", "kick off", "get going"]],
  ["end", ["finish", "conclude", "wrap up", "complete", "close"]],
  ["explain", ["clarify", "describe", "break down", "spell out", "go over"]],
  ["improve", ["enhance", "boost", "strengthen", "upgrade", "refine"]],
  ["different", ["distinct", "unique", "varied", "diverse", "contrasting"]],
  ["difficult", ["hard", "tough", "challenging", "tricky", "demanding"]],
  ["easy", ["simple", "straightforward", "painless", "effortless"]],
  ["many", ["lots of", "plenty of", "numerous", "countless", "various"]],
  ["new", ["fresh", "modern", "recent", "current", "up-to-date"]],
  ["quick", ["fast", "rapid", "swift", "speedy", "sudden"]],
  ["slow", ["gradual", "steady", "unhurried", "leisurely"]],
  ["tell", ["inform", "share", "advise", "fill in", "brief"]],
  ["ask", ["inquire", "request", "pose", "raise", "seek"]],
  ["answer", ["respond", "reply", "address", "get back to"]],
  ["happen", ["occur", "take place", "transpire", "come up", "arise"]],
  ["cause", ["lead to", "result in", "prompt", "trigger", "spark", "bring about"]],
  ["provide", ["offer", "supply", "deliver", "give", "furnish"]],
  ["focus", ["concentrate on", "center on", "target", "zero in on"]],
  ["part", ["component", "piece", "element", "segment", "portion"]],
  ["result", ["outcome", "effect", "consequence", "byproduct"]],
  ["goal", ["objective", "aim", "target", "purpose", "intention"]],
  ["benefit", ["advantage", "plus", "upside", "value", "gain"]],
  ["problem", ["issue", "challenge", "difficulty", "drawback", "hurdle"]],
  ["opportunity", ["chance", "opening", "possibility", "option", "shot"]],
  ["experience", ["background", "track record", "history", "know-how"]],
  ["understanding", ["grasp", "insight", "awareness", "familiarity", "knowledge"]],
]

// AI phrases flagged by detectors — convert to human equivalents
const AI_PHRASES_FULL: [RegExp, string][] = [
  [/\b(with that being said|that being said|having said that)\b/gi, "That said"],
  [/\b(all things considered)\b/gi, "Overall"],
  [/\b(in essence)\b/gi, "Essentially"],
  [/\b(to put it simply|simply put)\b/gi, "In short"],
  [/\b(as previously mentioned|as mentioned earlier|as stated above)\b/gi, "As I noted"],
  [/\b(the aforementioned)\b/gi, "this"],
  [/\b(in conclusion|to conclude)\b/gi, "So"],
  [/\b(to summarize|in summary)\b/gi, "To sum up"],
  [/\b(it goes without saying that)\b/gi, ""],
  [/\b(needless to say)\b/gi, ""],
  [/\b(last but not least)\b/gi, "Finally"],
  [/\b(first and foremost)\b/gi, "First"],
  [/\b(in today's digital age|in today's world)\b/gi, "Today"],
  [/\b(in this modern era)\b/gi, "Now"],
  [/\b(the landscape of)\b/gi, ""],
  [/\b(in the realm of)\b/gi, "in"],
  [/\b(when it comes to)\b/gi, "For"],
  [/\b(in the context of)\b/gi, "in"],
  [/\b(on the subject of|on the topic of)\b/gi, "about"],
  [/\b(the process of|the concept of|the idea of)\b/gi, ""],
  [/\b(the notion that)\b/gi, "that"],
  [/\b(it is essential that|it is imperative that)\b/gi, "We should"],
  [/\b(it is crucial that)\b/gi, "It's critical that"],
  [/\b(it is necessary to)\b/gi, "We need to"],
  [/\b(it is advisable to|it is recommended that)\b/gi, "I suggest"],
  [/\b(please feel free to)\b/gi, "Feel free to"],
  [/\b(do not hesitate to)\b/gi, "don't hesitate to"],
  [/\b(if you have any questions)\b/gi, "Questions?"],
  [/\b(it is important to note that|it is worth mentioning that|it should be noted that)\b/gi, ""],
  [/\b(in order to)\b/gi, "to"],
  [/\b(due to the fact that)\b/gi, "because"],
  [/\b(at this point in time)\b/gi, "right now"],
  [/\b(in the event that)\b/gi, "if"],
  [/\b(for the purpose of)\b/gi, "for"],
  [/\b(with regard to)\b/gi, "for"],
  [/\b(with respect to)\b/gi, "on"],
  [/\b(on a regular basis)\b/gi, "regularly"],
  [/\b(on an ongoing basis)\b/gi, "ongoing"],
  [/\bin the majority of instances\b/gi, "mostly"],
  [/\b(in close proximity to)\b/gi, "near"],
  [/\b(prior to)\b/gi, "before"],
  [/\b(subsequent to)\b/gi, "after"],
  [/\b(a significant number of|a large number of)\b/gi, "many"],
  [/\b(a small number of)\b/gi, "a few"],
  [/\b(the utilization of)\b/gi, "using"],
  [/\b(utilize|utilization)\b/gi, "use"],
  [/\b(demonstrate|demonstrates)\b/gi, "show"],
  [/\b(facilitate|facilitates)\b/gi, "help"],
  [/\b(implementation)\b/gi, "use"],
  [/\b(optimization)\b/gi, "improvement"],
  [/\b(leveraging)\b/gi, "using"],
  [/\b(henceforth)\b/gi, "from now on"],
  [/\b(hitherto)\b/gi, "until now"],
  [/\b(notwithstanding)\b/gi, "even though"],
  [/\b(thereafter)\b/gi, "afterward"],
  [/\b(thereby)\b/gi, "so"],
  [/\b(herein|hereby)\b/gi, ""],
  [/\b(wherein)\b/gi, "where"],
  [/\b(whilst)\b/gi, "while"],
  [/\b(endeavour|endeavor)\b/gi, "try"],
  [/\b(commence|commenced|commencing)\b/gi, "start"],
  [/\b(terminate|terminated|terminating)\b/gi, "end"],
  [/\b(play (a )?pivotal role in)\b/gi, "matter in"],
  [/\b(play (a )?crucial role in)\b/gi, "matter in"],
  [/\b(serves as a testament to|bears testament to|stands as a testament to)\b/gi, "shows"],
  [/\b(as a means of)\b/gi, "to"],
  [/\b(this means that)\b/gi, "That means"],
  [/\b(this suggests that)\b/gi, "This hints that"],
  [/\b(this indicates that)\b/gi, "This hints that"],
  [/\b(this implies that)\b/gi, "This suggests"],
  [/\b(it is evident that)\b/gi, "Clearly"],
  [/\b(it is clear that)\b/gi, ""],
  [/\b(it is apparent that)\b/gi, "It looks like"],
  [/\b(there is no doubt that)\b/gi, "Without a doubt"],
  [/\b(undoubtedly)\b/gi, "no question"],
  [/\b(increasingly)\b/gi, "more and more"],
]

// Natural voice markers — subtle, not filler
const HEDGES = ["pretty", "quite", "rather", "fairly", "somewhat", "kind of", "sort of"]
const EMPHASIZERS = ["just", "even", "really", "actually", "simply", "basically"]
const DISCOURSE_MARKERS = ["So", "Well", "Look", "Sure", "Basically", "Honestly", "Truthfully"]
const TRANSITIONS_SHORT = ["Also", "Plus", "Besides", "Then", "Likewise", "Similarly"]
const CONTRAST_TRANSITIONS = ["Still", "Yet", "Meanwhile", "Though", "Even so"]

// Common passive voice patterns to detect
const PASSIVE_PATTERNS: [RegExp, (match: string, ...groups: string[]) => string][] = [
  [/\bis (\w+ed) by\b/gi, (_, verb) => ` ${verb} `],
  [/\bare (\w+ed) by\b/gi, (_, verb) => ` ${verb} `],
  [/\bwas (\w+ed) by\b/gi, (_, verb) => ` ${verb} `],
  [/\bwere (\w+ed) by\b/gi, (_, verb) => ` ${verb} `],
  [/\bhas been (\w+ed) by\b/gi, (_, verb) => ` has ${verb} `],
  [/\bhave been (\w+ed) by\b/gi, (_, verb) => ` have ${verb} `],
  [/\bcan be (\w+ed)\b/gi, (_, verb) => ` can ${verb}`],
  [/\bis often (\w+ed)\b/gi, (_, verb) => ` often ${verb}s`],
]

// "There is/are" conversions
const THERE_IS_PATTERN = /\bthere (is|are) (a|an|the|some|many|several|various|numerous) /gi

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function applySynonymVariation(text: string, intensity: number): string {
  if (intensity < 15) return text
  let result = text
  const probability = Math.min(0.35, intensity / 280)
  for (const [baseWord, synonyms] of SYNONYM_GROUPS) {
    const pattern = new RegExp("\\b" + baseWord + "\\b", "gi")
    result = result.replace(pattern, (match) => {
      if (Math.random() < probability) {
        const replacement = pickRandom(synonyms)
        return match[0] === match[0].toUpperCase()
          ? replacement[0].toUpperCase() + replacement.slice(1)
          : replacement
      }
      return match
    })
  }
  return result
}

function replaceAiPhrases(text: string): string {
  let result = text
  for (const [pattern, replacement] of AI_PHRASES_FULL) {
    result = result.replace(pattern, replacement as string)
  }
  return result
}

function sentenceSimilarity(a: string, b: string): number {
  const aWords = a.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean)
  const bWords = b.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean)
  if (!aWords.length || !bWords.length) return 0
  const setA = new Set(aWords)
  const setB = new Set(bWords)
  const intersection = new Set([...setA].filter((w) => setB.has(w)))
  const union = new Set([...setA, ...setB])
  return intersection.size / union.size
}

function removeNearDuplicateSentences(sentences: string[]): string[] {
  if (sentences.length < 2) return sentences
  const result: string[] = []
  for (const s of sentences) {
    const trimmed = s.trim()
    if (!trimmed) { result.push(""); continue }
    const isDuplicate = result.some(
      (existing) => existing && sentenceSimilarity(trimmed, existing) > 0.75
    )
    if (!isDuplicate) result.push(trimmed)
  }
  return result
}

// ---- Sentence Rhythm Engine ----
function diversifySentenceLengths(sentences: string[], intensity: number): string[] {
  if (intensity < 20 || sentences.length < 3) return sentences

  const lengths = sentences.map((s) => s.split(/\s+/).length)
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const maxLen = Math.max(...lengths)
  const minLen = Math.min(...lengths)

  // If all sentences are similar length (within 40% of avg), force some splits/combines
  const range = maxLen - minLen
  if (range / avgLen < 0.6 || range < 5) {
    return varyRhythm(sentences, intensity)
  }

  // Check for monotonous mid-range (6-15 words each)
  const midRange = lengths.filter((l) => l >= 6 && l <= 15).length
  if (midRange / lengths.length > 0.7) {
    return varyRhythm(sentences, intensity)
  }

  return sentences
}

function varyRhythm(sentences: string[], intensity: number): string[] {
  const result: string[] = []
  for (let i = 0; i < sentences.length; i++) {
    let s = sentences[i].trim()
    if (!s) { result.push(""); continue }

    const wordCount = s.split(/\s+/).length

    // Split long sentences (over 20 words)
    if (wordCount > 20 && Math.random() < intensity / 80) {
      const breakChars = [", and ", ", but ", ", so ", ", because ", "; "]
      let split = false
      for (const bc of breakChars) {
        const idx = s.indexOf(bc, Math.floor(s.length * 0.35))
        if (idx > 0 && idx < s.length - 12) {
          const first = s.slice(0, idx).trim()
          const second = s.slice(idx + bc.length).trim()
          const connector = bc.startsWith(",") ? bc.replace(",", "").trim() : bc.trim()
          result.push(first + ".")
          result.push(connector.charAt(0).toUpperCase() + connector.slice(1) + " " + second)
          split = true
          break
        }
      }
      if (split) continue
    }

    // Insert short punchy sentence by splitting at a comma mid-sentence
    if (wordCount > 14 && Math.random() < intensity / 120) {
      const commaIdx = s.indexOf(", ", Math.floor(s.length * 0.2))
      if (commaIdx > 0 && commaIdx < s.length - 8) {
        const first = s.slice(0, commaIdx).trim()
        const second = s.slice(commaIdx + 2).trim()
        if (first.length > 10 && second.length > 10) {
          result.push(first + ".")
          result.push(second.charAt(0).toUpperCase() + second.slice(1))
          continue
        }
      }
    }

    // Combine very short sentences (under 4 words) with neighbors
    if (i > 0 && wordCount < 4 && Math.random() < intensity / 100) {
      const prev = result[result.length - 1]
      if (prev && prev.length + s.length < 200) {
        const comma = prev.length > 30 ? ", " : " "
        result[result.length - 1] = prev + comma + s[0].toLowerCase() + s.slice(1)
        continue
      }
    }

    result.push(s)
  }
  return result
}

// ---- Sentence Opening Diversity ----
function varySentenceOpenings(sentences: string[], intensity: number): string[] {
  if (intensity < 25 || sentences.length < 4) return sentences

  const result: string[] = []
  const recentOpenings: string[] = []

  for (let i = 0; i < sentences.length; i++) {
    let s = sentences[i].trim()
    if (!s) { result.push(""); continue }

    const words = s.split(/\s+/)
    const opening = words.slice(0, Math.min(2, words.length)).join(" ").toLowerCase()

    // Check for monotonous "The [noun] is/are" starts
    const theNounStart = /^The \w+ (is|are|was|were|has|have|plays|plays a)/i.test(s)
    // Check for "This [verb]" starts
    const thisStart = /^This (is|was|means|shows|demonstrates|suggests|indicates|reveals|leads|results|has|does)/i.test(s)
    // Check for "There is/are" starts
    const thereStart = /^There (is|are|was|were|has been|have been)/i.test(s)
    // Check for "It is/was" starts
    const itStart = /^It (is|was|has|can|could|should|would|may|might)/i.test(s)
    // Check for "In order to / To [verb]" starts
    const infinitiveStart = /^To \w+/i.test(s)

    const isRepetitive = recentOpenings.filter((o) => o === opening).length >= 2
    const shouldVary = isRepetitive || theNounStart || thisStart || thereStart || itStart || infinitiveStart

    if (i > 0 && shouldVary && words.length > 5 && Math.random() < intensity / 60) {
      const transformed = transformOpening(s, theNounStart, thisStart, thereStart, itStart, infinitiveStart, intensity)
      if (transformed !== s) {
        s = transformed
        recentOpenings.push(s.split(/\s+/).slice(0, 2).join(" ").toLowerCase())
        result.push(s)
        if (recentOpenings.length > 5) recentOpenings.shift()
        continue
      }
    }

    recentOpenings.push(opening)
    if (recentOpenings.length > 5) recentOpenings.shift()
    result.push(s)
  }
  return result
}

function transformOpening(
  s: string,
  theNounStart: boolean,
  thisStart: boolean,
  thereStart: boolean,
  itStart: boolean,
  infinitiveStart: boolean,
  intensity: number
): string {
  // "The [noun] is/are..." -> front adverbial or flip structure
  if (theNounStart) {
    const strategies = [
      // "The system provides..." -> "Providing [x], the system..."
      // Too complex for regex. Try a simpler approach: front the key info.
      () => s.replace(/^The (\w+) (is|are|was|were) /i, "$1 "),
      // "The system provides accurate results" -> "When it comes to accurate results, the system delivers"
      // Too risky. Skip.
    ]
    // Simple: just drop "The" and let the sentence stand
    if (Math.random() < 0.4) {
      return s.replace(/^The /i, "").replace(/^(\w)/, (m) => m.toUpperCase())
    }
  }

  // "This shows/means..." -> front the subject
  if (thisStart) {
    if (Math.random() < 0.5) {
      return s.replace(/^This (shows|demonstrates|indicates|suggests|reveals) that /i, "That means ")
        .replace(/^This (is|was) /i, "")
        .replace(/^This (means|leads to|results in) /i, "That ")
    }
  }

  // "There is/are..." -> drop "There" and recast
  if (thereStart) {
    if (Math.random() < 0.5) {
      return s.replace(/^There (is|are) (a|an|the|some|many|several) /i, "")
        .replace(/^(\w)/, (m) => m.toUpperCase())
    }
  }

  // "It is/was..." -> drop "It is" 
  if (itStart) {
    if (Math.random() < 0.4) {
      s = s.replace(/^It (is|was) (\w+)( that| to)/i, "$2")
        .replace(/^(\w)/, (m) => m.toUpperCase())
    }
  }

  // "To [verb]..." -> consider alternative
  if (infinitiveStart) {
    if (Math.random() < 0.4) {
      const rest = s.replace(/^To \w+ /i, "")
      return rest.charAt(0).toUpperCase() + rest.slice(1)
    }
  }

  return s
}

// ---- Natural Voice Injector ----
function addNaturalVoice(sentences: string[], intensity: number, tone: string): string[] {
  if (intensity < 15 || tone === "formal") return sentences

  const hedges = HEDGES.filter(() => Math.random() < intensity / 70)
  const emph = EMPHASIZERS.filter(() => Math.random() < intensity / 60)

  return sentences.map((s) => {
    if (!s.trim() || s.split(/\s+/).length < 4) return s
    let result = s

    // Add "actually" near natural positions (after "is/are/was/were/have/has")
    if (emph.includes("actually") && Math.random() < intensity / 150) {
      result = result.replace(/\b(is|are|was|were|has|have|had|could|would|should)\b\s+(?=not )?/i, (match) => {
        return match.trim() + " actually "
      })
    }

    // "pretty" or "quite" before adjectives
    if (hedges.includes("pretty") || hedges.includes("quite")) {
      const adjPattern = /\b(important|significant|good|bad|big|small|large|easy|hard|difficult|simple|complex|common|rare|useful|helpful|clear|strong|weak|nice|great|terrible|awesome|awful)\b/gi
      result = result.replace(adjPattern, (match) => {
        if (Math.random() < intensity / 200) {
          const hedge = pickRandom(hedges)
          return hedge + " " + match.toLowerCase()
        }
        return match
      })
    }

    // "just" before verbs
    if (emph.includes("just") && Math.random() < intensity / 180) {
      result = result.replace(/\b(can|could|will|would|should|may|might)\b\s+(?=be )?/i, (match) => {
        return match + " simply "
      })
    }

    // "really" before key adjectives/verbs
    if (emph.includes("really") && Math.random() < intensity / 200) {
      result = result.replace(/\b(important|significant|good|great|bad|hard|helpful|useful|interesting|impressive)\b/gi, (match) => {
        if (Math.random() < 0.4) return "really " + match.toLowerCase()
        return match
      })
    }

    // "basically" or "simply" at sentence starts (not all, just occasional)
    if ((emph.includes("basically") || emph.includes("simply")) && Math.random() < intensity / 250) {
      const opener = pickRandom(["Basically, ", "Simply put, ", "In plain terms, "])
      result = opener + result[0].toLowerCase() + result.slice(1)
    }

    return result
  })
}

// ---- Structure Transformations ----
function applyStructuralVariations(text: string, intensity: number, tone: string): string {
  if (intensity < 20) return text
  let result = text

  // Convert "There is/are X" → "X exists/can be found" (occasionally)
  if (Math.random() < intensity / 150) {
    result = result.replace(THERE_IS_PATTERN, (match) => {
      if (Math.random() < 0.4) {
        const rest = match.replace(/^there (is|are) (a|an|the|some|many|several|various|numerous) /i, "")
        return (rest.charAt(0).toUpperCase() + rest.slice(1)) + " "
      }
      return match
    })
  }

  // Soften absolute statements (for casual/conversational tone)
  if (tone !== "formal" && Math.random() < intensity / 120) {
    result = result
      .replace(/\bare always\b/gi, " tend to be ")
      .replace(/\bare never\b/gi, " rarely are ")
      .replace(/\bis always\b/gi, " tends to be ")
      .replace(/\bis never\b/gi, " rarely is ")
      .replace(/\ball\b(?= \w+ (are|is|have|has|do|does))/gi, "most")
  }

  // Convert "is important for" → "matters for" / "is key for" (informal tones)
  if (tone !== "formal" && Math.random() < intensity / 180) {
    result = result.replace(/\bis (important|essential|crucial|critical|vital)( for| to)\b/gi, (_, adj, prep) => {
      const swaps = pickRandom([
        `matters${prep}`,
        `is key${prep}`,
        `counts${prep}`,
      ])
      return swaps
    })
  }

  return result
}

// ---- Common phrase compaction (makes text flow more naturally) ----
function compactPhrases(text: string): string {
  return text
    .replace(/\bin a (very )?real way\b/gi, "really")
    .replace(/\bin a (very )?broad sense\b/gi, "broadly")
    .replace(/\bin a (very )?general sense\b/gi, "generally")
    .replace(/\bin a (very )?similar fashion\b/gi, "similarly")
    .replace(/\bin (the )?(final|last) analysis\b/gi, "ultimately")
    .replace(/\b(as a consequence|as a result|as an outcome)\b/gi, "as a result")
    .replace(/\b(for all intents and purposes)\b/gi, "essentially")
}

// ---- Fix repetitive sentence starts (complement to diversity) ----
function fixRepetitiveStarts(sentences: string[]): string[] {
  const result: string[] = []
  const startWords: string[] = []
  for (let i = 0; i < sentences.length; i++) {
    let s = sentences[i].trim()
    if (!s) { result.push(""); continue }
    const words = s.split(/\s+/)
    const firstWord = words[0].toLowerCase()

    // If same first word appears 3+ times in last 6 sentences, drop or swap
    startWords.push(firstWord)
    if (startWords.length > 6) startWords.shift()
    const repeats = startWords.filter((w) => w === firstWord).length

    if (repeats >= 3 && words.length > 4 && Math.random() < 0.6) {
      const alternative = pickRandom([
        // Drop first word
        () => words.slice(1).join(" "),
        // Swap first two words if both are nouns/determiners
        () => words.length > 2 ? words[1] + " " + words[0].toLowerCase() + " " + words.slice(2).join(" ") : s,
      ])
      const transformed = alternative()
      if (transformed.trim()) {
        s = transformed.charAt(0).toUpperCase() + transformed.slice(1)
      }
    }
    result.push(s)
  }
  return result
}

function applyToneVariations(text: string, tone: string): string {
  if (tone === "formal") {
    return text
      .replace(/\b(can't)\b/gi, "cannot")
      .replace(/\b(won't)\b/gi, "will not")
      .replace(/\b(don't)\b/gi, "do not")
      .replace(/\b(isn't)\b/gi, "is not")
      .replace(/\b(aren't)\b/gi, "are not")
      .replace(/\b(wasn't)\b/gi, "was not")
      .replace(/\b(weren't)\b/gi, "were not")
      .replace(/\b(hasn't)\b/gi, "has not")
      .replace(/\b(have't)\b/gi, "have not")
      .replace(/\b(doesn't)\b/gi, "does not")
      .replace(/\b(didn't)\b/gi, "did not")
      .replace(/\b(gonna)\b/gi, "going to")
      .replace(/\b(wanna)\b/gi, "want to")
      .replace(/\bgotta\b/gi, "have to")
      .replace(/\byou're\b/gi, "you are")
      .replace(/\bi'm\b/gi, "I am")
      .replace(/\bthey're\b/gi, "they are")
      .replace(/\bwe're\b/gi, "we are")
      .replace(/\bit's\b/gi, "it is")
      .replace(/\bthat's\b/gi, "that is")
      .replace(/\bthere's\b/gi, "there is")
  }
  if (["casual", "conversational", "friendly"].includes(tone)) {
    return text
      .replace(/\b(cannot)\b/gi, "can't")
      .replace(/\b(will not)\b/gi, "won't")
      .replace(/\b(do not)\b/gi, "don't")
      .replace(/\b(is not)\b/gi, "isn't")
      .replace(/\b(are not)\b/gi, "aren't")
      .replace(/\b(was not)\b/gi, "wasn't")
      .replace(/\b(were not)\b/gi, "weren't")
      .replace(/\b(has not)\b/gi, "hasn't")
      .replace(/\b(have not)\b/gi, "haven't")
      .replace(/\b(had not)\b/gi, "hadn't")
      .replace(/\b(does not)\b/gi, "doesn't")
      .replace(/\b(did not)\b/gi, "didn't")
      .replace(/\b(I will)\b/gi, "I'll")
      .replace(/\b(you will)\b/gi, "you'll")
      .replace(/\b(we will)\b/gi, "we'll")
      .replace(/\b(they will)\b/gi, "they'll")
      .replace(/\b(it is)\b/gi, "it's")
      .replace(/\b(that is)\b/gi, "that's")
      .replace(/\b(there is)\b/gi, "there's")
      .replace(/\b(here is)\b/gi, "here's")
      .replace(/\b(let us)\b/gi, "let's")
      .replace(/\b(I am)\b/gi, "I'm")
      .replace(/\b(you are)\b/gi, "you're")
      .replace(/\b(we are)\b/gi, "we're")
      .replace(/\b(they are)\b/gi, "they're")
      .replace(/\b(I would)\b/gi, "I'd")
      .replace(/\b(you would)\b/gi, "you'd")
      .replace(/\b(we would)\b/gi, "we'd")
      .replace(/\b(they would)\b/gi, "they'd")
  }
  return text
}

function finalCleanup(text: string): string {
  let t = text
    .replace(/\s{2,}/g, " ")
    .replace(/\s*\.\s*/g, ". ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\?\s*/g, "? ")
    .replace(/\s*!\s*/g, "! ")
  t = t.replace(/\b(i)\b/g, "I")
  t = t.replace(/([.,!?])\1+/g, "$1")
  t = t.replace(/\. \./g, ".")
  t = t.replace(/([.,!?])(?=[^\s])/g, "$1 ")
  t = t.replace(/\s{2,}/g, " ")
  return t.trim()
}

function lastResortShuffle(text: string): string {
  const sentences = splitSentences(text)
  if (sentences.length < 3) return text
  const result = [...sentences]
  const swaps = Math.min(2, Math.floor(sentences.length / 3))
  for (let i = 0; i < swaps; i++) {
    const idx = randomInt(1, sentences.length - 2)
    ;[result[idx], result[idx + 1]] = [result[idx + 1], result[idx]]
  }
  return result.join(" ")
}

export function humanizeText(text: string, options: HumanizerOptions): string {
  if (!text.trim()) return text

  const { intensity, tone, preserveFormatting } = options

  // Preserve code blocks and URLs
  const codeBlocks: string[] = []
  let result = text
  if (preserveFormatting) {
    result = result.replace(/```[\s\S]*?```/g, (m) => { codeBlocks.push(m); return `\x00CODE${codeBlocks.length - 1}\x00` })
    result = result.replace(/https?:\/\/[^\s]+/g, (m) => { codeBlocks.push(m); return `\x00URL${codeBlocks.length - 1}\x00` })
  }

  // Split into paragraphs from the original text structure
  const paragraphs = result.split(/\n\s*\n/).filter((p) => p.trim())
  const processedParagraphs = paragraphs.map((para) => {
    let p = para.trim()

    // Phase 1: Clean AI-typical phrasing
    p = replaceAiPhrases(p)
    p = applySynonymVariation(p, intensity)
    p = compactPhrases(p)
    p = applyStructuralVariations(p, intensity, tone)

    // Phase 2: Sentence-level transforms
    let sentences = splitSentences(p)

    // Remove near-duplicate sentences
    sentences = removeNearDuplicateSentences(sentences)

    // Diversify rhythm (vary sentence lengths)
    sentences = diversifySentenceLengths(sentences, intensity)

    // Vary sentence openings (break "The", "This", "It" patterns)
    sentences = varySentenceOpenings(sentences, intensity)

    // Add natural voice elements
    sentences = addNaturalVoice(sentences, intensity, tone)

    // Fix remaining repetitive starts
    sentences = fixRepetitiveStarts(sentences)

    // Rejoin
    p = sentences.join(" ")

    // Phase 3: Tone and polish
    p = applyToneVariations(p, tone)
    p = finalCleanup(p)

    // Ensure ends with period
    if (p && !/[.!?]$/.test(p)) p += "."

    return p
  })

  result = processedParagraphs.join("\n\n")

  // Restore code blocks and URLs
  if (preserveFormatting) {
    result = result.replace(/\x00CODE(\d+)\x00/g, (_, idx) => codeBlocks[parseInt(idx)] || "")
    result = result.replace(/\x00URL(\d+)\x00/g, (_, idx) => codeBlocks[parseInt(idx)] || "")
  }

  // Last resort: if nothing actually changed, do a light shuffle
  const similarity = computeSimilarity(text, result)
  if (similarity > 0.85) {
    result = lastResortShuffle(result)
    result = applyToneVariations(result, tone)
    result = finalCleanup(result)
  }

  return result
}

function computeSimilarity(a: string, b: string): number {
  const aWords = a.toLowerCase().split(/\s+/)
  const bWords = b.toLowerCase().split(/\s+/)
  if (!aWords.length || !bWords.length) return 0
  const setA = new Set(aWords)
  const setB = new Set(bWords)
  const intersection = new Set([...setA].filter((w) => setB.has(w)))
  const union = new Set([...setA, ...setB])
  return intersection.size / union.size
}
