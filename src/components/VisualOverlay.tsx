import type { VisualId } from '../types'
import GaleShapleyViz from './visuals/GaleShapleyViz'
import GreedyViz from './visuals/GreedyViz'
import DivideConquerViz from './visuals/DivideConquerViz'
import DPTableViz from './visuals/DPTableViz'

interface Props {
  visualId: VisualId
  onClose: () => void
}

const titles: Record<VisualId, string> = {
  'gale-shapley': 'Gale–Shapley Algorithm Visualization',
  'greedy-interval': 'Greedy Interval Scheduling Visualization',
  'recursion-tree': 'Recursion Tree – Divide & Conquer',
  'dp-table': 'DP Table Visualization',
  'master-method': 'Master Theorem Calculator',
}

export default function VisualOverlay({ visualId, onClose }: Props) {
  return (
    <div
      className="overlay-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={titles[visualId]}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="overlay-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>{titles[visualId]}</h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            aria-label="Close visualization"
          >
            ✕ Close
          </button>
        </div>
        {visualId === 'gale-shapley' && <GaleShapleyViz />}
        {visualId === 'greedy-interval' && <GreedyViz />}
        {(visualId === 'recursion-tree') && <DivideConquerViz />}
        {visualId === 'master-method' && <DivideConquerViz showCalculator />}
        {visualId === 'dp-table' && <DPTableViz />}
      </div>
    </div>
  )
}
