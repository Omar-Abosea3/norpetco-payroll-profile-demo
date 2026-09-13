import { backendStack, frontendStack, infrastructureNotes } from '../data'
import { SectionHeader, Reveal } from './ui'

function StackCard({ title, items, accent }: { title: string; items: { name: string; detail: string }[]; accent: string }) {
  return (
    <Reveal>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ color: accent, marginBottom: 16 }}>{title}</h3>
        <table className="data">
          <thead>
            <tr><th>Technology</th><th>Role in the project</th></tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.name}>
                <td style={{ whiteSpace: 'nowrap' }}>{s.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{s.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  )
}

export function Stack() {
  return (
    <section id="stack">
      <div className="wrap">
        <SectionHeader
          kicker="Technology stack"
          title="Everything I used to ship this"
          sub="Every dependency below was detected in the project's package.json files or source — nothing is speculative."
        />

        <div className="two-col">
          <StackCard title="Backend · API" items={backendStack} accent="var(--accent-3)" />
          <StackCard title="Frontend · SPA" items={frontendStack} accent="var(--accent-2)" />
        </div>

        <Reveal delay={100}>
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            {infrastructureNotes.map((n, i) => (
              <div className="card hoverable" key={n}>
                <div className="kicker" style={{ marginBottom: 8 }}>INFRA-{String(i + 1).padStart(2, '0')}</div>
                <p>{n}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}