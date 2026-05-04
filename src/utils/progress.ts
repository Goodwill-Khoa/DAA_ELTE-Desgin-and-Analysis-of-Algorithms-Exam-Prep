import type { ProgressState, QuestionProgress, MockExamResult } from '../types'
import type { Question, TopicId, QuestionType } from '../types'

const STORAGE_KEY = 'daa-progress'

export function defaultProgress(): ProgressState {
  return {
    questions: {},
    mockExamResults: [],
    streak: 0,
    lastStudyDate: '',
    totalTimeSpentSec: 0,
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    return { ...defaultProgress(), ...JSON.parse(raw) }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function updateQuestionProgress(
  state: ProgressState,
  questionId: string,
  correct: boolean,
  timeSpentSec: number
): ProgressState {
  const prev = state.questions[questionId] || {
    questionId,
    attempts: 0,
    correct: 0,
    markedReview: false,
    markedUnderstood: false,
    timeSpentSec: 0,
    lastAttempt: '',
  }
  const updated: QuestionProgress = {
    ...prev,
    attempts: prev.attempts + 1,
    correct: prev.correct + (correct ? 1 : 0),
    timeSpentSec: prev.timeSpentSec + timeSpentSec,
    lastAttempt: new Date().toISOString(),
  }
  return {
    ...state,
    questions: { ...state.questions, [questionId]: updated },
    totalTimeSpentSec: state.totalTimeSpentSec + timeSpentSec,
  }
}

export function setQuestionFlag(
  state: ProgressState,
  questionId: string,
  flag: 'markedReview' | 'markedUnderstood',
  value: boolean
): ProgressState {
  const prev = state.questions[questionId] || {
    questionId,
    attempts: 0,
    correct: 0,
    markedReview: false,
    markedUnderstood: false,
    timeSpentSec: 0,
    lastAttempt: '',
  }
  return {
    ...state,
    questions: { ...state.questions, [questionId]: { ...prev, [flag]: value } },
  }
}

export function addMockExamResult(state: ProgressState, result: MockExamResult): ProgressState {
  return {
    ...state,
    mockExamResults: [...state.mockExamResults, result],
  }
}

export function updateStreak(state: ProgressState): ProgressState {
  const today = new Date().toDateString()
  if (state.lastStudyDate === today) return state
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const newStreak = state.lastStudyDate === yesterday ? state.streak + 1 : 1
  return { ...state, streak: newStreak, lastStudyDate: today }
}

export function exportProgress(state: ProgressState): string {
  return JSON.stringify(state, null, 2)
}

export function importProgress(json: string): ProgressState | null {
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed !== 'object' || parsed === null) return null
    return { ...defaultProgress(), ...parsed }
  } catch {
    return null
  }
}

export function getTopicStats(
  questions: Question[],
  progress: ProgressState,
  topic: TopicId
): { accuracy: number; attempted: number; total: number } {
  const topicQs = questions.filter((q) => q.topic === topic)
  const attempted = topicQs.filter((q) => (progress.questions[q.id]?.attempts ?? 0) > 0)
  const correct = attempted.reduce((sum, q) => sum + (progress.questions[q.id]?.correct ?? 0), 0)
  const totalAttempts = attempted.reduce(
    (sum, q) => sum + (progress.questions[q.id]?.attempts ?? 0),
    0
  )
  return {
    accuracy: totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0,
    attempted: attempted.length,
    total: topicQs.length,
  }
}

export function getTypeStats(
  questions: Question[],
  progress: ProgressState,
  type: QuestionType
): { accuracy: number; attempted: number; total: number } {
  const typeQs = questions.filter((q) => q.type === type)
  const attempted = typeQs.filter((q) => (progress.questions[q.id]?.attempts ?? 0) > 0)
  const correct = attempted.reduce((sum, q) => sum + (progress.questions[q.id]?.correct ?? 0), 0)
  const totalAttempts = attempted.reduce(
    (sum, q) => sum + (progress.questions[q.id]?.attempts ?? 0),
    0
  )
  return {
    accuracy: totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0,
    attempted: attempted.length,
    total: typeQs.length,
  }
}
