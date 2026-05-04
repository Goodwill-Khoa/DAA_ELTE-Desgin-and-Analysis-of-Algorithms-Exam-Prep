interface BarData { label: string; value: number; max?: number; color?: string }

interface Props {
  data: BarData[]
  title: string
  height?: number
  showPercent?: boolean
}

export default function ProgressChart({ data, title, height = 160, showPercent = true }: Props) {
  const maxVal = Math.max(...data.map((d) => d.max ?? d.value), 100)
  const barWidth = Math.floor(300 / Math.max(data.length, 1)) - 8
  const svgWidth = data.length * (barWidth + 8) + 40
  const svgHeight = height + 50

  return (
    <div>
      <h4 className="mb-2">{title}</h4>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        style={{ maxWidth: svgWidth, display: 'block' }}
        role="img"
        aria-label={title}
      >
        {/* Y axis */}
        <line x1="30" y1="10" x2="30" y2={height + 10} stroke="#e2e8f0" strokeWidth="1" />
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = height + 10 - (pct / 100) * height
          return (
            <g key={pct}>
              <line x1="28" y1={y} x2={svgWidth - 5} y2={y} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x="25" y={y + 4} textAnchor="end" fontSize="9" fill="#718096">{pct}%</text>
            </g>
          )
        })}

        {data.map((d, i) => {
          const pct = (d.value / maxVal) * 100
          const barH = Math.max((pct / 100) * height, 2)
          const x = 35 + i * (barWidth + 8)
          const y = height + 10 - barH
          const color = d.color ?? (pct >= 70 ? '#38a169' : pct >= 40 ? '#d69e2e' : '#e53e3e')
          return (
            <g key={i}>
              <rect
                x={x} y={y}
                width={barWidth} height={barH}
                fill={color} rx="3"
                role="presentation"
              >
                <title>{d.label}: {d.value}{showPercent ? '%' : ''}</title>
              </rect>
              <text
                x={x + barWidth / 2} y={height + 24}
                textAnchor="middle" fontSize="9" fill="#4a5568"
              >
                {d.label.length > 8 ? d.label.slice(0, 8) + '…' : d.label}
              </text>
              {showPercent && (
                <text
                  x={x + barWidth / 2} y={y - 3}
                  textAnchor="middle" fontSize="9" fill="#4a5568"
                >
                  {d.value}%
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
