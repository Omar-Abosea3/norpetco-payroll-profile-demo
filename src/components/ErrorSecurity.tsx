import { errorFormats, securityItems, securityGaps } from '../data'
import { SectionHeader, Reveal } from './ui'

export function ErrorSecurity() {
  return (
    <section id="security">
      <div className="wrap">
        <SectionHeader
          kicker="Errors & security"
          title="Predictable errors, layered security"
          sub="Every failure mode has a shape; every route has a guard. Honest notes about what is intentionally not included."
        />

        <Reveal>
          <div className="two-col">
            <div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15 }}>🧯 Error handling contract</h3>
                <table className="data">
                  <thead><tr><th>Case</th><th>Response</th></tr></thead>
                  <tbody>
                    {errorFormats.map((e) => (
                      <tr key={e.label}>
                        <td style={{ width: 175, fontFamily: 'var(--mono)', fontSize: 12 }}>{e.label}</td>
                        <td>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent-3)' }}>{e.shape}</span>
                          <div style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 3 }}>{e.where}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: 13, marginTop: 12 }}>
                  Controllers are wrapped in <code>asyncHandeller</code>; <code>glopalErrorHandelling</code> turns any
                  thrown error into <code>{'{ message, stack }'}</code> with the HTTP status read from <code>err.cause</code>.
                </p>
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15 }}>🔒 Security measures</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-muted)', fontSize: 13.5 }}>
                  {securityItems.map((s) => (
                    <li key={s.title} style={{ marginBottom: 10 }}>
                      <b style={{ color: 'var(--text)' }}>{s.title}.</b> {s.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="card" style={{ padding: 20, marginTop: 20, borderColor: 'rgb(248 113 113 / 0.3)' }}>
            <h3 style={{ fontSize: 15, color: 'var(--bad)' }}>⚠️ Honest limitations</h3>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--text-muted)', fontSize: 13.5 }}>
              {securityGaps.map((g) => (
                <li key={g} style={{ marginBottom: 6 }}>{g}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}