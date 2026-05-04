import { useState } from 'react'
import type { Question } from '../types'
import VisualOverlay from './VisualOverlay'

interface Props {
  question: Question
  index: number
  onAnswer?: (correct: boolean, timeSpentSec: number) => void
  onFlag?: (flag: 'markedReview' | 'markedUnderstood', value: boolean) => void
  markedReview?: boolean
  markedUnderstood?: boolean
  showResultImmediate?: boolean
}

export default function QuestionCard({
  question,
  index,
  onAnswer,
  onFlag,
  markedReview = false,
  markedUnderstood = false,
  showResultImmediate = false,
}: Props) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showVisual, setShowVisual] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [freeText, setFreeText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [startTime] = useState(() => Date.now())

  const handleSubmit = () => {
    if (submitted) return
    setSubmitted(true)
    const elapsed = Math.round((Date.now() - startTime) / 1000)
    let correct = false
    if (question.choices && selectedChoice !== null) {
      correct = question.choices[selectedChoice] === question.answer
    } else if (freeText.trim()) {
      correct = freeText.trim().toLowerCase().includes(question.answer.slice(0, 30).toLowerCase())
    }
    onAnswer?.(correct, elapsed)
    if (showResultImmediate) setShowSolution(true)
  }

  const isCorrect =
    submitted &&
    question.choices &&
    selectedChoice !== null &&
    question.choices[selectedChoice] === question.answer

  return (
    <div className="qcard card mb-3">
      {/* Header */}
      <div className="qcard-header">
        <span className="qcard-num">Q{index + 1}</span>
        <div className="flex gap-1 flex-wrap">
          <span className={`badge badge-${question.difficulty}`}>{question.difficulty}</span>
          <span className={`badge badge-${question.type}`}>{question.type}</span>
          <span className="badge badge-topic">{question.topic.replace(/-/g, ' ')}</span>
          <span className="text-muted text-small">⏱ ~{question.timeEstimateMin} min</span>
        </div>
      </div>

      {/* Prompt */}
      <div className="qcard-prompt mt-2">
        <p style={{ whiteSpace: 'pre-wrap' }}>{question.prompt}</p>
      </div>

      {/* Choices */}
      {question.choices && (
        <div className="qcard-choices mt-2" role="radiogroup" aria-label="Answer choices">
          {question.choices.map((choice, i) => {
            let cls = 'choice-btn'
            if (submitted) {
              if (choice === question.answer) cls += ' choice-correct'
              else if (i === selectedChoice) cls += ' choice-wrong'
            } else if (i === selectedChoice) {
              cls += ' choice-selected'
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => !submitted && setSelectedChoice(i)}
                role="radio"
                aria-checked={selectedChoice === i}
                disabled={submitted}
              >
                <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                {choice}
              </button>
            )
          })}
        </div>
      )}

      {/* Free text */}
      {!question.choices && !submitted && (
        <div className="mt-2">
          <textarea
            className="qcard-textarea"
            placeholder="Write your answer here (for self-check)..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={3}
            aria-label="Your answer"
          />
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <div className="mt-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={question.choices ? selectedChoice === null : false}
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Result indicator */}
      {submitted && question.choices && (
        <div className={`alert mt-2 ${isCorrect ? 'alert-success' : 'alert-danger'}`}>
          {isCorrect ? '✓ Correct!' : `✗ Incorrect. The correct answer is: ${question.answer}`}
        </div>
      )}

      {/* Action buttons */}
      <div className="qcard-actions mt-3">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowHint(!showHint)}
          aria-expanded={showHint}
        >
          💡 {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowSolution(!showSolution)}
          aria-expanded={showSolution}
        >
          📖 {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
        {question.visualId && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowVisual(true)}
          >
            🎬 I don't understand
          </button>
        )}
        {onFlag && (
          <>
            <button
              className={`btn btn-sm ${markedUnderstood ? 'btn-success' : 'btn-ghost'}`}
              onClick={() => onFlag('markedUnderstood', !markedUnderstood)}
              aria-pressed={markedUnderstood}
            >
              ✓ {markedUnderstood ? 'Understood' : 'Mark Understood'}
            </button>
            <button
              className={`btn btn-sm ${markedReview ? 'btn-danger' : 'btn-ghost'}`}
              onClick={() => onFlag('markedReview', !markedReview)}
              aria-pressed={markedReview}
            >
              🔖 {markedReview ? 'Needs Review' : 'Flag for Review'}
            </button>
          </>
        )}
      </div>

      {/* Hint */}
      {showHint && (
        <div className="alert alert-info mt-2">
          <strong>Hint:</strong> {question.hint}
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="qcard-solution mt-2">
          <h4 className="mb-1">✅ Solution</h4>
          <div className="alert alert-success mb-2">
            <strong>Answer:</strong> {question.answer}
          </div>
          {question.steps.length > 0 && (
            <ol className="solution-steps">
              {question.steps.map((step, i) => (
                <li key={i} style={{ whiteSpace: 'pre-wrap' }}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Visual Overlay */}
      {showVisual && question.visualId && (
        <VisualOverlay visualId={question.visualId} onClose={() => setShowVisual(false)} />
      )}

      <style>{`
        .qcard-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; }
        .qcard-num { font-size: 1.1rem; font-weight: 700; color: var(--primary); flex-shrink: 0; }
        .qcard-prompt { font-size: 1rem; }
        .qcard-choices { display: flex; flex-direction: column; gap: 0.4rem; }
        .choice-btn {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 1rem;
          border: 2px solid var(--border);
          border-radius: var(--radius);
          background: #fff;
          cursor: pointer;
          text-align: left;
          font-size: 0.95rem;
          transition: border-color 0.15s, background 0.15s;
        }
        .choice-btn:hover:not(:disabled) { border-color: var(--accent-dark); background: #ebf8ff; }
        .choice-btn:focus-visible { outline: 2px solid var(--accent-dark); outline-offset: 2px; }
        .choice-selected { border-color: var(--accent-dark); background: #ebf8ff; }
        .choice-correct { border-color: var(--success); background: #f0fff4; }
        .choice-wrong { border-color: var(--danger); background: #fff5f5; }
        .choice-letter {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--border); font-weight: 700; font-size: 0.8rem; flex-shrink: 0;
        }
        .qcard-textarea {
          width: 100%; padding: 0.6rem; border: 1px solid var(--border);
          border-radius: var(--radius); font-size: 0.95rem; font-family: inherit;
          resize: vertical; min-height: 80px;
        }
        .qcard-textarea:focus { outline: 2px solid var(--accent-dark); border-color: var(--accent-dark); }
        .qcard-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .solution-steps { padding-left: 1.5rem; }
        .solution-steps li { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  )
}
