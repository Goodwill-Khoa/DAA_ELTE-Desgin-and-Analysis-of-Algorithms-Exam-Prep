import { useState } from 'react'
import { Link } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import { useProgress } from '../hooks/useProgress'
import type { Question } from '../types'

import smQ from '../content/questions/stable-matching.json'
import grQ from '../content/questions/greedy.json'
import dcQ from '../content/questions/dynamic-programming.json'
import dpQ from '../content/questions/divide-and-conquer.json'

const ALL_QUESTIONS = [...smQ, ...grQ, ...dcQ, ...dpQ] as Question[]

export default function Review() {
  const { progress, toggleFlag } = useProgress()
  const [filter, setFilter] = useState<'all' | 'review' | 'wrong' | 'understood'>('all')

  const reviewed = ALL_QUESTIONS.filter((q) => {
    const qp = progress.questions[q.id]
    if (!qp || qp.attempts === 0) return false
    if (filter === 'review') return qp.markedReview
    if (filter === 'understood') return qp.markedUnderstood
    if (filter === 'wrong') return qp.correct < qp.attempts
    return true
  })

  return (
    <div>
      <h1 className="mb-1">Review Mode</h1>
      <p className="text-muted mb-3">
        Review questions you've attempted. Use filters to focus on mistakes or flagged items.
      </p>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {([
          { key: 'all', label: 'All Attempted' },
          { key: 'wrong', label: '✗ Incorrect' },
          { key: 'review', label: '🔖 Flagged' },
          { key: 'understood', label: '✓ Understood' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {reviewed.length === 0 && (
        <div className="alert alert-info">
          {filter === 'all'
            ? <>No questions attempted yet. <Link to="/questions">Start practicing</Link> or <Link to="/mock-exam">take a mock exam</Link>.</>
            : `No questions match this filter.`}
        </div>
      )}

      {reviewed.map((q, i) => {
        const qp = progress.questions[q.id]
        const accuracy = qp ? Math.round((qp.correct / qp.attempts) * 100) : 0
        return (
          <div key={q.id} className="mb-3">
            {/* Stats bar */}
            <div className="flex gap-2 items-center mb-1 flex-wrap" style={{ fontSize: '0.8rem' }}>
              <span className="text-muted">Attempts: {qp?.attempts ?? 0}</span>
              <span className={accuracy >= 70 ? 'text-small' : 'text-small'} style={{ color: accuracy >= 70 ? 'var(--success)' : 'var(--danger)' }}>
                Accuracy: {accuracy}%
              </span>
              {qp?.markedReview && <span className="badge badge-hard">🔖 Review</span>}
              {qp?.markedUnderstood && <span className="badge badge-easy">✓ Understood</span>}
              {qp?.timeSpentSec && <span className="text-muted">Time: {Math.round(qp.timeSpentSec / 60)}m</span>}
            </div>
            <QuestionCard
              question={q}
              index={i}
              onFlag={(flag, val) => toggleFlag(q.id, flag, val)}
              markedReview={qp?.markedReview ?? false}
              markedUnderstood={qp?.markedUnderstood ?? false}
              showResultImmediate
            />
          </div>
        )
      })}
    </div>
  )
}
