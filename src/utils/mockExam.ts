import type { Question } from '../types'

export function generateMockExam(questions: Question[]): Question[] {
  const lecture = shuffle(questions.filter((q) => q.type === 'lecture'))
  const practical = shuffle(questions.filter((q) => q.type === 'practical'))
  return [...lecture.slice(0, 2), ...practical.slice(0, 3)]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
