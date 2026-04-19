import { useState } from 'react'
import { uid, defaultCV2Component } from '../utils.js'

function TextComp({ comp, onChange }) {
  return (
    <div className="field">
      <label className="lbl">Content (markdown)</label>
      <textarea className="inp cv2-ta" value={comp.content} onChange={e => onChange({ content: e.target.value })} placeholder="Enter text..." />
    </div>
  )
}

function SepComp({ comp, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <label className="chk-row">
        <input type="checkbox" checked={!!comp.divider} onChange={e => onChange({ divider: e.target.checked })} />
        <span>Show divider line</span>
      </label>
      <div style={{ display: 'flex', align: 'center', gap: 8 }}>
        <label className="lbl" style={{ margin: 0 }}>Spacing</label>
        <select className="inp" style={{ width: 90, marginLeft: 6 }} value={comp.spacing || 1} onChange={e => onChange({ spacing: +e.target.value })}>
          <option value={1}>Small</option>
          <option value={2}>Large</option>
        </select>
      </div>
    </div>
  )
}

function MediaComp({ comp, onChange }) {
  const items = comp.items || []
  const update = (i, field, val) => onChange({
    items: items.map((it, j) => j !== i ? it : field === 'url' ? { ...it, media: { url: val } } : { ...it, [field]: val })
  })
  return (
    <div>
      {items.map((it, i) => (
        <div key={it.id || i} className="cv2-inner-card">
          <div className="cv2-inner-hdr">
            <span className="cv2-inner-lbl">Image {i + 1}</span>
            <button className="btn-icon del" onClick={() => onChange({ items: items.filter((_, j) => j !== i) })}>✕</button>
          </div>
          <div className="field"><label className="lbl">URL</label><input className="inp" placeholder="https://..." value={it.media?.url || ''} onChange={e => update(i, 'url', e.target.value)} /></div>
          <div className="field"><label className="lbl">Alt text</label><input className="inp" placeholder="Description" value={it.description || ''} onChange={e => update(i, 'description', e.target.value)} /></div>
        </div>
      ))}
      {items.length < 10 && <button className="cv2-add-inner" onClick={() => onChange({ items: [...items, { id: uid(), media: { url: '' }, description: '' }] })}>＋ Add Image</button>}
    </div>
  )
}

function ContainerComp({ comp, onChange }) {
  const inner = comp.components || []
  const noAccent = comp.accent_color == null
  const intToHex = n => n == null ? '#7c3aed' : '#' + n.toString(16).padStart(6, '0')
  const hexToInt = h => parseInt(h.replace('#', ''), 16)
  const addInner = type => onChange({ components: [...inner, defaultCV2Component(type)] })
  const updateInner = (id, upd) => onChange({ components: inner.map(c => c.id === id ? { ...c, ...upd } : c) })
  const removeInner = id => onChange({ components: inner.filter(c => c.id !== id) })
  return (
    <div>
      <div className="field">
        <label className="lbl">Accent Color</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" className="color-swatch" value={intToHex(comp.accent_color)} onChange={e => onChange({ accent_color: hexToInt(e.target.value) })} disabled={noAccent} />
          <label className="chk-row">
            <input type="checkbox" checked={noAccent} onChange={e => onChange({ accent_color: e.target.checked ? null : 0x7c3aed })} />
            <span>No accent</span>
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button className="cv2-add-inner" style={{ flex: 1 }} onClick={() => addInner(10)}>📝 Add Text</button>
        <button className="cv2-add-inner" style={{ flex: 1 }} onClick={() => addInner(14)}>— Separator</button>
      </div>
      {inner.map((c, i) => (
        <div key={c.id || i} className="cv2-inner-card">
          <div className="cv2-inner-hdr">
            <span className="cv2-inner-lbl">{c.type === 10 ? 'Text Display' : 'Separator'}</span>
            <button className="btn-icon del" onClick={() => removeInner(c.id)}>✕</button>
          </div>
          {c.type === 10 && <textarea className="inp cv2-ta" value={c.content} onChange={e => updateInner(c.id, { content: e.target.value })} />}
          {c.type === 14 && <label className="chk-row"><input type="checkbox" checked={!!c.divider} onChange={e => updateInner(c.id, { divider: e.target.checked })} /><span>Show divider</span></label>}
        </div>
      ))}
    </div>
  )
}

