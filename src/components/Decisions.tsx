import { decisions } from '../data'
import { SectionHeader, Reveal } from './ui'

export function Decisions() {
  return (
    <section id="decisions">
      <div className="wrap">
        <SectionHeader
          kicker="Engineering decisions"
          title="Why I built it this way"
          sub="Deliberate trade-offs worth discussing in an interview."
        />
        <div className="grid grid-2">
          {decisions.map((d, i) => (
            <Reveal key={d.title} delay={(i % 2) * 60}>
              <div className="card hoverable">
                <div className="kicker" style={{ marginBottom: 8 }}>DECISION-{String(i + 1).padStart(2, '0')}</div>
                <h3>{d.title}</h3>
                <p>{d.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}