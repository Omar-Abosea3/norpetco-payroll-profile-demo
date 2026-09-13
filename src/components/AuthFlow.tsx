import { useState } from 'react'
import { SectionHeader, Reveal, SimTag, FileTag } from './ui'

const phases = [
  {
    id: 'credentials',
    title: '1 · Credentials from AD',
    detail: 'Finance signs in with their corporate username + password. The backend calls ldap-authentication against DOMAIN_ACTIVE_DIRECTORY (Norpetco.org). No password is ever stored in MongoDB.',
    code: `// src/utils/authenticateUser.ts (simplified)
const options = {
  ldapOpts: { url: process.env.DOMAIN_ACTIVE_DIRECTORY },
  userDn: \`sAMAccountName=\${userName}, \${process.env.USER_SEARCH_BASE}\`,
  userPassword: password,
}
const adUser = await authenticate(options)`,
  },
  {
    id: 'role',
    title: '2 · Role from AD groups',
    detail: 'The user’s LDAP groups decide their role. If the group string includes "Finance admin", the user becomes admin — otherwise employee. This keeps RBAC authority inside Active Directory.',
    code: `// src/controllers/user.controller.ts (simplified)
const groups = adUser.controls?.['groupMembership'] ?? []
let role = systemRoles.STAF // "employee"
if (groups.some(g => g.toString().includes('Finance admin'))) {
  role = systemRoles.ADMIN // "admin"
}`,
  },
  {
    id: 'token',
    title: '3 · JWT issued & stored',
    detail: 'A token signed with JWT_SECRET (expires in 1 day, payload {id, userName}) is created and pushed into user.tokens[]. The response returns {message, groups, data, token}.',
    code: `// src/utils/token-manager.ts (simplified)
export const createToken = (id, userName) =>
  jwt.sign({ id, userName }, process.env.JWT_SECRET, { expiresIn: '1d' })`,
  },
  {
    id: 'authorize',
    title: '4 · Protected request',
    detail: 'The axios instance attaches the token to Authorization (no Bearer prefix — matching the backend). authMiddleware verifies signature, confirms the token is still in user.tokens, and checks the required role.',
    code: `// src/middleware/authMiddleware.ts (simplified)
const token = req.headers.authorization
const payload = verifyToken(token)
const user = await UserModel.findOne({ _id: payload.id })
if (!user.tokens.includes(token)) throw err(401)
if (!roles.includes(user.role)) throw err(403)`,
  },
]

export function AuthFlow() {
  const [active, setActive] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false)
  const phase = phases[active]

  const runFlow = () => {
    setLoggedIn(false)
    setActive(1)
    setTimeout(() => setActive(2), 900)
    setTimeout(() => setActive(3), 1800)
    setTimeout(() => setLoggedIn(true), 2700)
  }

  return (
    <section id="auth" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHeader
          kicker="Authentication flow"
          title="Corporate sign-in, zero stored passwords"
          sub="Hit run to watch a login request flow through LDAP → role resolution → JWT issuance → authorized call. Click a card to inspect each step."
        />

        <Reveal>
          <div className="two-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {phases.map((p, i) => (
                <div key={p.id} className={`auth-card ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14.5 }}>{p.title}</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{p.detail.length > 120 ? p.detail.slice(0, 118) + '…' : p.detail}</p>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
                <button className="btn btn-primary" onClick={runFlow}>▶ Run the flow</button>
                {loggedIn && (
                  <span className="sim-tag" style={{ color: 'var(--good)', borderColor: 'rgb(52 211 153 / 0.4)', background: 'rgb(52 211 153 / 0.1)' }}>
                    <span style={{ background: 'var(--good)' }} />Authenticated · GET /monthly-payroll/:id allowed
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: 20 }}>
                <h4 style={{ margin: '0 0 8px' }}>{phase.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>{phase.detail}</p>
                <SimTag />
                <pre className="code" style={{ marginTop: 10 }}>{phase.code}</pre>
                <FileTag file={phase.id === 'role' ? 'src/controllers/user.controller.ts' : phase.id === 'credentials' ? 'src/utils/authenticateUser.ts' : phase.id === 'token' ? 'src/utils/token-manager.ts' : 'src/middleware/authMiddleware.ts'} />
              </div>

              <div className="card" style={{ marginTop: 14 }}>
                <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>Two roles, one JWT</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="role-card"><div className="role-avatar admin">A</div>
                    <div><b>admin</b><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Imports sheets, filters, deletes, dashboard stats — via isAuthenticated([ADMIN]).</div></div>
                  </div>
                  <div className="role-card"><div className="role-avatar emp">E</div>
                    <div><b>employee</b><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Reads own payroll/bonus/profits only; server scopes queries to the token’s adKey.</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}