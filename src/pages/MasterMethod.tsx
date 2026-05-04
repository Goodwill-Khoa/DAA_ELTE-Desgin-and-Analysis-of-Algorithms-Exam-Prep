import { Link } from 'react-router-dom'
import DivideConquerViz from '../components/visuals/DivideConquerViz'

export default function MasterMethod() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Link to="/topics/divide-and-conquer" className="text-muted text-small">← Divide & Conquer</Link>
      </div>
      <h1 className="mb-1">🔢 Master Theorem / Method</h1>
      <p className="text-muted mb-4">Analyze recurrences of the form T(n) = aT(n/b) + f(n).</p>

      <div className="card mb-4" style={{ background: '#f7fafc' }}>
        <h2 className="mb-2">The Master Theorem</h2>
        <p className="mb-2">Given T(n) = a·T(n/b) + f(n), where a ≥ 1, b &gt; 1, the <strong>watershed function</strong> is n<sup>log<sub>b</sub>(a)</sup>.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1rem' }}>
          {[
            { case: 'Case 1', condition: 'f(n) = O(n^(log_b a − ε)) for some ε > 0', result: 'T(n) = Θ(n^log_b a)', note: 'Subproblem work dominates' },
            { case: 'Case 2', condition: 'f(n) = Θ(n^log_b a · log^k n) for k ≥ 0', result: 'T(n) = Θ(n^log_b a · log^(k+1) n)', note: 'Equal work at each level' },
            { case: 'Case 3', condition: 'f(n) = Ω(n^(log_b a + ε)) AND a·f(n/b) ≤ c·f(n)', result: 'T(n) = Θ(f(n))', note: 'Combine cost dominates' },
          ].map((c) => (
            <div key={c.case} className="card">
              <strong style={{ color: 'var(--primary)' }}>{c.case}</strong>
              <p className="text-small mt-1"><strong>Condition:</strong> {c.condition}</p>
              <p className="text-small mt-1"><strong>Result:</strong> <code>{c.result}</code></p>
              <p className="text-small text-muted mt-1">{c.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="mb-2">Common Examples</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#edf2f7' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Algorithm</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Recurrence</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>a,b,f(n)</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Case</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Merge Sort', 'T(n)=2T(n/2)+n', 'a=2,b=2,f=n', '2 (k=0)', 'Θ(n log n)'],
              ['Binary Search', 'T(n)=T(n/2)+1', 'a=1,b=2,f=1', '2 (k=0)', 'Θ(log n)'],
              ['Strassen', 'T(n)=7T(n/2)+n²', 'a=7,b=2,f=n²', '1', 'Θ(n^log₂7)≈Θ(n^2.81)'],
              ['Closest Pair', 'T(n)=2T(n/2)+n', 'a=2,b=2,f=n', '2 (k=0)', 'Θ(n log n)'],
              ['Example A', 'T(n)=4T(n/2)+n', 'a=4,b=2,f=n', '1', 'Θ(n²)'],
              ['Example B', 'T(n)=4T(n/2)+n²', 'a=4,b=2,f=n²', '2 (k=0)', 'Θ(n² log n)'],
              ['Example C', 'T(n)=4T(n/2)+n³', 'a=4,b=2,f=n³', '3', 'Θ(n³)'],
            ].map(([alg, rec, params, c, res]) => (
              <tr key={alg} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>{alg}</td>
                <td style={{ padding: '0.5rem' }}><code>{rec}</code></td>
                <td style={{ padding: '0.5rem', fontSize: '0.8rem' }}>{params}</td>
                <td style={{ padding: '0.5rem' }}>{c}</td>
                <td style={{ padding: '0.5rem' }}><code>{res}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="mb-2">Interactive Calculator</h2>
        <DivideConquerViz showCalculator />
      </div>
    </div>
  )
}
