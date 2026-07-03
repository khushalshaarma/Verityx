export interface DiffSegment {
  type: "added" | "removed" | "unchanged" | "modified"
  text: string
}

export function computeDiff(original: string, humanized: string): DiffSegment[] {
  const origWords = tokenize(original)
  const humanWords = tokenize(humanized)
  const result: DiffSegment[] = []
  let i = 0, j = 0

  while (i < origWords.length || j < humanWords.length) {
    if (i < origWords.length && j < humanWords.length && origWords[i] === humanWords[j]) {
      const startI = i
      while (i < origWords.length && j < humanWords.length && origWords[i] === humanWords[j]) {
        i++; j++
      }
      result.push({ type: "unchanged", text: origWords.slice(startI, i).join(" ") })
    } else {
      const nextMatchI = findNextMatch(origWords, i, humanWords, j)
      const nextMatchJ = findNextMatch(humanWords, j, origWords, i)

      const removedCount = nextMatchI - i
      const addedCount = nextMatchJ - j

      if (removedCount > 0 && addedCount > 0) {
        result.push({ type: "modified", text: origWords.slice(i, nextMatchI).join(" ") + " → " + humanWords.slice(j, nextMatchJ).join(" ") })
      } else if (removedCount > 0) {
        result.push({ type: "removed", text: origWords.slice(i, nextMatchI).join(" ") })
      } else if (addedCount > 0) {
        result.push({ type: "added", text: humanWords.slice(j, nextMatchJ).join(" ") })
      }

      i = nextMatchI
      j = nextMatchJ
    }
  }

  const merged: DiffSegment[] = []
  for (const seg of result) {
    if (merged.length > 0 && merged[merged.length - 1].type === seg.type) {
      merged[merged.length - 1].text += " " + seg.text
    } else {
      merged.push({ ...seg })
    }
  }

  return merged
}

function tokenize(text: string): string[] {
  return text.match(/\S+\s*/g) || []
}

function findNextMatch(arr1: string[], start1: number, arr2: string[], start2: number): number {
  if (start1 >= arr1.length) return start1
  for (let i = start1; i < Math.min(arr1.length, start1 + 30); i++) {
    for (let j = start2; j < Math.min(arr2.length, start2 + 30); j++) {
      if (arr1[i] === arr2[j]) return i
    }
  }
  return Math.min(arr1.length, start1 + 5)
}
