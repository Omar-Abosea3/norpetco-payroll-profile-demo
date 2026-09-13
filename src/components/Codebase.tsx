import { useState } from 'react'
import { codebaseTree } from '../data'
import { SectionHeader, Reveal } from './ui'

function Tree({ nodes }: { nodes: typeof codebaseTree }) {
  return (
    <div className="tree">
      <ul>
        {nodes.map((n) => (
          <NodeItem key={n.name} node={n} />
        ))}
      </ul>
    </div>
  )
}

function NodeItem({ node, depth = 0 }: { node: (typeof codebaseTree)[number]; depth?: number }) {
  const [open, setOpen] = useState(depth < 1)
  const isDir = !!node.children
  return (
    <li>
      <div className="tn">
        <span className={isDir ? 'dir' : 'file'} style={{ cursor: isDir ? 'pointer' : 'default' }} onClick={() => isDir && setOpen((o) => !o)}>
          {isDir ? `${open ? '▾' : '▸'} ` : '-'} {node.name}
        </span>
        {node.note && <span className="tnote">— {node.note}</span>}
      </div>
      {isDir && open && node.children && <Tree nodes={node.children} />}
    </li>
  )
}

export function Codebase() {
  return (
    <section id="codebase">
      <div className="wrap">
        <SectionHeader
          kicker="Codebase structure"
          title="Where everything lives"
          sub="Two clean apps: an Express API and a Vite SPA. Expand the folders to get oriented in seconds."
        />
        <Reveal>
          <div className="card" style={{ padding: 24, overflowX: 'auto' }}>
            <Tree nodes={codebaseTree} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}