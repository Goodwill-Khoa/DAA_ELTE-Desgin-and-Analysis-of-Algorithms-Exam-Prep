import { useState } from 'react'

interface Props { showCalculator?: boolean }

// Recursion tree for T(n) = 2T(n/2) + n (merge sort)
interface TreeNode {
  label: string
  x: number
  y: number
  children: TreeNode[]
  level: number
}

function buildTree(depth: number, n: number, x: number, y: number, spread: number, level: number): TreeNode {
  const label = `T(${n})`
  if (depth === 0 || n <= 1) return { label: n <= 1 ? `T(1)` : label, x, y, children: [], level }
  const child1 = buildTree(depth - 1, Math.floor(n / 2), x - spread, y + 60, spread / 2, level + 1)
  const child2 = buildTree(depth - 1, Math.ceil(n / 2), x + spread, y + 60, spread / 2, level + 1)
  return { label, x, y, children: [child1, child2], level }
}

function renderNodes(node: TreeNode, activeLevel: number, nodes: JSX.Element[], edges: JSX.Element[]) {
  const isActive = node.level === activeLevel
  const isLeaf = node.children.length === 0
  nodes.push(
    <g key={`${node.x}-${node.y}`}>
      <circle cx={node.x} cy={node.y} r="20"
        fill={isActive ? '#3182ce' : isLeaf ? '#38a169' : '#1a365d'}
        opacity={node.level > activeLevel + 1 ? 0.25 : 1}
      />
      <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="9" fill="#fff">{node.label}</text>
    </g>
  )
  for (const child of node.children) {
    edges.push(
      <line key={`e-${node.x}-${child.x}-${child.y}`}
        x1={node.x} y1={node.y + 20}
        x2={child.x} y2={child.y - 20}
        stroke="#cbd5e0" strokeWidth="1.5"
        opacity={node.level >= activeLevel + 1 ? 0.2 : 0.8}
      />
    )
    renderNodes(child, activeLevel, nodes, edges)
  }
}

export default function DivideConquerViz({ showCalculator = false }: Props) {
  const [activeLevel, setActiveLevel] = useState(0)
  const maxDepth = 3
  const tree = buildTree(maxDepth, 8, 220, 30, 90, 0)

  // Master theorem calculator
  const [a, setA] = useState('2')
  const [b, setB] = useState('2')
  const [fType, setFType] = useState('nk')
  const [k, setK] = useState('1')
  const [calcResult, setCalcResult] = useState('')

  const calculate = () => {
    const av = parseFloat(a)
    const bv = parseFloat(b)
    const kv = parseFloat(k)
    if (isNaN(av) || isNaN(bv) || bv <= 1 || av < 1) {
      setCalcResult('Invalid input: a≥1, b>1 required.')
      return
    }
    const watershed = Math.log(av) / Math.log(bv)  // log_b(a)
    let fDesc = ''
    let result = ''
    if (fType === 'nk') {
      fDesc = `n^${kv}`
      const eps = kv - watershed
      if (eps < -0.001) {
        result = `Case 1 (f(n) polynomially smaller): T(n) = Θ(n^${watershed.toFixed(3)})`
      } else if (Math.abs(eps) < 0.001) {
        result = `Case 2 (k=0): T(n) = Θ(n^${watershed.toFixed(3)} · log n)`
      } else {
        result = `Case 3 (f(n) polynomially larger, check regularity): T(n) = Θ(n^${kv})`
      }
    } else if (fType === 'nklogn') {
      fDesc = `n^${watershed.toFixed(2)} · log n`
      result = `Case 2 (k=1): T(n) = Θ(n^${watershed.toFixed(3)} · log² n)`
    } else {
      fDesc = `n^${kv}`
      result = `f(n) = ${fDesc}, watershed = n^${watershed.toFixed(3)}`
    }
    setCalcResult(`a=${av}, b=${bv}, watershed=n^log_${bv}(${av})=n^${watershed.toFixed(3)}, f(n)=${fDesc} → ${result}`)
  }

  const levels = ['Level 0: T(n)', 'Level 1: 2×T(n/2)', 'Level 2: 4×T(n/4)', 'Level 3 (leaves): 8×T(1)']
  const costs = ['n (combine)', 'n/2+n/2 = n', 'n/4×4 = n', 'O(1)×n = n']

  const nodes: JSX.Element[] = []
  const edges: JSX.Element[] = []
  renderNodes(tree, activeLevel, nodes, edges)

  return (
    <div>
      {!showCalculator && (
        <>
          <p className="text-muted text-small mb-2">
            Merge sort recursion tree: T(n)=2T(n/2)+n. Each level costs O(n) work. log n levels → T(n)=Θ(n log n).
          </p>

          <svg viewBox="0 0 440 280" width="100%" style={{ maxWidth: 440, display: 'block', margin: '0 auto' }}
            aria-label="Recursion tree for merge sort">
            {edges}
            {nodes}
            {/* Level cost annotations */}
            {[0, 1, 2, 3].map((l) => (
              <g key={l}>
                <text x={430} y={30 + l * 60 + 4} textAnchor="end" fontSize="9" fill="#718096">
                  {costs[l]}
                </text>
              </g>
            ))}
            <text x={430} y={260} textAnchor="end" fontSize="9" fill="#718096">Total: Θ(n log n)</text>
          </svg>

          <div className="mt-2">
            <p className="text-small text-muted mb-1">Highlight level:</p>
            <div className="viz-controls">
              {levels.map((lbl, i) => (
                <button key={i} className={`btn btn-sm ${activeLevel === i ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveLevel(i)}>
                  L{i}
                </button>
              ))}
            </div>
            <div className="alert alert-info mt-2 text-small">
              <strong>{levels[activeLevel]}</strong> — Cost: {costs[activeLevel]}
            </div>
          </div>
        </>
      )}

      {/* Master Theorem Calculator */}
      <div className="card mt-3" style={{ background: '#f7fafc' }}>
        <h4 className="mb-2">Master Theorem Calculator</h4>
        <p className="text-small text-muted mb-2">T(n) = a·T(n/b) + f(n)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.75rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
            a (subproblems)
            <input type="number" min="1" value={a} onChange={(e) => setA(e.target.value)}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
            b (size divisor)
            <input type="number" min="2" value={b} onChange={(e) => setB(e.target.value)}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
            f(n) type
            <select value={fType} onChange={(e) => setFType(e.target.value)}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }}>
              <option value="nk">n^k</option>
              <option value="nklogn">n^log_b(a) · log n</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
            k (exponent)
            <input type="number" step="0.5" value={k} onChange={(e) => setK(e.target.value)}
              style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: 4 }} />
          </label>
        </div>
        <button className="btn btn-primary btn-sm mt-2" onClick={calculate}>Calculate</button>
        {calcResult && (
          <div className="alert alert-success mt-2 text-small">{calcResult}</div>
        )}
        <div className="mt-2 text-small text-muted">
          <strong>Cases:</strong><br />
          Case 1: f(n)=O(n^(log_b(a)−ε)) → T(n)=Θ(n^log_b(a))<br />
          Case 2: f(n)=Θ(n^(log_b(a))·log^k n) → T(n)=Θ(n^log_b(a)·log^(k+1) n)<br />
          Case 3: f(n)=Ω(n^(log_b(a)+ε)), regularity holds → T(n)=Θ(f(n))
        </div>
      </div>
    </div>
  )
}
