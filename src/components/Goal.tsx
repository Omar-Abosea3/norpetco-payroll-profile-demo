import { SectionHeader, Reveal } from './ui'

export function Goal() {
  return (
    <section id="goal">
      <div className="wrap">
        <SectionHeader
          kicker="Project goal"
          title="Why this system exists"
          sub="Norpetco's finance team was drowning in disconnected Excel files. This project turns corporate payroll spreadsheets into a single, secure, searchable system that employees and finance can both use."
        />

        <div className="grid grid-3">
          <Reveal><div className="card hoverable">
            <h3>🎯 The problem</h3>
            <p>
              Payroll, bonuses, allowances and deductions lived in monthly Excel exports scattered across machines.
              Adjacent data — departments, deduction codes, allowances codes — had no single dictionary, and
              employees had no way to see their own payslips. Files used Arabic numerals, Arabic date strings and
              inconsistent job keys ("١٠٠١" vs "1001"), making joins manually painful.
            </p>
          </div></Reveal>
          <Reveal delay={80}><div className="card hoverable">
            <h3>✅ The solution</h3>
            <p>
              A full MERN platform where finance uploads the same Excel files they already produce. The backend
              parses, normalizes and validates every row, then upserts into MongoDB. A React dashboard lets admins
              filter and chart, while employees log in with their corporate Active Directory account and see only
              their own salary, bonus and yearly profit — with printable PDF slips.
            </p>
          </div></Reveal>
          <Reveal delay={160}><div className="card hoverable">
            <h3>👥 Who it serves</h3>
            <p>
              <b>Finance admins</b> — import 9 kinds of sheets, audit totals, run the payroll dashboard.<br />
              <b>Employees</b> — self-service salary cards, half-month bonuses and yearly profits.<br />
              <b>IT/Systems</b> — a well-layered API with RBAC, LDAP, and a token store that scales to the org.
            </p>
          </div></Reveal>
        </div>

        <Reveal delay={120}>
          <div className="demo-banner" style={{ marginTop: 26 }}>
            <span>💡</span>
            <span>
              <b>Everything below is simulated.</b> The API Explorer, auth flow and diagrams model this project&apos;s
              real code; responses are hand-crafted to match actual controller shapes. No live backend is called,
              and no secrets are shown — only environment variable names.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}