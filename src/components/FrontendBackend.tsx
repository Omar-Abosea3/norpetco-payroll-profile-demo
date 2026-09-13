import { apiBaseUrl, localBaseUrl } from '../data'
import { SectionHeader, Reveal, FileTag } from './ui'

export function FrontendBackend() {
  return (
    <section id="frontend-backend">
      <div className="wrap">
        <SectionHeader
          kicker="Frontend ↔ backend"
          title="How the React app talks to this API"
          sub="One axios instance, one auth store, one error handler. The base URL is configured at runtime through VITE_API_BASE_URL and falls back to the production server."
        />

        <Reveal>
          <div className="two-col">
            <div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15 }}>📡 Central axios client</h3>
                <p style={{ fontSize: 13.5 }}>
                  Token injected on every request; 401 clears the session and redirects to <code>/signin</code>.
                </p>
                <pre className="code">{`// src/lib/axios.ts (simplified)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    || ${JSON.stringify(apiBaseUrl)},
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = token // no "Bearer "
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      location.href = '/signin'
    }
    return Promise.reject(err)
  }
)`}</pre>
              </div>

              <div className="card" style={{ padding: 20, marginTop: 14 }}>
                <h3 style={{ fontSize: 15 }}>🔐 AuthContext</h3>
                <p style={{ fontSize: 13.5 }}>
                  Stores <code>token</code> + <code>userData</code> in localStorage, checks <code>exp</code> with
                  jwt-decode, syncs across tabs, and exposes <code>signIn / logout / refreshProfile</code>.
                </p>
                <FileTag file="final-norpetco-frontend-project/src/contexts/AuthContext.tsx" />
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15 }}>📦 Typed service modules</h3>
                <pre className="code">{`// src/services/api.ts (simplified)
export const monthlyPayrollService = {
  getAll: (page, size, filters) =>
    api.get('/monthly-payroll/admin/all',
      { params: { page, size, ...filters } }),
  getById: (id) =>
    api.get(\`/monthly-payroll/\${id}\`),
}

export const authService = {
  login: (userName, password) =>
    api.post('/users/login', { userName, password }),
}`}</pre>
              </div>

              <div className="card" style={{ padding: 20, marginTop: 14 }}>
                <h3 style={{ fontSize: 15 }}>🖨️ PDF every month</h3>
                <p style={{ fontSize: 13.5 }}>
                  Streams styled HTML tables into a print window — payroll, bonuses, yearly profits and per-employee
                  detail slips, labeled with Arabic field names.
                </p>
                <FileTag file="final-norpetco-frontend-project/src/utils/pdf-export.ts" />
              </div>

              <div className="card" style={{ padding: 20, marginTop: 14 }}>
                <h3 style={{ fontSize: 15 }}>🧭 Routing with guards</h3>
                <pre className="code">{`<ProtectedRoute role="admin">
  <AdminRoutes />
</ProtectedRoute>`}</pre>
                <p style={{ fontSize: 13.5, marginTop: 10 }}>
                  <code>UserRoute</code>, <code>GuestRoute</code>, <code>AdminRoute</code> mirror the backend RBAC so
                  employees simply never see admin screens.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="demo-banner" style={{ marginTop: 26 }}>
            <span>🔌</span>
            <span>
              To run the <em>real</em> stack locally, point the frontend at a local backend:{' '}
              <code>{localBaseUrl}</code> — same shape as production. This showcase never calls it.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}