import { metrics, whatIBuilt, projectName, githubPlaceholder} from '../data'
import { SectionHeader, Reveal } from './ui'

export function Footer() {
  const placeholder = githubPlaceholder.includes('your-')
  return (
    <>
      <section id="metrics" style={{ paddingBottom: 20 }}>
        <div className="wrap">
          <SectionHeader kicker="Project metrics" title="Size at a glance" />
          <Reveal>
            <div className="grid grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))' }}>
              {metrics.map((m) => (
                <div className="card hoverable" key={m.label} style={{ textAlign: 'center', padding: '20px 14px' }}>
                  <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'var(--mono)' }}>{m.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.label}</div>
                  {m.detail && <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 4 }}>{m.detail}</div>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="what-i-built" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <SectionHeader kicker="What I built" title="The short story" />
          <div className="grid grid-2">
            {whatIBuilt.map((item, i) => (
              <Reveal key={item} delay={(i % 2) * 60}>
                <div className="card hoverable">
                  <div className="kicker" style={{ marginBottom: 8 }}>BUILT-{String(i + 1).padStart(2, '0')}</div>
                  <p style={{ color: 'var(--text)' }}>{item}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="card" style={{ marginTop: 22, padding: 24, textAlign: 'center', background: 'linear-gradient(135deg, rgb(99 102 241 / 0.12), rgb(45 212 191 / 0.08))' }}>
              <h3 style={{ fontSize: 18 }}>Interested in the full story?</h3>
              <p style={{ maxWidth: 560, margin: '6px auto 18px' }}>
                {projectName} — REST API on Express 5 + MongoDB, React SPA on Vite, LVAP-style AD login, RBAC,
                Excel import pipelines and PDF reporting. Live Production: <code style={{ fontFamily: 'var(--mono)' }}>http://fin.norpetco.com</code>.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <a className="btn btn-primary" href={`https://github.com/${githubPlaceholder}`} target="_blank" rel="noreferrer">
                  Source on GitHub ↗
                </a>
              </div>
              {placeholder && (
                <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>
                  (This link is a placeholder — replace <code>githubPlaceholder</code> in <code>src/data.ts</code> with the real repo.)
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div>
            <b style={{ color: 'var(--text)' }}>Portfolio demo</b> · built for {projectName}
            <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--text-dim)', maxWidth: 620 }}>
              Showcase uses only information extracted from the actual source code. All API responses and flows are
              simulated — no live backend is contacted, and no secrets are displayed. Demo data ≠ production data.
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            React · TypeScript · Vite
            <div style={{ color: 'var(--text-dim)', marginTop: 4 }}>Explore ↓ the sections above and click everything.</div>
          </div>
        </div>
      </footer>
    </>
  )
}