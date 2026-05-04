import { useParams, Link, Navigate } from 'react-router-dom'
import GaleShapleyViz from '../components/visuals/GaleShapleyViz'
import GreedyViz from '../components/visuals/GreedyViz'
import DivideConquerViz from '../components/visuals/DivideConquerViz'
import DPTableViz from '../components/visuals/DPTableViz'

const TOPICS = {
  'stable-matching': {
    name: 'Stable Matching',
    icon: '🤝',
    visualLabel: 'Gale–Shapley Algorithm',
    keyConcepts: [
      { term: 'Stable Matching', def: 'A perfect matching M with no blocking pair (m,w) ∉ M where m prefers w over M(m) AND w prefers m over M(w).' },
      { term: 'Blocking Pair', def: '(m,w) not in M where both m and w would prefer each other over their current partners.' },
      { term: 'Gale-Shapley Algorithm', def: 'Iterative: free men propose to women in preference order. Women tentatively accept best proposal; rejected men move to next choice. O(n²).' },
      { term: 'Man-Optimality', def: 'GS (men propose) gives every man his best valid partner — the best partner he appears with in ANY stable matching.' },
      { term: 'Woman-Pessimality', def: 'GS (men propose) gives every woman her worst valid partner. Running GS with women proposing gives the woman-optimal result.' },
      { term: 'Existence', def: 'A stable matching always exists. Gale-Shapley always terminates with a stable matching.' },
      { term: 'Multiple Matchings', def: 'A single instance may have many stable matchings. GS gives the man-optimal (or woman-optimal) one depending on who proposes.' },
    ],
    viz: <GaleShapleyViz />,
  },
  'greedy': {
    name: 'Greedy Algorithms',
    icon: '⚡',
    visualLabel: 'Interval Scheduling',
    keyConcepts: [
      { term: 'Greedy Paradigm', def: 'Build solution incrementally. At each step, make the locally optimal (greedy) choice without revisiting past decisions.' },
      { term: 'Greedy Choice Property', def: 'There exists an optimal solution consistent with the greedy choice. Proved via exchange argument.' },
      { term: 'Exchange Argument', def: 'Show any optimal solution can be transformed step-by-step into the greedy solution without decreasing quality.' },
      { term: 'Optimal Substructure', def: 'Optimal solution contains optimal solutions to subproblems (shared with DP, but DP requires overlap too).' },
      { term: 'Interval Scheduling', def: 'Select max non-overlapping intervals by always picking the one with earliest finish time. O(n log n).' },
      { term: 'Huffman Coding', def: 'Build optimal prefix-free code by repeatedly merging two lowest-frequency nodes. O(n log n).' },
      { term: "Kruskal's MST", def: 'Add edges in increasing weight order if they don\'t create a cycle (Union-Find). O(m log m).' },
    ],
    viz: <GreedyViz />,
  },
  'divide-and-conquer': {
    name: 'Divide & Conquer',
    icon: '🔀',
    visualLabel: 'Recursion Tree & Master Theorem',
    keyConcepts: [
      { term: 'Paradigm', def: 'Divide into a subproblems of size n/b. Conquer recursively. Combine in f(n) time. Recurrence: T(n)=aT(n/b)+f(n).' },
      { term: 'Master Theorem – Case 1', def: 'f(n)=O(n^(log_b a − ε)): subproblem work dominates. T(n)=Θ(n^log_b a).' },
      { term: 'Master Theorem – Case 2', def: 'f(n)=Θ(n^log_b a · log^k n): equal contributions. T(n)=Θ(n^log_b a · log^(k+1) n).' },
      { term: 'Master Theorem – Case 3', def: 'f(n)=Ω(n^(log_b a + ε)) + regularity: combine dominates. T(n)=Θ(f(n)).' },
      { term: 'Merge Sort', def: 'T(n)=2T(n/2)+n → Case 2 → Θ(n log n). Stable, optimal for comparison sort.' },
      { term: 'Binary Search', def: 'T(n)=T(n/2)+O(1) → T(n)=Θ(log n). Requires sorted array.' },
      { term: 'Closest Pair', def: 'T(n)=2T(n/2)+O(n) → Θ(n log n). Key insight: only O(1) points in strip per point.' },
    ],
    extra: <Link to="/topics/divide-and-conquer/master-method" className="btn btn-primary btn-sm mt-2">🔢 Master Theorem Calculator</Link>,
    viz: <DivideConquerViz />,
  },
  'dynamic-programming': {
    name: 'Dynamic Programming',
    icon: '📊',
    visualLabel: 'LCS DP Table',
    keyConcepts: [
      { term: 'Optimal Substructure', def: 'Optimal solution contains optimal solutions to subproblems. Proved by cut-and-paste argument.' },
      { term: 'Overlapping Subproblems', def: 'Same subproblems recur multiple times. DP solves each once and stores the result.' },
      { term: 'Memoization (Top-Down)', def: 'Write recursive solution, add cache. Only computes needed subproblems. May have stack overhead.' },
      { term: 'Tabulation (Bottom-Up)', def: 'Fill table from base cases up. Better cache performance, no recursion stack. Fills all subproblems.' },
      { term: '0/1 Knapsack', def: 'dp[i][w]=max(dp[i-1][w], dp[i-1][w-wi]+vi). O(nW) pseudo-polynomial time.' },
      { term: 'LCS', def: 'dp[i][j]=dp[i-1][j-1]+1 if match, else max(dp[i-1][j],dp[i][j-1]). O(mn) time.' },
      { term: 'Edit Distance', def: 'dp[i][j]=min(insert,delete,substitute). Minimum edits to transform s1[1..i] into s2[1..j].' },
    ],
    viz: <DPTableViz />,
  },
} as const

type TopicKey = keyof typeof TOPICS

export default function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>()

  if (!topicId || !(topicId in TOPICS)) {
    return <Navigate to="/topics" replace />
  }

  const topic = TOPICS[topicId as TopicKey]

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Link to="/topics" className="text-muted text-small">← Topics</Link>
      </div>
      <h1 className="mb-1">{topic.icon} {topic.name}</h1>
      <div className="flex gap-2 mb-4">
        <Link to={`/questions?topic=${topicId}`} className="btn btn-primary btn-sm">Practice Questions</Link>
        <Link to="/mock-exam" className="btn btn-ghost btn-sm">Take Mock Exam</Link>
        {'extra' in topic && topic.extra}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Key Concepts */}
        <div>
          <h2 className="mb-3">Key Concepts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topic.keyConcepts.map((kc) => (
              <div key={kc.term} className="card" style={{ padding: '0.75rem 1rem' }}>
                <strong style={{ color: 'var(--primary)' }}>{kc.term}</strong>
                <p className="text-small mt-1" style={{ margin: '0.25rem 0 0' }}>{kc.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div>
          <h2 className="mb-3">Interactive: {topic.visualLabel}</h2>
          <div className="card">
            {topic.viz}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
