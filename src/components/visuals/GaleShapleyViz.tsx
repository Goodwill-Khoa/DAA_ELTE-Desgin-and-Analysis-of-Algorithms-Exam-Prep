import { useEffect, useMemo, useRef, useState } from 'react'

type RandomizationType = 'balanced' | 'competitive' | 'diverse'

const RANDOMIZATION_LABELS: Record<RandomizationType, string> = {
  balanced: 'Balanced random',
  competitive: 'Competitive (popular choices)',
  diverse: 'Diverse (spread preferences)',
}

function makeAgents(prefix: 'm' | 'w', count: number) {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`)
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function rotate<T>(arr: T[], shift: number): T[] {
  if (arr.length === 0) return []
  const s = ((shift % arr.length) + arr.length) % arr.length
  return arr.slice(s).concat(arr.slice(0, s))
}

function buildPreferenceString(order: string[]) {
  return order.join('>')
}

function generatePreferences(men: string[], women: string[], style: RandomizationType) {
  const menPrefs: Record<string, string[]> = {}
  const womenPrefs: Record<string, string[]> = {}

  for (const m of men) {
    menPrefs[m] = shuffle(women)
  }

  if (style === 'balanced') {
    for (const w of women) {
      womenPrefs[w] = shuffle(men)
    }
    return { menPrefs, womenPrefs }
  }

  if (style === 'competitive') {
    const popular = shuffle(men)
    for (const w of women) {
      const ranked = [...popular]
      const i = Math.floor(Math.random() * ranked.length)
      const j = Math.floor(Math.random() * ranked.length)
      ;[ranked[i], ranked[j]] = [ranked[j], ranked[i]]
      womenPrefs[w] = ranked
    }
    return { menPrefs, womenPrefs }
  }

  const base = shuffle(men)
  for (let i = 0; i < women.length; i++) {
    womenPrefs[women[i]] = rotate(base, i)
  }
  return { menPrefs, womenPrefs }
}

interface Step {
  proposer: string
  proposee: string
  action: 'accept' | 'reject' | 'done'
  matching: Record<string, string>  // woman -> man (tentative)
  nextProposal: Record<string, number>  // man -> next index
  message: string
}

function buildSteps(
  men: string[],
  women: string[],
  menPrefs: Record<string, string[]>,
  womenPrefs: Record<string, string[]>
): Step[] {
  const steps: Step[] = []
  const matching: Record<string, string> = {}  // woman -> man
  const nextProposal: Record<string, number> = Object.fromEntries(men.map((m) => [m, 0]))

  const rank: Record<string, Record<string, number>> = {}
  for (const w of women) {
    rank[w] = {}
    womenPrefs[w].forEach((m, i) => { rank[w][m] = i })
  }

  let iterations = 0
  while (iterations < men.length * women.length * 4) {
    iterations++
    const freeMen = men.filter((m) => !Object.values(matching).includes(m))
    if (freeMen.length === 0) break

    for (const m of freeMen) {
      if (nextProposal[m] >= women.length) continue
      const w = menPrefs[m][nextProposal[m]]
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

const MAN_X = 100
const WOMAN_X = 420

export default function GaleShapleyViz() {
  const [count, setCount] = useState(3)
  const [randomization, setRandomization] = useState<RandomizationType>('balanced')
  const [seed, setSeed] = useState(0)
  const [stepIdx, setStepIdx] = useState(-1)  // -1 = initial state
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { men, women, menPrefs, womenPrefs, steps } = useMemo(() => {
    const menList = makeAgents('m', count)
    const womenList = makeAgents('w', count)
    const prefs = generatePreferences(menList, womenList, randomization)
    return {
      men: menList,
      women: womenList,
      menPrefs: prefs.menPrefs,
      womenPrefs: prefs.womenPrefs,
      steps: buildSteps(menList, womenList, prefs.menPrefs, prefs.womenPrefs),
    }
  }, [count, randomization, seed])

  useEffect(() => {
    setStepIdx(-1)
    setPlaying(false)
  }, [count, randomization, seed])

  const currentStep = stepIdx >= 0 ? steps[stepIdx] : null
  const matching = currentStep?.matching ?? {}

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx((i) => {
          if (i >= steps.length - 1) { setPlaying(false); return i }
          return i + 1
        })
      }, 1100)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing, steps.length])

  const reset = () => { setStepIdx(-1); setPlaying(false) }
  const step = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1))
  const back = () => setStepIdx((i) => Math.max(i - 1, -1))

  const rowH = count <= 4 ? 78 : count <= 7 ? 60 : 50
  const nodeR = count <= 5 ? 20 : count <= 8 ? 18 : 15
  const nodeFont = count <= 7 ? 13 : 11
  const svgH = 40 + rowH * count
  const svgW = 520
  const prefText = [
    ...men.map((m) => `${m}: ${buildPreferenceString(menPrefs[m])}`),
    ...women.map((w) => `${w}: ${buildPreferenceString(womenPrefs[w])}`),
  ].join(' | ')

  return (
    <div>
      <div className="card mb-2" style={{ padding: '0.75rem' }}>
        <div className="flex gap-2 flex-wrap items-center">
          <label className="text-small" htmlFor="gs-size" style={{ fontWeight: 600 }}>Participants (m = w):</label>
          <input
            id="gs-size"
            type="number"
            min={3}
            max={10}
            value={count}
            onChange={(e) => {
              const raw = Number(e.target.value)
              if (Number.isNaN(raw)) return
              setCount(Math.max(3, Math.min(10, raw)))
            }}
            style={{ width: 72, padding: '0.25rem 0.45rem', border: '1px solid #cbd5e0', borderRadius: 6 }}
            aria-label="Number of participants"
          />

          <label className="text-small" htmlFor="gs-randomization" style={{ fontWeight: 600 }}>Randomization:</label>
          <select
            id="gs-randomization"
            value={randomization}
            onChange={(e) => setRandomization(e.target.value as RandomizationType)}
            style={{ padding: '0.25rem 0.45rem', border: '1px solid #cbd5e0', borderRadius: 6 }}
            aria-label="Randomization style"
          >
            <option value="balanced">{RANDOMIZATION_LABELS.balanced}</option>
            <option value="competitive">{RANDOMIZATION_LABELS.competitive}</option>
            <option value="diverse">{RANDOMIZATION_LABELS.diverse}</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={() => setSeed((s) => s + 1)}>Randomize Instance</button>
        </div>
      </div>

      <div className="alert alert-info mb-2" style={{ fontSize: '0.9rem', lineHeight: 1.45 }}>
        <strong>Preferences:</strong> {prefText}
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
          const wi = women.indexOf(w); const mi = men.indexOf(m)
          if (wi < 0 || mi < 0) return null
          const x1 = MAN_X + nodeR, y1 = 30 + mi * rowH + nodeR
          const x2 = WOMAN_X - nodeR, y2 = 30 + wi * rowH + nodeR
          return <line key={`${m}-${w}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38a169" strokeWidth="3" strokeDasharray={currentStep?.action === 'done' ? 'none' : '6,3'} opacity="0.7" />
        })}

        {/* Proposal arrow */}
        {currentStep && currentStep.action !== 'done' && (
          (() => {
            const mi = men.indexOf(currentStep.proposer)
            const wi = women.indexOf(currentStep.proposee)
            if (mi < 0 || wi < 0) return null
            const x1 = MAN_X + nodeR, y1 = 30 + mi * rowH + nodeR
            const x2 = WOMAN_X - nodeR, y2 = 30 + wi * rowH + nodeR
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
        {men.map((m, i) => {
          const cy = 30 + i * rowH + nodeR
          const isProposer = currentStep?.proposer === m
          return (
            <g key={m}>
              <circle cx={MAN_X} cy={cy} r={nodeR}
                fill={isProposer ? '#3182ce' : '#1a365d'} stroke={Object.values(matching).includes(m) ? '#38a169' : '#1a365d'} strokeWidth={Object.values(matching).includes(m) ? '3' : '1'} />
              <text x={MAN_X} y={cy + 5} textAnchor="middle" fontSize={nodeFont} fontWeight="bold" fill="#fff">{m}</text>
            </g>
          )
        })}

        {/* Women nodes */}
        {women.map((w, i) => {
          const cy = 30 + i * rowH + nodeR
          const isProposee = currentStep?.proposee === w
          return (
            <g key={w}>
              <circle cx={WOMAN_X} cy={cy} r={nodeR}
                fill={isProposee ? '#805ad5' : '#44337a'} stroke={matching[w] ? '#38a169' : '#44337a'} strokeWidth={matching[w] ? '3' : '1'} />
              <text x={WOMAN_X} y={cy + 5} textAnchor="middle" fontSize={nodeFont} fontWeight="bold" fill="#fff">{w}</text>
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
        <button className="btn btn-primary btn-sm" onClick={() => setPlaying(!playing)} disabled={stepIdx >= steps.length - 1}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={step} disabled={stepIdx >= steps.length - 1}>▶ Step</button>
        <span className="text-muted text-small">Step {Math.max(stepIdx + 1, 0)} / {steps.length}</span>
      </div>
    </div>
  )
}
