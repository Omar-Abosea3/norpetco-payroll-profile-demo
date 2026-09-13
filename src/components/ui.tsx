import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { RouteMethod } from '../data'

/* Reveal-on-scroll wrapper */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export function SectionHeader({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <Reveal>
      <div className="kicker">{kicker}</div>
      <h2 className="sec-title">{title}</h2>
      {sub && <p className="sec-sub" dangerouslySetInnerHTML={{ __html: sub }} />}
    </Reveal>
  )
}

export function Method({ m }: { m: RouteMethod }) {
  return <span className={`method ${m}`}>{m}</span>
}

export function SimTag() {
  return <span className="sim-tag">Simulated response</span>
}

/* JSON pretty-printer with syntax highlighting */
export function Json({ value }: { value: unknown }) {
  const json = JSON.stringify(value, null, 2)
  const lines = json.split('\n').map((line, i) => {
    const trimmed = line
    // key: value  |  "key": ...   |   [ ] { }
    const keyMatch = trimmed.match(/^(\s*)"([^"]+)":\s(.*)$/)
    if (keyMatch) {
      const indent = keyMatch[1]
      const key = keyMatch[2]
      const rest = keyMatch[3]
      return (
        <div key={i} className="jsonline">
          <span className="pk">{indent}"{key}"</span>
          <span>: </span>
          {renderValue(rest)}
        </div>
      )
    }
    return (
      <div key={i} className="jsonline">
        {renderValue(trimmed)}
      </div>
    )
  })
  return <div className="jsonview">{lines}</div>
}

function renderValue(rest: string): ReactNode {
  if (rest.startsWith('"')) {
    return <span className="pv">{rest}</span>
  }
  if (/^-?\d/.test(rest)) {
    return <span className="pn">{rest}</span>
  }
  if (rest === 'true' || rest === 'false') {
    return <span className="pbool">{rest}</span>
  }
  if (/^[\]}]/.test(rest)) {
    return <span className="n">{rest}</span>
  }
  return <span className="c">{rest}</span>
}

export function FileTag({ file }: { file: string }) {
  return <span className="file-tag">↳ {file}</span>
}

export function Collapsible({ title, children, defaultOpen = false }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card">
      <div className="collapsible-summary" onClick={() => setOpen((o) => !o)}>
        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{open ? '▾' : '▸'}</span>
        </h3>
      </div>
      {open && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  )
}