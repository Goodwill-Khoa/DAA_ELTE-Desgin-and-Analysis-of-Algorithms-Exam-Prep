import { useState, useEffect, useRef } from 'react'

// Preferences: men prefer women in order, women prefer men in order
const MEN = ['m1', 'm2', 'm3']
const WOMEN = ['w1', 'w2', 'w3']

const MEN_PREFS: Record<string, string[]> = {
  m1: ['w1', 'w2', 'w3'],
  m2: ['w2', 'w1', 'w3'],
  m3: ['w1', 'w3', 'w2'],
}
const WOMEN_PREFS: Record<string, string[]> = {
  w1: ['m2', 'm1', 'm3'],
  w2: ['m1', 'm2', 'm3'],
  w3: ['m1', 'm2', 'm3'],
}

interface Step {
  proposer: string
  proposee: string
  action: 'propose' | 'accept' | 'reject' | 'done'
  matching: Record<string, string>  // woman -> man (tentative)
  nextProposal: Record<string, number>  // man -> next index
  message: string
}

function buildSteps(): Step[] {
  const steps: Step[] = []
  const matching: Record<string, string> = {}  // woman -> man
  const nextProposal: Record<string, number> = { m1: 0, m2: 0, m3: 0 }

  const rank: Record<string, Record<string, number>> = {}
  for (const w of WOMEN) {
    rank[w] = {}
    WOMEN_PREFS[w].forEach((m, i) => { rank[w][m] = i })
  }

  let iterations = 0
  while (iterations < 50) {
    iterations++
    const freeMen = MEN.filter((m) => !Object.values(matching).includes(m))
    if (freeMen.length === 0) break

    for (const m of freeMen) {
      if (nextProposal[m] >= WOMEN.length) continue
      const w = MEN_PREFS[m][nextProposal[m]]
      const propIdx = nextProposal[m]
      const newNext = { ...nextProposal, [m]: propIdx + 1 }

      if (!matching[w]) {
        const newMatch = { ...matching, [w]: m }
        steps.push({
          proposer: m, proposee: w, action: 'accept',
          matching: { ...newMatch },
          nextProposal: { ...newNext },
          message: `${m} proposes to ${w}. ${w} is free → accepts! ${m}–${w} tentatively matched.`,
        })
        Object.assign(matching, newMatch)
        Object.assign(nextProposal, newNext)
      } else {
        const current = matching[w]
        if (rank[w][m] < rank[w][current]) {
          const newMatch = { ...matching, [w]: m }
          steps.push({
            proposer: m, proposee: w, action: 'accept',
            matching: { ...newMatch },
            nextProposal: { ...newNext },
            message: `${m} proposes to ${w}. ${w} prefers ${m} over ${current} → dumps ${current}, accepts ${m}!`,
          })
          Object.assign(matching, newMatch)
          Object.assign(nextProposal, newNext)
        } else {
          steps.push({
            proposer: m, proposee: w, action: 'reject',
            matching: { ...matching },
            nextProposal: { ...newNext },
            message: `${m} proposes to ${w}. ${w} prefers current partner ${current} → rejects ${m}.`,
          })
          Object.assign(nextProposal, newNext)
        }
      }
    }
  }

  steps.push({
    proposer: '', proposee: '', action: 'done',
    matching: { ...matching },
    nextProposal: { ...nextProposal },
    message: `Algorithm complete! Final stable matching: ${Object.entries(matching).map(([w, m]) => `${m}–${w}`).join(', ')}`,
  })

  return steps
}

const STEPS = buildSteps()

const MAN_X = 80
const WOMAN_X = 320
const NODE_R = 22
const ROW_H = 80