function ButtonsComp({ comp, onChange }) {
  const btns = comp.components || []
  const update = (id, field, val) => onChange({ components: btns.map(b => b.id === id ? { ...b, [field]: val } : b) })
  const remove = id => onChange({ components: btns.filter(b => b.id !== id) })
  const add = () => onChange({ components: [...btns, { id: uid(), type: 2, style: 1, label: 'Button', custom_id: 'btn_' + uid(), disabled: false }] })
  const STYLES = { 1: 'Primary', 2: 'Secondary', 3: 'Success', 4: 'Danger', 5: 'Link' }
  return (
    <div>
      {btns.map((btn, i) => (
        <div key={btn.id || i} className="cv2-inner-card">
          <div className="cv2-inner-hdr">
            <span className="cv2-inner-lbl">Button {i + 1}</span>
            <button className="btn-icon del" onClick={() => remove(btn.id)}>✕</button>
          </div>
          <div className="row2" style={{ display: 'flex', gap: 8 }}>
            <div className="field" style={{ flex: 2 }}><label className="lbl">Label</label><input className="inp" value={btn.label || ''} onChange={e => update(btn.id, 'label', e.target.value)} /></div>
            <div className="field" style={{ flex: 1 }}>
              <label className="lbl">Style</label>
              <select className="inp" value={btn.style} onChange={e => update(btn.id, 'style', +e.target.value)}>
                {Object.entries(STYLES).map(([v, l]) => <option key={v} value={+v}>{l}</option>)}
              </select>
            </div>
          </div>
          {btn.style === 5
            ? <div className="field"><label className="lbl">URL</label><input className="inp" placeholder="https://..." value={btn.url || ''} onChange={e => update(btn.id, 'url', e.target.value)} /></div>
            : <div className="field"><label className="lbl">Custom ID</label><input className="inp" value={btn.custom_id || ''} onChange={e => update(btn.id, 'custom_id', e.target.value)} /></div>
          }
          <label className="chk-row"><input type="checkbox" checked={!!btn.disabled} onChange={e => update(btn.id, 'disabled', e.target.checked)} /><span>Disabled</span></label>
        </div>
      ))}
      {btns.length < 5 && <button className="cv2-add-inner" onClick={add}>＋ Add Button</button>}
    </div>
  )
}

const TYPE_META = {
  10: { label: 'Text Display',  badge: 'bdg-blue',    icon: '📝' },
  14: { label: 'Separator',     badge: 'bdg-green',   icon: '─'  },
  12: { label: 'Media Gallery', badge: 'bdg-purple',  icon: '🖼' },
  17: { label: 'Container',     badge: 'bdg-indigo',  icon: '📦' },
   1: { label: 'Action Row',    badge: 'bdg-red',     icon: '🔘' },
}

function CV2Card({ comp, idx, total, expanded, onToggle, onChange, onRemove, onMove }) {
  const m = TYPE_META[comp.type] || { label: 'Component', badge: '', icon: '?' }
  const preview = comp.type === 10 ? (comp.content || '').slice(0, 40)
    : comp.type === 14 ? `${comp.divider ? 'divider' : 'spacer'} · ${comp.spacing === 2 ? 'large' : 'small'}`
    : comp.type === 12 ? `${comp.items?.length || 0} image(s)`
    : comp.type === 17 ? `${comp.components?.length || 0} component(s)`
    : `${comp.components?.length || 0} button(s)`
  return (
    <div className="cv2-card">
      <div className="cv2-hdr" onClick={onToggle}>
        <span>{m.icon}</span>
        <span className={`cv2-badge ${m.badge}`}>{m.label}</span>
        <span className="cv2-prev">{preview}</span>
        <div className="cv2-ctrl" onClick={e => e.stopPropagation()}>
          <button className="btn-icon" onClick={() => onMove(-1)} disabled={idx === 0} title="Move up">↑</button>
          <button className="btn-icon" onClick={() => onMove(1)} disabled={idx === total - 1} title="Move down">↓</button>
          <button className="btn-icon del" onClick={onRemove} title="Delete">✕</button>
        </div>
        <span className={`chev${expanded ? ' open' : ''}`}>▾</span>
      </div>
      {expanded && (
        <div className="cv2-body">
          {comp.type === 10 && <TextComp comp={comp} onChange={onChange} />}
          {comp.type === 14 && <SepComp comp={comp} onChange={onChange} />}
          {comp.type === 12 && <MediaComp comp={comp} onChange={onChange} />}
          {comp.type === 17 && <ContainerComp comp={comp} onChange={onChange} />}
          {comp.type ===  1 && <ButtonsComp comp={comp} onChange={onChange} />}
        </div>
      )}
    </div>
  )
}

