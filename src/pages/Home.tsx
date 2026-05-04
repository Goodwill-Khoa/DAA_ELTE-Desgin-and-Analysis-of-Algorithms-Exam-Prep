import { Link } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg,#1a365d,#2a4a7f)', color: '#fff', borderColor: 'transparent' }}>
        <div style={{ maxWidth: 700 }}>
          <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>ELTE MSc – Design & Analysis of Algorithms</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            Interactive exam preparation: mock exams, visual explanations, and progress tracking.
          </p>
          <p style={{ opacity: 0.75, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Instructor: Dr. László Szabó &lt;szabolaszlo@inf.elte.hu&gt;
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link to="/mock-exam" className="btn btn-accent btn-lg">🎯 Start Mock Exam</Link>
            <Link to="/questions" className="btn btn-ghost btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>📚 Question Bank</Link>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-4 mb-4">
        {[
          { label: '32+', desc: 'Questions', icon: '❓' },
          { label: '4', desc: 'Topics', icon: '📖' },
          { label: '2', desc: 'Mock Exams', icon: '📝' },
          { label: '4', desc: 'Visualizations', icon: '🎬' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{s.label}</div>
            <div className="text-muted text-small">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Topics quick links */}
      <h2 className="mb-3">Topics</h2>
      <div className="grid-2 mb-4">
        {[
          { id: 'stable-matching', name: 'Stable Matching', icon: '🤝', desc: 'Gale-Shapley, blocking pairs, man-optimality' },
          { id: 'greedy', name: 'Greedy Algorithms', icon: '⚡', desc: 'Interval scheduling, Huffman coding, MST' },
          { id: 'divide-and-conquer', name: 'Divide & Conquer', icon: '🔀', desc: 'Merge sort, Master Theorem, recurrences' },
          { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '📊', desc: 'LCS, Knapsack, optimal substructure' },
        ].map((t) => (
          <Link key={t.id} to={`/topics/${t.id}`} className="card card-hover" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
            <h3>{t.name}</h3>
            <p className="text-muted text-small mt-1">{t.desc}</p>
          </Link>
        ))}
      </div>

      {/* How it works */}
      <h2 className="mb-3">How to Use</h2>
      <div className="grid-3 mb-4">
        {[
          { step: '1', title: 'Browse Topics', desc: 'Read key concepts and watch interactive visualizations for each algorithm.' },
          { step: '2', title: 'Practice Questions', desc: 'Use the Question Bank to practice with hints, solutions, and visual explanations.' },
          { step: '3', title: 'Take Mock Exams', desc: 'Simulate the real ELTE exam: 2 lecture + 3 practical questions, timed or untimed.' },
          { step: '4', title: 'Review Mistakes', desc: 'After each exam, review solutions and watch visualizations for questions you struggled with.' },
          { step: '5', title: 'Track Progress', desc: 'Visit the Dashboard to see your accuracy by topic and review flagged questions.' },
          { step: '6', title: 'Study Materials', desc: 'Access all uploaded lecture PDFs and practice problem sets in the Documents section.' },
        ].map((s) => (
          <div key={s.step} className="card">
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-dark)', marginBottom: '0.5rem' }}>
              Step {s.step}
            </div>
            <h4 className="mb-1">{s.title}</h4>
            <p className="text-muted text-small">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Exam format reminder */}
      <div className="alert alert-info">
        <strong>🎓 ELTE Exam Format:</strong> 5 questions total — <strong>2 lecture/theory</strong> questions + <strong>3 practical/problem-solving</strong> questions. Use Mock Exam mode to practice this exact format.
      </div>
    </div>
  )
}
