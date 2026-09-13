import { features } from '../data'
import { SectionHeader, Reveal, FileTag } from './ui'

export function Features() {
  return (
    <section id="features">
      <div className="wrap">
        <SectionHeader
          kicker="Feature deep-dive"
          title="What makes this more than a CRUD app"
          sub="The five hard parts — enterprise auth, Excel ingestion, querying, RBAC and reporting — and how each was engineered."
        />
        <div className="grid grid-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 60}>
              <div className="card hoverable">
                <div className="kicker" style={{ marginBottom: 8 }}>FEATURE-{String(i + 1).padStart(2, '0')}</div>
                <h3>{f.title}</h3>
                <p>{f.detail}</p>
                <FileTag file={f.file} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}