export default function CV2Editor({ components, onChange }) {
  const [expanded, setExpanded] = useState({})
  const add = type => {
    const c = defaultCV2Component(type)
    onChange([...components, c])
    setExpanded(e => ({ ...e, [c.id]: true }))
  }
  const update = (id, patch) => onChange(components.map(c => c.id === id ? { ...c, ...patch } : c))
  const remove = id => onChange(components.filter(c => c.id !== id))
  const move = (id, dir) => {
    const arr = [...components]
    const i = arr.findIndex(c => c.id === id)
    if (i + dir < 0 || i + dir >= arr.length) return
    ;[arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]
    onChange(arr)
  }
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }))

  return (
    <div>
      <section className="ed-section">
        <div className="sec-title">
          Add CV2 Component
          <span style={{ fontSize: 9, color: 'var(--text4)', marginLeft: 8, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
            flags: 32768 (IS_COMPONENTS_V2)
          </span>
        </div>
        <div className="cv2-chip-row">
          {[[10,'📝','Text Display'],[14,'─','Separator'],[12,'🖼','Media Gallery'],[17,'📦','Container'],[1,'🔘','Action Row']].map(([t,i,l]) => (
            <button key={t} className="cv2-chip" onClick={() => add(t)}>{i} {l}</button>
          ))}
        </div>
      </section>

      <section className="ed-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="sec-title" style={{ marginBottom: 0 }}>
            Components <span className="count-badge">{components.length}</span>
          </div>
        </div>

        {components.length === 0 && <div className="empty-hint">No CV2 components. Add one above.</div>}

        {components.map((comp, idx) => (
          <CV2Card
            key={comp.id}
            comp={comp}
            idx={idx}
            total={components.length}
            expanded={!!expanded[comp.id]}
            onToggle={() => toggle(comp.id)}
            onChange={patch => update(comp.id, patch)}
            onRemove={() => remove(comp.id)}
            onMove={dir => move(comp.id, dir)}
          />
        ))}
      </section>

      <style>{`
        .cv2-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .cv2-chip { background: var(--bg3); border: 1px dashed var(--border2); border-radius: 5px; padding: 5px 10px; font-size: 11px; font-weight: 700; color: var(--text2); cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 5px; }
        .cv2-chip:hover { border-color: var(--accent); background: var(--bg4); color: var(--text); }
        .cv2-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 7px; background: var(--bg); }
        .cv2-hdr { display: flex; align-items: center; gap: 6px; padding: 8px 10px; cursor: pointer; user-select: none; background: var(--bg3); }
        .cv2-badge { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; }
        .bdg-blue { background: #1b3a5f; color: #60a5fa; }
        .bdg-green { background: #1a3025; color: #34d399; }
        .bdg-purple { background: #3b1f5f; color: #c084fc; }
        .bdg-indigo { background: #201d4a; color: #818cf8; }
        .bdg-red { background: #3b1a20; color: #f87171; }
        .cv2-prev { font-size: 11px; color: var(--text4); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; font-family: 'DM Mono', monospace; }
        .cv2-ctrl { display: flex; gap: 2px; flex-shrink: 0; }
        .cv2-body { padding: 10px; border-top: 1px solid var(--border); }
        .cv2-inner-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; padding: 8px; margin-bottom: 6px; }
        .cv2-inner-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
        .cv2-inner-lbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); }
        .cv2-add-inner { width: 100%; padding: 7px; border-radius: 5px; border: 1px dashed var(--border); background: transparent; color: var(--accent); font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .15s; margin-top: 4px; }
        .cv2-add-inner:hover { border-color: var(--accent); background: var(--bg3); }
        .cv2-ta { min-height: 70px; resize: vertical; }
      `}</style>
    </div>
  )
}
