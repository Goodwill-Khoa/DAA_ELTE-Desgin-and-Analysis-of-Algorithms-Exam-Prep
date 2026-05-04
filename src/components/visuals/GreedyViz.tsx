import { useState, useEffect, useRef } from 'react'

interface Interval { id: string; start: number; end: number; label: string }

const INTERVALS: Interval[] = [
  { id: 'A', start: 1, end: 4, label: 'A' },
  { id: 'B', start: 3, end: 5, label: 'B' },
  { id: 'C', start: 0, end: 6, label: 'C' },
  { id: 'D', start: 5, end: 7, label: 'D' },
  { id: 'E', start: 3, end: 9, label: 'E' },
  { id: 'F', start: 5, end: 10, label: 'F' },
  { id: 'G', start: 6, end: 11, label: 'G' },
  { id: 'H', start: 8, end: 12, label: 'H' },
]

// Pre-compute greedy steps (sorted by finish time)
function buildSteps() {
  const sorted = [...INTERVALS].sort((a, b) => a.end - b.end)
  const steps: { considering: string; selected: string[]; rejected: string[]; message: string }[] = []
  const selected: string[] = []
  const rejected: string[] = []
  let lastEnd = -Infinity

  for (const iv of sorted) {
    const prevSelected = [...selected]
    const prevRejected = [...rejected]
    if (iv.start >= lastEnd) {
      selected.push(iv.id)
      lastEnd = iv.end
      steps.push({
        considering: iv.id,
        selected: [...selected],
        rejected: [...rejected],
        message: `Consider ${iv.id} [${iv.start},${iv.end}]. Compatible (starts at ${iv.start} ≥ last end ${lastEnd === iv.end ? '−∞' : lastEnd - (iv.end - lastEnd === 0 ? 0 : 0)}). ✓ SELECT ${iv.id}.`,
      })
    } else {
      rejected.push(iv.id)
      steps.push({
        considering: iv.id,
        selected: [...selected],
        rejected: [...rejected],
        message: `Consider ${iv.id} [${iv.start},${iv.end}]. Overlaps! (${iv.start} < last end ${lastEnd}). ✗ Skip ${iv.id}.`,
      })
    }
    void prevSelected; void prevRejected
  }

  steps.push({
    considering: '',
    selected: [...selected],
    rejected: [...rejected],
    message: `Done! Selected intervals: {${selected.join(', ')}} — maximum ${selected.length} non-overlapping intervals.`,
  })

  return { sorted, steps }
}

const { sorted: SORTED, steps: STEPS } = buildSteps()
const MAX_T = 13

export default function GreedyViz() {
  const [stepIdx, setStepIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentStep = stepIdx >= 0 ? STEPS[stepIdx] : null

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx((i) => {
          if (i >= STEPS.length - 1) { setPlaying(false); return i }
          return i + 1
        })
      }, 1400)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing])

  const reset = () => { setStepIdx(-1); setPlaying(false) }
  const step = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1))
  const back = () => setStepIdx((i) => Math.max(i - 1, -1))

  const svgW = 500
  const rowH = 28
  const svgH = SORTED.length * rowH + 60
  const timelineY = svgH - 30
  const xOff = 60
  const xScale = (svgW - xOff - 20) / MAX_T

  const getColor = (id: string): string => {
    if (!currentStep) return '#cbd5e0'
    if (currentStep.selected.includes(id)) return '#38a169'
    if (currentStep.rejected.includes(id)) return '#e53e3e'
    if (currentStep.considering === id) return '#3182ce'
    return '#cbd5e0'
  }

  return (
    <div>
      <div className="alert alert-info mb-2" style={{ fontSize: '0.85rem' }}>
        <strong>Algorithm:</strong> Sort by finish time → greedily add if compatible (no overlap with last selected).
        <span style={{ marginLeft: '1rem' }}>
          🟢 Selected &nbsp; 🔴 Rejected &nbsp; 🔵 Considering
        </span>
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        style={{ maxWidth: svgW, display: 'block', margin: '0 auto' }}
        aria-label="Interval scheduling greedy visualization"
      >
        {/* Timeline ticks */}
        {Array.from({ length: MAX_T + 1 }, (_, t) => (
          <g key={t}>
            <line x1={xOff + t * xScale} y1={timelineY - 4} x2={xOff + t * xScale} y2={timelineY + 4} stroke="#718096" strokeWidth="1" />
            <text x={xOff + t * xScale} y={timelineY + 16} textAnchor="middle" fontSize="9" fill="#718096">{t}</text>
          </g>
        ))}
        <line x1={xOff} y1={timelineY} x2={xOff + MAX_T * xScale} y2={timelineY} stroke="#718096" strokeWidth="1.5" />
        <text x={xOff - 4} y={timelineY + 5} textAnchor="end" fontSize="9" fill="#718096">t</text>

        {/* Intervals (sorted by finish time) */}
        {SORTED.map((iv, i) => {
          const x = xOff + iv.start * xScale
          const w = (iv.end - iv.start) * xScale
          const y = 10 + i * rowH
          const color = getColor(iv.id)
          const textColor = color === '#cbd5e0' ? '#4a5568' : '#fff'
          return (
            <g key={iv.id}>
              <rect x={x} y={y} width={w} height={rowH - 5} rx="4" fill={color} opacity="0.9" />
              <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="11" fontWeight="bold" fill={textColor}>{iv.label}</text>
              <text x={x + w / 2} y={y + 24} textAnchor="middle" fontSize="8" fill={textColor} opacity="0.85">[{iv.start},{iv.end}]</text>
            </g>
          )
        })}
      </svg>

      <div className="alert alert-info mt-2" style={{ minHeight: '2.5rem', fontSize: '0.9rem' }}>
        {currentStep ? currentStep.message : 'Intervals sorted by finish time. Press Play to start greedy selection.'}
      </div>

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
