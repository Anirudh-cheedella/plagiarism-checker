export interface MatchInterval {
  start: number
  end: number
}

export interface PlagiarismMatch {
  doc1Start: number
  doc1End: number
  doc2Start: number
  doc2End: number
}

export interface PlagiarismResult {
  similarity: number
  doc1Matches: MatchInterval[]
  doc2Matches: MatchInterval[]
  doc1Text: string
  doc2Text: string
}

/**
 * Tokenizes text by removing punctuation and splitting into words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Merges overlapping intervals
 */
function mergeIntervals(intervals: MatchInterval[]): MatchInterval[] {
  if (!intervals.length) return []

  intervals.sort((a, b) => a.start - b.start)
  const merged = [intervals[0]]

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1]
    const curr = intervals[i]

    if (curr.start <= last.end) {
      last.end = Math.max(last.end, curr.end)
    } else {
      merged.push(curr)
    }
  }

  return merged
}

/**
 * Gets the start indices of each word in the original text
 */
function getWordIndices(text: string, words: string[]): number[] {
  const indices: number[] = []
  let pos = 0

  for (let i = 0; i < words.length; i++) {
    const wordIndex = text.toLowerCase().indexOf(words[i], pos)
    if (wordIndex !== -1) {
      indices.push(wordIndex)
      pos = wordIndex + words[i].length
    } else {
      // Fallback: approximate position
      indices.push(pos)
      pos += words[i].length + 1
    }
  }

  return indices
}

/**
 * Main plagiarism checking function
 */
export function checkPlagiarism(text1: string, text2: string): PlagiarismResult {
  // Normalize and tokenize
  const words1 = tokenize(text1)
  const words2 = tokenize(text2)

  // Auto-adjust k (minimum phrase length)
  let k = Math.min(5, words1.length, words2.length)
  if (k < 1) {
    return {
      similarity: 0,
      doc1Matches: [],
      doc2Matches: [],
      doc1Text: text1,
      doc2Text: text2
    }
  }

  // Get word indices in original text
  const indices1 = getWordIndices(text1, words1)
  const indices2 = getWordIndices(text2, words2)

  // Find all matching k-grams
  const matches: PlagiarismMatch[] = []

  for (let i = 0; i <= words1.length - k; i++) {
    const phrase1 = words1.slice(i, i + k).join(' ')

    for (let j = 0; j <= words2.length - k; j++) {
      const phrase2 = words2.slice(j, j + k).join(' ')

      if (phrase1 === phrase2) {
        matches.push({
          doc1Start: indices1[i],
          doc1End: indices1[i + k - 1] + words1[i + k - 1].length,
          doc2Start: indices2[j],
          doc2End: indices2[j + k - 1] + words2[j + k - 1].length
        })
      }
    }
  }

  // Merge overlapping matches
  const mergedMatches1 = mergeIntervals(
    matches.map(m => ({ start: m.doc1Start, end: m.doc1End }))
  )
  const mergedMatches2 = mergeIntervals(
    matches.map(m => ({ start: m.doc2Start, end: m.doc2End }))
  )

  // Calculate similarity percentages
  const similarity1 = mergedMatches1.reduce((sum, m) => sum + (m.end - m.start), 0) / text1.length * 100
  const similarity2 = mergedMatches2.reduce((sum, m) => sum + (m.end - m.start), 0) / text2.length * 100

  return {
    similarity: Number(((similarity1 + similarity2) / 2).toFixed(2)),
    doc1Matches: mergedMatches1,
    doc2Matches: mergedMatches2,
    doc1Text: text1,
    doc2Text: text2
  }
}

/**
 * Reads a text file and returns its content as a string
 */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e.target?.error)
    reader.readAsText(file)
  })
}

/**
 * Highlights text based on match intervals
 */
export function highlightText(text: string, matches: MatchInterval[]): string {
  let html = ''
  let currentIndex = 0

  matches.forEach(match => {
    // Add text before the match
    html += escapeHtml(text.substring(currentIndex, match.start))
    // Add highlighted match
    html += `<span class="plagiarism-highlight">${escapeHtml(text.substring(match.start, match.end))}</span>`
    currentIndex = match.end
  })

  // Add remaining text
  html += escapeHtml(text.substring(currentIndex))

  return html
}

/**
 * Escapes HTML characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}