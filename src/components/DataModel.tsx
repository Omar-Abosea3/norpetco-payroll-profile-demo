import { useState } from 'react'
import { dataModels, modelRelationships } from '../data'
import { SectionHeader, Reveal, FileTag } from './ui'

export function DataModel() {
  const [id, setId] = useState(dataModels[0].collection)
  const model = dataModels.find((m) => m.collection === id) ?? dataModels[0]

  return (
    <section id="data-model">
      <div className="wrap">
        <SectionHeader
          kicker="Database & data model"
          title="10 collections, driven by Excel"
          sub="Finance data (payroll, bonuses, allowances, deductions, profits) is imported from Excel; dictionaries and notifications are app-managed. Click a collection to inspect its fields."
        />

        <Reveal>
          <div className="tabbar">
            {dataModels.map((m) => (
              <button key={m.collection} className={`tabchip ${m.collection === id ? 'active' : ''}`} onClick={() => setId(m.collection)}>
                {m.collection}
                {m.fromExcel && <span style={{ opacity: 0.6 }}> · xlsx</span>}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="two-col">
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: 'var(--mono)', color: 'var(--accent-3)' }}>{model.collection}</h3>
                <span className={`role-chip ${model.fromExcel ? 'secure' : ''}`}>{model.fromExcel ? 'imported from Excel' : 'app-managed'}</span>
              </div>
              <p style={{ marginTop: 6 }}>{model.description}</p>
              <table className="kv-table">
                <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
                <tbody>
                  {model.fields.map((f) => (
                    <tr key={f.name}>
                      <td>{f.name}</td>
                      <td style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>{f.type}</td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {f.note}
                        {f.unique && <span className="req"> · unique</span>}
                        {f.ref && <span style={{ color: 'var(--accent-2)' }}> · ref: {f.ref}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15 }}>🔗 References between collections</h3>
                <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: 'var(--text-muted)', fontSize: 13.5 }}>
                  {modelRelationships.map((r) => (
                    <li key={r} style={{ marginBottom: 6 }}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ padding: 20, marginTop: 14 }}>
                <h3 style={{ fontSize: 15 }}>🧬 Unique keys = deduplication</h3>
                <p style={{ fontSize: 13.5 }}>
                  Imports use <code>bulkWrite</code> with <code>$setOnInsert</code> on composite keys — e.g.
                  {' '}<code>{'{ pyempl, "مرتب شهر" }'}</code> for payroll, {' '}<code>{'{ "الرقم الوظيفي", month }'}</code> for bonuses.
                  Re-uploading the same month updates instead of duplicating.
                </p>
              </div>

              <div className="card" style={{ padding: 20, marginTop: 14 }}>
                <h3 style={{ fontSize: 15 }}>📈 Payroll row is wide</h3>
                <p style={{ fontSize: 13.5 }}>
                  The monthly payroll schema mirrors the finance sheet with 40+ Arabic columns —
                  basic salary (المرتب الاساسي), gross income (اجمالي الدخل), net (صافي الراتب),
                  previous balance (الرصيد السابق), overtime, loans, insurance — all normalized by{' '}
                  <code>convertStrNum</code>.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <FileTag file="final-norpetco-backend-project/src/DB/models" />
            <FileTag file="src/utils/sheetHandler.ts · convertStrNum.ts" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}