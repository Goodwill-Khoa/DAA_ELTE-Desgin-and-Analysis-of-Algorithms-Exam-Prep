export type TopicId = 'stable-matching' | 'greedy' | 'divide-and-conquer' | 'dynamic-programming'
export type QuestionType = 'lecture' | 'practical'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type VisualId = 'gale-shapley' | 'greedy-interval' | 'recursion-tree' | 'dp-table' | 'master-method'

export interface Question {
  id: string
  topic: TopicId
  type: QuestionType
  difficulty: Difficulty
  timeEstimateMin: number
  prompt: string
  choices?: string[]
  answer: string
  hint: string
  steps: string[]
  tags: string[]
  references: { materialId: string; page?: number }[]
  visualId?: VisualId
}

export interface MockExamPreset {
  id: string
  name: string
  questionIds: string[]
}

export interface Material {
  id: string
  title: string
  filename: string
  author: string
  date: string
  tags: string[]
  description: string
}

export interface QuestionProgress {
  questionId: string
  attempts: number
  correct: number
  markedReview: boolean
  markedUnderstood: boolean
  timeSpentSec: number
  lastAttempt: string
}

export interface MockExamResult {
  examId: string
  date: string
  score: number
  total: number
  timeSpentSec: number
  answers: { questionId: string; correct: boolean }[]
}

export interface ProgressState {
  questions: Record<string, QuestionProgress>
  mockExamResults: MockExamResult[]
  streak: number
  lastStudyDate: string
  totalTimeSpentSec: number
}

export interface TopicInfo {
  id: TopicId
  name: string
  description: string
  icon: string
  color: string
  keyConcepts: string[]
  visualId: VisualId
}
