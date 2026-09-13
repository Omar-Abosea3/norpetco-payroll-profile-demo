import { useState } from 'react'
import { lifecycleSteps } from '../data'
import { SectionHeader, Reveal } from './ui'

export function Lifecycle() {
  const [active, setActive] = useState(0)
  return (
    <section id="lifecycle" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHeader
          kicker="Request lifecycle"
          title="What happens on every API call"
          sub="Walk through one request (e.g. an admin listing payroll) — click each step."
        />
        <Reveal>
          <div>
            {lifecycleSteps.map((s, i) => (
              <div key={s.title} className={`life-step ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                <div className="numz">{i + 1}</div>
                <div className="bodyz">
                  <h4>{s.title}</h4>
                  <div>
                    <p>{s.detail}</p>
                    <p className="mono-tag">↳ {s.file}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}