import { useState } from 'react'
import { archNodes } from '../data'
import { SectionHeader, Reveal, FileTag } from './ui'

export function Architecture() {
  const [active, setActive] = useState(archNodes[0].id)
  const node = archNodes.find((n) => n.id === active) ?? archNodes[0]

  return (
    <section id="architecture">
      <div className="wrap">
        <SectionHeader
          kicker="System architecture"
          title="How the pieces connect"
          sub="Click any box to see what that layer is responsible for and the exact file that implements it."
        />

        <Reveal>
          <div className="arch-grid">
            {archNodes.map((n) => (
              <div
                key={n.id}
                className={`card arch-node hoverable ${active === n.id ? 'active' : ''}`}
                onClick={() => setActive(n.id)}
              >
                <h3><span className="dot" />{n.title}</h3>
                <p style={{ fontSize: 13, marginBottom: 6 }}>{n.subtitle}</p>
                <span className="file-tag">↳ {n.file}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="arch-flow">
            <span className="arr">[ client ]</span>
            <span className="arr">→</span>
            <span className="chip">axios · baseURL /api/v1</span>
            <span className="arr">→</span>
            <span className="chip">router + middleware</span>
            <span className="arr">→</span>
            <span className="chip">controller + validators</span>
            <span className="arr">→</span>
            <span className="chip">Mongoose models</span>
            <span className="arr">→</span>
            <span className="chip">MongoDB</span>
            <span className="arr" style={{ marginLeft: 6 }}>⇄</span>
            <span className="chip">LDAP (AD)</span>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="arch-detail">
            <h4>{node.title} <span style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: 14 }}>— {node.subtitle}</span></h4>
            <p>{node.detail}</p>
            <FileTag file={node.file} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}