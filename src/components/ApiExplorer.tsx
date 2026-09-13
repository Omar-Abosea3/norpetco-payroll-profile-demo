import { useEffect, useMemo, useRef, useState } from 'react'
import { apiRoutes, routeCategories, type ApiRoute } from '../data'
import { SectionHeader, Reveal, Method, SimTag, Json, FileTag } from './ui'

export function ApiExplorer() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(apiRoutes[0].id)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    let list = apiRoutes
    if (category !== 'all') list = list.filter((r) => r.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (r) => r.path.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.method.toLowerCase().includes(q)
      )
    }
    return list
  }, [category, query])

  const route = apiRoutes.find((r) => r.id === selectedId) ?? apiRoutes[0]

  useEffect(() => {
    if (!filtered.some((r) => r.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? apiRoutes[0].id)
    }
  }, [filtered, selectedId])

  useEffect(() => {
    setSent(false)
  }, [selectedId])

  const sendDemo = () => {
    if (sending) return
    setSending(true)
    setSent(false)
    setTyping(true)
    setTimeout(() => {
      setSending(false)
      setTyping(false)
      setSent(true)
    }, 650)
  }

  const paramsCount = (r: ApiRoute) => (r.params?.map((p) => p.required).filter(Boolean).length ?? 0)

  return (
    <section id="api">
      <div className="wrap">
        <SectionHeader
          kicker="API explorer"
          title="Browse all 40 endpoints "
          sub="Filter by category or search. Select an endpoint to see its parameters, response shape and demo response. Every response shown is <b>simulated</b> to match the real controller output."
        />

        <Reveal>
          <div className="explorer">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {/* sidebar */}
              <div className="exp-sidebar">
                <div style={{ padding: '12px 12px 6px' }}>
                  <input
                    className="search-input"
                    placeholder="search method / path / desc…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="cat-tabs">
                  <button
                    className={`cat-tab ${category === 'all' ? 'active' : ''}`}
                    onClick={() => setCategory('all')}
                  >
                    <span>All endpoints</span>
                    <span className="mono">{apiRoutes.length}</span>
                  </button>
                  {routeCategories.map((c) => {
                    const count = apiRoutes.filter((r) => r.category === c.id).length
                    return (
                      <button key={c.id} className={`cat-tab ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
                        <span>{c.label}</span>
                        <span className="mono">{count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* body */}
              <div className="exp-body" style={{ flex: 1, minWidth: 0 }}>
                {/* mini list */}
                <div className="scroll-x" style={{ marginBottom: 14 }}>
                  <table className="data">
                    <tbody>
                      {filtered.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedId(r.id)}
                          style={{ cursor: 'pointer', background: r.id === selectedId ? 'rgba(99,102,241,0.12)' : undefined }}
                        >
                          <td style={{ width: 70, fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--text-dim)' }}>{r.method}</td>
                          <td className="mono-path">{r.path}</td>
                          <td style={{ width: 30, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>{paramsCount(r)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* detail */}
                <div ref={bodyRef}>
                  <div className="exp-head">
                    <Method m={route.method} />
                    <span className="mono-path" style={{ fontSize: 15, fontWeight: 600 }}>{route.path}</span>
                    <span className={`role-chip ${route.roles[0] !== 'public' ? 'secure' : ''}`}>{route.auth}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13.5, margin: '10px 0 2px' }}>{route.summary}</p>

                  {route.params && route.params.length > 0 && (
                    <>
                      <div className="exp-sub">Request parameters</div>
                      <table className="kv-table">
                        <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
                        <tbody>
                          {route.params.map((p) => (
                            <tr key={p.name}>
                              <td>{p.name}</td>
                              <td style={{ fontFamily: 'var(--mono)' }}>{p.type}</td>
                              <td>{p.required ? <span className="req">yes</span> : 'no'}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}

                  <div className="exp-sub">Response shape (real controller contract)</div>
                  <div style={{ position: 'relative' }}>
                    <pre className="code"><Json value={route.response} /></pre>
                  </div>

                  <div className="exp-sub">Error contract</div>
                  <pre className="code"><Json value={route.error} /></pre>

                  <button className="btn-send" onClick={sendDemo} disabled={sending}>
                    {sending ? 'sending…' : '▶ Send demo request'}
                  </button>
                  <span className="role-chip" style={{ marginLeft: 8, textTransform: 'none' }}>demo mode</span>

                  {sent && !typing && (
                    <div style={{ marginTop: 16, animation: 'pulse 0.3s' }}>
                      <SimTag />
                      <pre className="code" style={{ marginTop: 8, borderColor: 'rgb(251 191 36 / 0.35)' }}>
                        <span style={{ color: 'var(--warn)' }}>// 200 OK</span> · <span className="c">NOTE: SIMULATED — real backend not connected</span>
{'\n'}<Json value={route.response} />
                      </pre>
                      <FileTag file={route.sourceFile} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}