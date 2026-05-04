import { Link } from 'react-router-dom'

const TOPICS = [
  {
    id: 'stable-matching',
    name: 'Stable Matching',
    icon: '🤝',
    color: '#bee3f8',
    border: '#3182ce',
    description: 'The stable matching problem and the Gale-Shapley algorithm. A foundational problem in combinatorial optimization with real-world applications (medical residency, college admissions).',
    keyConcepts: ['Stable matching definition', 'Blocking pairs', 'Gale-Shapley algorithm', 'Man-optimality', 'Woman-pessimality', 'O(n²) complexity', 'Multiple stable matchings'],
  },
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    icon: '⚡',
    color: '#fefcbf',
    border: '#d69e2e',
    description: 'The greedy paradigm: build optimal solutions by always making locally optimal choices. Requires greedy choice property and optimal substructure.',
    keyConcepts: ['Greedy choice property', 'Optimal substructure', 'Exchange argument', 'Interval scheduling (EFT)', 'Huffman coding', "Kruskal's MST", 'Fractional Knapsack'],
  },
  {
    id: 'divide-and-conquer',
    name: 'Divide & Conquer',
    icon: '🔀',
    color: '#e9d8fd',
    border: '#805ad5',
    description: 'Solve problems by dividing into subproblems, solving recursively, and combining results. Analyze using recurrences and the Master Theorem.',
    keyConcepts: ['Divide-Conquer-Combine', 'Recurrences', 'Master Theorem (3 cases)', 'Merge Sort O(n log n)', 'Binary Search O(log n)', 'Closest pair of points'],
    extra: { label: 'Master Method Calculator', to: '/topics/divide-and-conquer/master-method' },
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    icon: '📊',
    color: '#c6f6d5',
    border: '#38a169',
    description: 'Solve optimization problems with overlapping subproblems and optimal substructure. Store subproblem results to avoid recomputation.',
    keyConcepts: ['Optimal substructure', 'Overlapping subproblems', 'Memoization (top-down)', 'Tabulation (bottom-up)', '0/1 Knapsack', 'LCS', 'Edit Distance'],
  },
]

export default function Topics() {
  return (
    <div>
      <h1 className="mb-1">Topics</h1>
      <p className="text-muted mb-4">Four algorithm families covered in the ELTE MSc DAA exam.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {TOPICS.map((t) => (
          <div key={t.id} className="card" style={{ borderLeft: `4px solid ${t.border}`, background: t.color + '40' }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h2 style={{ margin: 0 }}>
                <span style={{ marginRight: '0.5rem' }}>{t.icon}</span>
                {t.name}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <Link to={`/topics/${t.id}`} className="btn btn-primary btn-sm">
                  Explore →
                </Link>
                <Link to={`/questions?topic=${t.id}`} className="btn btn-ghost btn-sm">
                  Practice Questions
                </Link>
                {t.extra && (
                  <Link to={t.extra.to} className="btn btn-ghost btn-sm">
                    🔢 {t.extra.label}
                  </Link>
                )}
              </div>
            </div>
            <p className="text-muted text-small mb-2">{t.description}</p>
            <div className="flex gap-1 flex-wrap">
              {t.keyConcepts.map((c) => (
                <span key={c} className="tag">{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
