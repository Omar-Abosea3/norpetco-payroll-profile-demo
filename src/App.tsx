import { useEffect, useState } from 'react'
import { Hero } from './components/Hero'
import { Goal } from './components/Goal'
import { Stack } from './components/Stack'
import { Architecture } from './components/Architecture'
import { Lifecycle } from './components/Lifecycle'
import { ApiExplorer } from './components/ApiExplorer'
import { AuthFlow } from './components/AuthFlow'
import { DataModel } from './components/DataModel'
import { Features } from './components/Features'
import { FrontendBackend } from './components/FrontendBackend'
import { Connect } from './components/Connect'
import { Codebase } from './components/Codebase'
import { Decisions } from './components/Decisions'
import { ErrorSecurity } from './components/ErrorSecurity'
import { Footer } from './components/Footer'

const navItems = [
  { id: 'goal', label: 'Goal' },
  { id: 'stack', label: 'Stack' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'api', label: 'API Explorer' },
  { id: 'auth', label: 'Auth Flow' },
  { id: 'data-model', label: 'Data Model' },
  { id: 'features', label: 'Deep Drive' },
  { id: 'frontend-backend', label: 'Frontend ↔ Backend' },
  { id: 'connect', label: 'Connect' },
  { id: 'codebase', label: 'Codebase' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'security', label: 'Security' },
  { id: 'what-i-built', label: 'Summary' },
]

export default function App() {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const ids = navItems.map((n) => n.id)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: [0.2, 0.5] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a
            className="brand"
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span className="logo">₱</span>
            <span>
              Norpetco Payroll
              <small>MERN · React showcase</small>
            </span>
          </a>

          <div className="nav-links">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`nav-link ${active === n.id ? 'active' : ''}`}>
                {n.label}
              </a>
            ))}
            <a
              className="nav-cta"
              href="#what-i-built"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('what-i-built')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              The Pitch ↗
            </a>
          </div>

          <button
            className={`nav-toggle ${menuOpen ? 'open' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
          {navItems.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`nav-link ${active === n.id ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </a>
          ))}
          <a
            className="nav-cta"
            href="#what-i-built"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('what-i-built')?.scrollIntoView({ behavior: 'smooth' })
              setMenuOpen(false)
            }}
          >
            The Pitch ↗
          </a>
        </div>
      </nav>

      <main>
        <Hero onExplore={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })} />
        <Goal />
        <Stack />
        <Architecture />
        <Lifecycle />
        <ApiExplorer />
        <AuthFlow />
        <DataModel />
        <Features />
        <FrontendBackend />
        <Connect />
        <Codebase />
        <Decisions />
        <ErrorSecurity />
        <Footer />
      </main>
    </>
  )
}