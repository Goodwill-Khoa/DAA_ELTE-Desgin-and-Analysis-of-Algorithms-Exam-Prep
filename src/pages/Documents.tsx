import documentsData from '../../Documents/index.json'

const BASE = import.meta.env.BASE_URL

interface Document {
  id: string
  title: string
  filename: string
  author: string
  date: string
  tags: string[]
  description: string
}

const documents: Document[] = documentsData

const TAG_COLORS: Record<string, string> = {
  introduction: '#3182ce',
  'stable-matching': '#805ad5',
  'gale-shapley': '#6b46c1',
  greedy: '#d69e2e',
  'divide-and-conquer': '#2f855a',
  'dynamic-programming': '#c05621',
  'master-theorem': '#276749',
  'all-topics': '#1a365d',
  reference: '#2c7a7b',
  practice: '#702459',
  advanced: '#742a2a',
  complexity: '#744210',
}

export default function Documents() {
  return (
    <div>
      <div className="mb-4">
        <h1 style={{ marginBottom: '0.25rem' }}>📄 Course Documents</h1>
        <p className="text-muted">
          Lecture notes and reference materials for the DAA course by Dr. László Szabó.
        </p>
      </div>

      <div className="grid-2">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={`${BASE}Documents/${doc.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>📑</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>{doc.title}</h3>
                <p className="text-muted text-small" style={{ marginBottom: '0.5rem' }}>
                  {doc.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: TAG_COLORS[tag] ?? '#4a5568',
                        color: '#fff',
                        borderRadius: '0.25rem',
                        padding: '0.1rem 0.4rem',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
