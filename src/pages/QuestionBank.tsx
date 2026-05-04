import { useState, useMemo } from 'react'
import QuestionCard from '../components/QuestionCard'
import { useProgress } from '../hooks/useProgress'
import type { TopicId, Difficulty, QuestionType } from '../types'

import smQ from '../content/questions/stable-matching.json'
import grQ from '../content/questions/greedy.json'
import dcQ from '../content/questions/divide-and-conquer.json'
import dpQ from '../content/questions/dynamic-programming.json'

const ALL_QUESTIONS = [...smQ, ...grQ, ...dcQ, ...dpQ] as import('../types').Question[]

export default function QuestionBank() {
  const { progress, recordAnswer, toggleFlag } = useProgress()
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all')
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all')
  const [searchText, setSearchText] = useState('')

  const filtered = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      if (topicFilter !== 'all' && q.topic !== topicFilter) return false
      if (typeFilter !== 'all' && q.type !== typeFilter) return false
      if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false
      if (searchText && !q.prompt.toLowerCase().includes(searchText.toLowerCase()) &&
          !q.tags.some((t) => t.toLowerCase().includes(searchText.toLowerCase()))) return false
      return true
    })
  }, [topicFilter, typeFilter, diffFilter, searchText])

  return (
    <div>
      <h1 className="mb-1">Question Bank</h1>
      <p className="text-muted mb-3">{ALL_QUESTIONS.length} questions total · {filtered.length} shown</p>

      {/* Filters */}
      <div className="card mb-4" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.75rem', alignItems: 'end' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
            Topic
            <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value as TopicId | 'all')}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }}>
              <option value="all">All Topics</option>
              <option value="stable-matching">Stable Matching</option>
              <option value="greedy">Greedy</option>
              <option value="divide-and-conquer">Divide & Conquer</option>
              <option value="dynamic-programming">Dynamic Programming</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
            Type
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as QuestionType | 'all')}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }}>
              <option value="all">All Types</option>
              <option value="lecture">Lecture</option>
              <option value="practical">Practical</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
            Difficulty
            <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value as Difficulty | 'all')}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }}>
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
            Search
            <input type="search" placeholder="Search questions..."
              value={searchText} onChange={(e) => setSearchText(e.target.value)}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }} />
          </label>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="alert alert-info">No questions match the current filters.</div>
      )}

      {filtered.map((q, i) => {
        const qp = progress.questions[q.id]
        return (
          <div key={q.id}>
            {qp?.markedReview && (
              <div className="badge badge-hard" style={{ marginBottom: '0.25rem' }}>🔖 Flagged for Review</div>
            )}
            {qp?.markedUnderstood && (
              <div className="badge badge-easy" style={{ marginBottom: '0.25rem' }}>✓ Understood</div>
            )}
            <QuestionCard
              question={q}
              index={i}
              onAnswer={(correct, t) => recordAnswer(q.id, correct, t)}
              onFlag={(flag, val) => toggleFlag(q.id, flag, val)}
              markedReview={qp?.markedReview ?? false}
              markedUnderstood={qp?.markedUnderstood ?? false}
            />
          </div>
        )
      })}
    </div>
  )
}
