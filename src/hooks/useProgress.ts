import { useState, useCallback } from 'react'
import type { ProgressState } from '../types'
import {
  loadProgress,
  saveProgress,
  updateQuestionProgress,
  setQuestionFlag,
  addMockExamResult,
  updateStreak,
  exportProgress,
  importProgress,
} from '../utils/progress'
import type { MockExamResult } from '../types'

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  const persist = useCallback((next: ProgressState) => {
    setProgress(next)
    saveProgress(next)
  }, [])

  const recordAnswer = useCallback(
    (questionId: string, correct: boolean, timeSpentSec: number) => {
      setProgress((prev) => {
        const next = updateStreak(updateQuestionProgress(prev, questionId, correct, timeSpentSec))
        saveProgress(next)
        return next
      })
    },
    []
  )

  const toggleFlag = useCallback(
    (questionId: string, flag: 'markedReview' | 'markedUnderstood', value: boolean) => {
      setProgress((prev) => {
        const next = setQuestionFlag(prev, questionId, flag, value)
        saveProgress(next)
        return next
      })
    },
    []
  )

  const recordMockExam = useCallback(
    (result: MockExamResult) => {
      setProgress((prev) => {
        const next = addMockExamResult(prev, result)
        saveProgress(next)
        return next
      })
    },
    []
  )

  const doExport = useCallback(() => exportProgress(progress), [progress])

  const doImport = useCallback(
    (json: string): boolean => {
      const imported = importProgress(json)
      if (!imported) return false
      persist(imported)
      return true
    },
    [persist]
  )

  return { progress, recordAnswer, toggleFlag, recordMockExam, doExport, doImport }
}
