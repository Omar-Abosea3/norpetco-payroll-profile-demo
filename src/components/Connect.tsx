import { apiBaseUrl } from '../data'
import { SectionHeader, Reveal } from './ui'

export function Connect() {
  return (
    <section id="connect">
      <div className="wrap">
        <SectionHeader
          kicker="Integration guide"
          title="How to connect to this backend"
          sub="A short playbook for developers who want to build against the API. All variable names come from the project's .env files — values are intentionally not shown."
        />

        <Reveal>
          <div className="two-col">
            <div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15 }}>1 · Environment (backend)</h3>
                <pre className="code">{`# final-norpetco-backend-project/.env  (names only)
SALT
MONGO_URI
JWT_SECRET
DOMAIN_ACTIVE_DIRECTORY
ADMIN_DN
ADMIN_PASSWORD
USER_SEARCH_BASE`}</pre>
              </div>

              <div className="card" style={{ padding: 20, marginTop: 14 }}>
                <h3 style={{ fontSize: 15 }}>2 · Environment (frontend)</h3>
                <pre className="code">{`# final-norpetco-frontend-project/.env.example
VITE_API_BASE_URL=${apiBaseUrl}
VITE_APP_NAME=Accounting System`}</pre>
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15 }}>3 · First request from scratch</h3>
                <pre className="code">{`// 1) authenticate (LDAP/AD)
const { data } = await fetch(${JSON.stringify(apiBaseUrl + '/users/login')}, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userName: 'j.doe', password: '…' }),
})
// → { message, groups, data: { userName, adKey, role }, token }

// 2) use the token on any protected route
const res = await fetch(${JSON.stringify(apiBaseUrl + '/monthly-payroll/:id')}, {
  headers: { Authorization: data.token },   // no "Bearer " prefix
})
// → { message, data: [ …payroll + deducations + allowances ] }`}</pre>
              </div>

              <div className="card" style={{ padding: 20, marginTop: 14 }}>
                <h3 style={{ fontSize: 15 }}>4 · Behavior notes</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-muted)', fontSize: 13.5 }}>
                  <li><b style={{ color: 'var(--text)' }}>Headers:</b> send the JWT in <code>Authorization</code> — matching the middleware which reads it directly.</li>
                  <li><b style={{ color: 'var(--text)' }}>Pagination:</b> pass <code>page</code> and <code>size</code> (default <code>10</code>); responses include <code>totalCount, page, size, totalPages</code>.</li>
                  <li><b style={{ color: 'var(--text)' }}>Filtering:</b> list routes accept <code>searchKey</code>, <code>searchFields</code>, <code>sort</code>, and <code>gt/gte/lt/lte</code> range queries.</li>
                  <li><b style={{ color: 'var(--text)' }}>Imports:</b> <code>POST …/add</code> routes expect multipart file uploads (<code>.xlsx</code> / <code>.csv</code>) with Arabic column headers.</li>
                  <li><b style={{ color: 'var(--text)' }}>Errors:</b> uniformly <code>{'{ message, stack }'}</code>, status from <code>err.cause</code>; Joi errors → <code>{'{ message: "validation Errors", Errors }'}</code>.</li>
                  <li><b style={{ color: 'var(--text)' }}>CORS:</b> GET stays open; non-GET is restricted to the configured origin allowlist.</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}