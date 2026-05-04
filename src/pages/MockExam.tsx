import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import { useProgress } from '../hooks/useProgress'
import { useTimer, useStopwatch, formatTime } from '../hooks/useTimer'
import { generateMockExam } from '../utils/mockExam'
import type { Question, MockExamResult } from '../types'

import smQ from '../content/questions/stable-matching.json'
import grQ from '../content/questions/greedy.json'
import dcQ from '../content/questions/divide-and-conquer.json'
import dpQ from '../content/questions/dynamic-programming.json'
import presets from '../content/mockExams.json'

const ALL_QUESTIONS = [...smQ, ...grQ, ...dcQ, ...dpQ] as Question[]
const TIMED_SECONDS = 30 * 60  // 30 minutes

type Mode = 'setup' | 'active' | 'finished'

export default function MockExam() {
  const navigate = useNavigate()
  const { recordAnswer, recordMockExam } = useProgress()
  const [mode, setMode] = useState<Mode>('setup')
  const [timed, setTimed] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [currentIdx, setCurrentIdx] = useState(0)

  const countdown = useTimer(TIMED_SECONDS, false)
  const stopwatch = useStopwatch()

  const startExam = (questionList: Question[], isTimed: boolean) => {
    setQuestions(questionList)
    setAnswers({})
    setCurrentIdx(0)
    setTimed(isTimed)
    setMode('active')
    if (isTimed) countdown.start()
    else stopwatch.start()
  }

  const startRandom = (isTimed: boolean) => {
    startExam(generateMockExam(ALL_QUESTIONS), isTimed)
  }

  const startPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId)
    if (!preset) return
    const qs = preset.questionIds.map((id) => ALL_QUESTIONS.find((q) => q.id === id)).filter(Boolean) as Question[]
    startExam(qs, false)
  }

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timed && mode === 'active' && countdown.secondsLeft === 0) {
      finishExam()
    }
  }, [countdown.secondsLeft, timed, mode])

  const handleAnswer = (questionId: string, correct: boolean, timeSpentSec: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: correct }))
    recordAnswer(questionId, correct, timeSpentSec)
  }

  const finishExam = () => {
    countdown.pause()
    stopwatch.pause()
    const elapsed = timed ? TIMED_SECONDS - countdown.secondsLeft : stopwatch.seconds
    const score = Object.values(answers).filter(Boolean).length
    const result: MockExamResult = {
      examId: `exam-${Date.now()}`,
      date: new Date().toISOString(),
      score,
      total: questions.length,
      timeSpentSec: elapsed,
      answers: questions.map((q) => ({ questionId: q.id, correct: answers[q.id] ?? false })),
    }
    recordMockExam(result)
    setMode('finished')
  }

  const answeredCount = Object.keys(answers).length

  if (mode === 'setup') {
    return (
      <div>
        <h1 className="mb-1">Mock Exam</h1>
        <p className="text-muted mb-4">Simulates the ELTE exam format: 2 lecture + 3 practical questions.</p>

        <div className="alert alert-info mb-4">
          <strong>🎓 Exam Format:</strong> 5 questions — 2 lecture/theory + 3 practical/problem-solving.
          You can choose timed (30 min) or untimed mode.
        </div>

        <h2 className="mb-3">Start a New Exam</h2>
        <div className="grid-2 mb-4">
          <div className="card">
            <h3 className="mb-2">⏱ Timed Mode</h3>
            <p className="text-muted text-small mb-3">30 minutes. Random questions from all topics. Closest to the real exam experience.</p>
            <button className="btn btn-primary" onClick={() => startRandom(true)}>Start Timed Exam</button>
          </div>
          <div className="card">
            <h3 className="mb-2">📖 Untimed Mode</h3>
            <p className="text-muted text-small mb-3">No time limit. Random questions. Good for practice and learning.</p>
            <button className="btn btn-accent" onClick={() => startRandom(false)}>Start Untimed Exam</button>
          </div>
        </div>

        <h2 className="mb-3">Preset Exams</h2>
        <div className="grid-2">
          {presets.map((p) => (
            <div key={p.id} className="card">
              <h3 className="mb-1">{p.name}</h3>
              <p className="text-muted text-small mb-2">
                Questions: {p.questionIds.join(', ')}
              </p>
              <button className="btn btn-ghost btn-sm" onClick={() => startPreset(p.id)}>
                Start This Exam
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'finished') {
    const score = Object.values(answers).filter(Boolean).length
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div>
        <h1 className="mb-2">Exam Complete!</h1>
        <div className={`card mb-4 ${pct >= 60 ? 'alert-success' : 'alert-warning'}`}
          style={{ borderLeft: `4px solid ${pct >= 60 ? 'var(--success)' : 'var(--warning)'}` }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: pct >= 60 ? 'var(--success)' : 'var(--warning)' }}>
            {score} / {questions.length}
          </div>
          <div style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{pct}%</div>
          <p className="text-muted mt-1">
            {pct >= 80 ? '🌟 Excellent!' : pct >= 60 ? '👍 Good work!' : '📚 Keep studying!'}
          </p>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button className="btn btn-primary" onClick={() => setMode('setup')}>New Exam</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>View Dashboard</button>
          <button className="btn btn-ghost" onClick={() => navigate('/questions')}>Question Bank</button>
        </div>

        <h2 className="mb-3">Review Answers</h2>
        {questions.map((q, i) => (
          <div key={q.id} className="mb-3">
            <div className={`badge ${answers[q.id] ? 'badge-easy' : 'badge-hard'} mb-1`}>
              {answers[q.id] ? '✓ Correct' : '✗ Incorrect'}
            </div>
            <QuestionCard question={q} index={i} showResultImmediate />
          </div>
        ))}
      </div>
    )
  }

  // Active exam
  const q = questions[currentIdx]
  if (!q) return null

  return (
    <div>
      {/* Header bar */}
      <div className="card mb-3" style={{ padding: '0.75rem 1rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <strong>Mock Exam</strong>
            <span className="text-muted text-small">{answeredCount} / {questions.length} answered</span>
          </div>
          <div className="flex items-center gap-3">
            {timed ? (
              <span className={`badge ${countdown.secondsLeft < 300 ? 'badge-hard' : 'badge-lecture'}`}>
                ⏱ {formatTime(countdown.secondsLeft)}
              </span>
            ) : (
              <span className="badge badge-topic">⏱ {formatTime(stopwatch.seconds)}</span>
            )}
            <button
              className="btn btn-danger btn-sm"
              onClick={finishExam}
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Question navigator */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${currentIdx === i ? 'btn-primary' : answers[questions[i].id] !== undefined ? 'btn-success' : 'btn-ghost'}`}
              onClick={() => setCurrentIdx(i)}
              aria-label={`Question ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current question */}
      <QuestionCard
        question={q}
        index={currentIdx}
        onAnswer={(correct, t) => handleAnswer(q.id, correct, t)}
      />

      {/* Navigation */}
      <div className="flex gap-2 mt-3">
        <button className="btn btn-ghost" onClick={() => setCurrentIdx((i) => Math.max(i - 1, 0))} disabled={currentIdx === 0}>
          ← Previous
        </button>
        {currentIdx < questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrentIdx((i) => i + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn btn-success" onClick={finishExam}>
            Finish & Submit
          </button>
        )}
      </div>
    </div>
  )
}
