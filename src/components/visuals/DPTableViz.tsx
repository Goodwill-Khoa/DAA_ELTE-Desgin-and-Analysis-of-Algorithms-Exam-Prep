import { useState, useEffect, useRef } from 'react'

const X = 'ACE'
const Y = 'ABCDE'

// Build LCS DP table
function buildDPTable(x: string, y: string) {
  const m = x.length, n = y.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  const steps: { i: number; j: number; val: number; from: 'diag' | 'left' | 'up' }[] = []
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (x[i - 1] === y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
        steps.push({ i, j, val: dp[i][j], from: 'diag' })
      } else {
        if (dp[i - 1][j] >= dp[i][j - 1]) {
          dp[i][j] = dp[i - 1][j]
          steps.push({ i, j, val: dp[i][j], from: 'up' })
        } else {
          dp[i][j] = dp[i][j - 1]
          steps.push({ i, j, val: dp[i][j], from: 'left' })
        }
      }
    }
  }
  return { dp, steps }
}

const { dp: DP, steps: STEPS } = buildDPTable(X, Y)
const CELL = 38

export default function DPTableViz() {
  const [stepIdx, setStepIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const m = X.length, n = Y.length

  // Which cells have been revealed
  const revealed = new Set<string>()
  for (let s = 0; s <= stepIdx && s < STEPS.length; s++) {
    revealed.add(`${STEPS[s].i},${STEPS[s].j}`)
  }

  const currentCell = stepIdx >= 0 && stepIdx < STEPS.length ? STEPS[stepIdx] : null

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx((i) => {
          if (i >= STEPS.length - 1) { setPlaying(false); return i }
          return i + 1
        })
      }, 600)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing])

  const reset = () => { setStepIdx(-1); setPlaying(false) }
  const step = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1))
  const back = () => setStepIdx((i) => Math.max(i - 1, -1))

  const svgW = (n + 2) * CELL + 20
  const svgH = (m + 2) * CELL + 20
  const xOff = CELL * 2, yOff = CELL * 2
  const readableMono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

  return (
    <div>
      <div className="alert alert-info mb-2" style={{ fontSize: '0.95rem', lineHeight: 1.55, fontFamily: readableMono }}>
        <strong>LCS of X="{X}" and Y="{Y}"</strong><br />
        dp[i][j] = LCS length of X[1..i] and Y[1..j].<br />
        If X[i]=Y[j]: dp[i][j]=dp[i-1][j-1]+1 (↖ diagonal)<br />
        Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])
      </div>

      <svg
        viewBox={`50 50 ${svgW} ${svgH}`}
        width="100%"
        style={{ maxWidth: svgW, display: 'block', margin: '0 auto' }}
        aria-label="LCS dynamic programming table"
      >
        {/* Column headers (Y) */}
        <text x={xOff - CELL / 2} y={yOff - 8} textAnchor="middle" fontSize="11" fill="#718096" fontWeight="bold">j→</text>
        {['', ...Y.split('')].map((c, j) => (
          <text key={j} x={xOff + j * CELL + CELL / 2} y={yOff - 8}
            textAnchor="middle" fontSize="12" fontWeight={c ? 'bold' : 'normal'} fill={c ? '#1a365d' : '#718096'}>
            {j === 0 ? '' : c}
          </text>
        ))}
        {/* j index numbers */}
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <text key={`ji${j}`} x={xOff + j * CELL + CELL / 2} y={yOff - 20}
            textAnchor="middle" fontSize="9" fill="#a0aec0">{j}</text>
        ))}

        {/* Row headers (X) */}
        <text x={xOff - CELL - 4} y={yOff + CELL / 2 + 4} textAnchor="middle" fontSize="11" fill="#718096" fontWeight="bold">i↓</text>
        {['', ...X.split('')].map((c, i) => (
          <text key={i} x={xOff - CELL / 2} y={yOff + i * CELL + CELL / 2 + 4}
            textAnchor="middle" fontSize="12" fontWeight={c ? 'bold' : 'normal'} fill={c ? '#44337a' : '#718096'}>
            {i === 0 ? '' : c}
          </text>
        ))}

        {/* Cells */}
        {Array.from({ length: m + 1 }, (_, i) =>
          Array.from({ length: n + 1 }, (_, j) => {
            const isRevealed = i === 0 || j === 0 || revealed.has(`${i},${j}`)
            const isCurrent = currentCell?.i === i && currentCell?.j === j
            const val = DP[i][j]
            const bg = isCurrent ? '#3182ce' : (i === 0 || j === 0) ? '#edf2f7'
              : isRevealed && currentCell?.from === 'diag' && currentCell.i === i && currentCell.j === j ? '#c6f6d5'
              : isRevealed ? '#fff' : '#f7fafc'
            const textColor = isCurrent ? '#fff' : '#1a202c'
            return (
              <g key={`${i}-${j}`}>
                <rect x={xOff + j * CELL} y={yOff + i * CELL}
                  width={CELL - 1} height={CELL - 1}
                  fill={bg} stroke={isCurrent ? '#2b6cb0' : '#e2e8f0'} strokeWidth={isCurrent ? 2 : 0.5} rx="3"
                />
                {(i === 0 || j === 0 || isRevealed) && (
                  <text x={xOff + j * CELL + CELL / 2} y={yOff + i * CELL + CELL / 2 + 4}
                    textAnchor="middle" fontSize="13" fontWeight={isCurrent ? 'bold' : 'normal'} fill={textColor}>
                    {val}
                  </text>
                )}
                {/* Arrow for current cell */}
                {isCurrent && currentCell && (
                  <text x={xOff + j * CELL + CELL - 8} y={yOff + i * CELL + 12}
                    fontSize="10" fill="#fff" opacity="0.8">
                    {currentCell.from === 'diag' ? '↖' : currentCell.from === 'up' ? '↑' : '←'}
                  </text>
                )}
              </g>
            )
          })
        )}
      </svg>

      <div
        className="alert alert-info mt-2"
        style={{
          minHeight: '2.5rem',
          fontSize: '0.95rem',
          lineHeight: 1.55,
          fontFamily: readableMono,
        }}
      >
        {currentCell
          ? `Filling dp[${currentCell.i}][${currentCell.j}]: X[${currentCell.i}]="${X[currentCell.i - 1]}" vs Y[${currentCell.j}]="${Y[currentCell.j - 1]}" → ${currentCell.from === 'diag' ? `match! dp=${currentCell.val}` : `no match, take max → ${currentCell.val}`}`
          : stepIdx >= STEPS.length - 1
            ? `Complete! LCS length = ${DP[m][n]}. Traceback to find LCS string.`
            : 'Press Play or Step to fill the table cell by cell.'
        }
      </div>

      <div className="viz-controls">
        <button className="btn btn-secondary btn-sm" onClick={reset}>⟳ Reset</button>
        <button className="btn btn-secondary btn-sm" onClick={back} disabled={stepIdx < 0}>◀ Back</button>
        <button className="btn btn-primary btn-sm" onClick={() => setPlaying(!playing)} disabled={stepIdx >= STEPS.length - 1}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={step} disabled={stepIdx >= STEPS.length - 1}>▶ Step</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setStepIdx(STEPS.length - 1)}>⏭ End</button>
        <span className="text-muted text-small" style={{ fontFamily: readableMono, fontSize: '0.9rem' }}>
          Cell {Math.max(stepIdx + 1, 0)} / {STEPS.length}
        </span>
      </div>
    </div>
  )
}