export default function GaleShapleyViz() {
  const [stepIdx, setStepIdx] = useState(-1)  // -1 = initial state
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentStep = stepIdx >= 0 ? STEPS[stepIdx] : null
  const matching = currentStep?.matching ?? {}

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx((i) => {
          if (i >= STEPS.length - 1) { setPlaying(false); return i }
          return i + 1
        })
      }, 1500)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing])

  const reset = () => { setStepIdx(-1); setPlaying(false) }
  const step = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1))
  const back = () => setStepIdx((i) => Math.max(i - 1, -1))

  const svgH = ROW_H * 3 + 40
  const svgW = 420

  return (
    <div>
      <div className="alert alert-info mb-2" style={{ fontSize: '0.85rem' }}>
        <strong>Preferences:</strong> m1: w1&gt;w2&gt;w3 | m2: w2&gt;w1&gt;w3 | m3: w1&gt;w3&gt;w2 &nbsp;|&nbsp;
        w1: m2&gt;m1&gt;m3 | w2: m1&gt;m2&gt;m3 | w3: m1&gt;m2&gt;m3
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        style={{ maxWidth: svgW, display: 'block', margin: '0 auto' }}
        aria-label="Gale-Shapley step visualization"
      >
        {/* Column labels */}
        <text x={MAN_X} y="18" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1a365d">Men</text>
        <text x={WOMAN_X} y="18" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#44337a">Women</text>

        {/* Current matching lines (green) */}
        {Object.entries(matching).map(([w, m]) => {
          const wi = WOMEN.indexOf(w); const mi = MEN.indexOf(m)
          if (wi < 0 || mi < 0) return null
          const x1 = MAN_X + NODE_R, y1 = 30 + mi * ROW_H + NODE_R
          const x2 = WOMAN_X - NODE_R, y2 = 30 + wi * ROW_H + NODE_R
          return <line key={`${m}-${w}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38a169" strokeWidth="3" strokeDasharray={currentStep?.action === 'done' ? 'none' : '6,3'} opacity="0.7" />
        })}

        {/* Proposal arrow */}
        {currentStep && currentStep.action !== 'done' && (
          (() => {
            const mi = MEN.indexOf(currentStep.proposer)
            const wi = WOMEN.indexOf(currentStep.proposee)
            if (mi < 0 || wi < 0) return null
            const x1 = MAN_X + NODE_R, y1 = 30 + mi * ROW_H + NODE_R
            const x2 = WOMAN_X - NODE_R, y2 = 30 + wi * ROW_H + NODE_R
            const color = currentStep.action === 'reject' ? '#e53e3e' : '#3182ce'
            return (
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color} strokeWidth="2.5"
                markerEnd={`url(#arrow-${currentStep.action})`}
                strokeDasharray={currentStep.action === 'reject' ? '5,4' : 'none'}
              />
            )
          })()
        )}

        {/* Arrow markers */}
        <defs>
          <marker id="arrow-accept" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#3182ce" />
          </marker>
          <marker id="arrow-reject" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#e53e3e" />
          </marker>
          <marker id="arrow-propose" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#3182ce" />
          </marker>
        </defs>

        {/* Men nodes */}
        {MEN.map((m, i) => {
          const cy = 30 + i * ROW_H + NODE_R
          const isProposer = currentStep?.proposer === m
          return (
            <g key={m}>
              <circle cx={MAN_X} cy={cy} r={NODE_R}
                fill={isProposer ? '#3182ce' : '#1a365d'} stroke={Object.values(matching).includes(m) ? '#38a169' : '#1a365d'} strokeWidth={Object.values(matching).includes(m) ? '3' : '1'} />
              <text x={MAN_X} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">{m}</text>
            </g>
          )
        })}

        {/* Women nodes */}
        {WOMEN.map((w, i) => {
          const cy = 30 + i * ROW_H + NODE_R
          const isProposee = currentStep?.proposee === w
          return (
            <g key={w}>
              <circle cx={WOMAN_X} cy={cy} r={NODE_R}
                fill={isProposee ? '#805ad5' : '#44337a'} stroke={matching[w] ? '#38a169' : '#44337a'} strokeWidth={matching[w] ? '3' : '1'} />
              <text x={WOMAN_X} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">{w}</text>
            </g>
          )
        })}
      </svg>

      {/* Message */}
      <div className="alert alert-info mt-2" style={{ minHeight: '2.5rem', fontSize: '0.9rem' }}>
        {currentStep ? currentStep.message : 'Press Play or Step to start the algorithm.'}
      </div>

      {/* Controls */}
      <div className="viz-controls">
        <button className="btn btn-secondary btn-sm" onClick={reset}>⟳ Reset</button>
        <button className="btn btn-secondary btn-sm" onClick={back} disabled={stepIdx < 0}>◀ Back</button>
        <button className="btn btn-primary btn-sm" onClick={() => setPlaying(!playing)} disabled={stepIdx >= STEPS.length - 1}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={step} disabled={stepIdx >= STEPS.length - 1}>▶ Step</button>
        <span className="text-muted text-small">Step {Math.max(stepIdx + 1, 0)} / {STEPS.length}</span>
      </div>
    </div>
  )
}
