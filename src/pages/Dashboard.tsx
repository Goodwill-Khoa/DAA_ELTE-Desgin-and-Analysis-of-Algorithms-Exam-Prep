import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import ProgressChart from '../components/ProgressChart'
import { getTopicStats, getTypeStats } from '../utils/progress'
import { formatTime } from '../hooks/useTimer'
import type { Question } from '../types'

import smQ from '../content/questions/stable-matching.json'
import grQ from '../content/questions/greedy.json'
import dcQ from '../content/questions/divide-and-conquer.json'
import dpQ from '../content/questions/dynamic-programming.json'

const ALL_QUESTIONS = [...smQ, ...grQ, ...dcQ, ...dpQ] as Question[]

const TOPICS = [
  { id: 'stable-matching' as const, label: 'Stable Matching', short: 'SM' },
  { id: 'greedy' as const, label: 'Greedy', short: 'GR' },
  { id: 'divide-and-conquer' as const, label: 'D&C', short: 'DC' },
  { id: 'dynamic-programming' as const, label: 'DP', short: 'DP' },
]

export default function Dashboard() {
  const { progress, doExport, doImport } = useProgress()
  const importRef = useRef<HTMLInputElement>(null)

  const totalAttempted = Object.values(progress.questions).filter((q) => q.attempts > 0).length
  const totalCorrect = Object.values(progress.questions).reduce((s, q) => s + q.correct, 0)
  const totalAttempts = Object.values(progress.questions).reduce((s, q) => s + q.attempts, 0)
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  const topicData = TOPICS.map((t) => {
    const stats = getTopicStats(ALL_QUESTIONS, progress, t.id)
    return { label: t.short, value: stats.accuracy, attempted: stats.attempted, total: stats.total }
  })

  const lectureStats = getTypeStats(ALL_QUESTIONS, progress, 'lecture')
  const practicalStats = getTypeStats(ALL_QUESTIONS, progress, 'practical')

  const handleExport = () => {
    const json = doExport()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'daa-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const ok = doImport(text)
      alert(ok ? '✅ Progress imported successfully!' : '❌ Invalid file. Import failed.')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div>
      <h1 className="mb-1">Progress Dashboard</h1>
      <p className="text-muted mb-4">Track your exam preparation progress.</p>

      {/* Summary cards */}
      <div className="grid-4 mb-4">
        {[
          { label: 'Questions Attempted', value: `${totalAttempted}/${ALL_QUESTIONS.length}`, icon: '❓' },
          { label: 'Overall Accuracy', value: `${overallAccuracy}%`, icon: '🎯' },
          { label: 'Study Streak', value: `${progress.streak} day${progress.streak !== 1 ? 's' : ''}`, icon: '🔥' },
          { label: 'Total Time', value: formatTime(progress.totalTimeSpentSec), icon: '⏱' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>{s.value}</div>
            <div className="text-muted text-small">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2 mb-4">
        <div className="card">
          <ProgressChart
            title="Accuracy by Topic"
            data={topicData}
            showPercent
          />
          <div className="mt-2">
            {TOPICS.map((t, i) => (
              <div key={t.id} className="flex justify-between text-small mt-1">
                <span>{t.label}</span>
                <span className="text-muted">{topicData[i].attempted}/{topicData[i].total} · {topicData[i].value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <ProgressChart
            title="Accuracy by Type"
            data={[
              { label: 'Lecture', value: lectureStats.accuracy },
              { label: 'Practical', value: practicalStats.accuracy },
            ]}
            showPercent
          />
          <div className="mt-2">
            <div className="flex justify-between text-small mt-1">
              <span>Lecture</span>
              <span className="text-muted">{lectureStats.attempted}/{lectureStats.total} · {lectureStats.accuracy}%</span>
            </div>
            <div className="flex justify-between text-small mt-1">
              <span>Practical</span>
              <span className="text-muted">{practicalStats.attempted}/{practicalStats.total} · {practicalStats.accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Exam History */}
      <div className="card mb-4">
        <h2 className="mb-3">Mock Exam History</h2>
        {progress.mockExamResults.length === 0 ? (
          <div className="text-muted">
            No mock exams taken yet. <Link to="/mock-exam">Start one now →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#edf2f7' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Date</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Score</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>%</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {[...progress.mockExamResults].reverse().map((r) => {
                const pct = Math.round((r.score / r.total) * 100)
                return (
                  <tr key={r.examId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem' }}>{new Date(r.date).toLocaleDateString()}</td>
                    <td style={{ padding: '0.5rem' }}>{r.score}/{r.total}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ color: pct >= 60 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{pct}%</span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>{formatTime(r.timeSpentSec)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Flagged for review */}
      <div className="card mb-4">
        <h2 className="mb-2">🔖 Flagged for Review</h2>
        {(() => {
          const flagged = ALL_QUESTIONS.filter((q) => progress.questions[q.id]?.markedReview)
          return flagged.length === 0 ? (
            <p className="text-muted">No questions flagged. Use "Flag for Review" on any question to track it here.</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {flagged.map((q) => (
                <Link key={q.id} to={`/questions`} className="tag" style={{ cursor: 'pointer' }}>
                  {q.id}: {q.prompt.slice(0, 40)}…
                </Link>
              ))}
            </div>
          )
        })()}
      </div>

      {/* Export / Import */}
      <div className="card">
        <h2 className="mb-2">Export / Import Progress</h2>
        <p className="text-muted text-small mb-3">
          Save your progress as a JSON file to back it up or transfer to another device.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={handleExport}>
            ⬇ Export Progress (JSON)
          </button>
          <button className="btn btn-ghost" onClick={() => importRef.current?.click()}>
            ⬆ Import Progress (JSON)
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
            aria-label="Import progress JSON file"
          />
        </div>
      </div>
    </div>
  )
}
