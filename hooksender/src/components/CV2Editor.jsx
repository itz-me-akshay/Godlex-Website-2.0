import { useState } from 'react'
import { uid, defaultCV2Component } from '../utils.js'

// ─── Shared inner component editors ──────────────────────────────────────────

function TextComp({ comp, onChange }) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
    items: items.map((it, j) => j !== i ? it
      : field === 'url' ? { ...it, media: { url: val } }
      : { ...it, [field]: val })
  })
  const addItem = () => onChange({ items: [...items, { id: uid(), media: { url: '' }, description: '' }] })
  const removeItem = (i) => onChange({ items: items.filter((_, j) => j !== i) })

  return (
    <div>
      {items.map((it, i) => (
        <div key={it.id || i} className="cv2-inner-card">
          <div className="cv2-inner-hdr">
            <span className="cv2-inner-lbl">Image {i + 1}</span>
            <button className="btn-icon del" onClick={() => removeItem(i)}>✕</button>
          </div>
          <div className="field">
            <label className="lbl">URL</label>
            <input className="inp" placeholder="https://i.imgur.com/..." value={it.media?.url || ''} onChange={e => update(i, 'url', e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="lbl">Alt text</label>
            <input className="inp" placeholder="Description (optional)" value={it.description || ''} onChange={e => update(i, 'description', e.target.value)} />
          </div>
        </div>
      ))}
      {items.length < 10 && (
        <button className="cv2-add-inner" onClick={addItem}>＋ Add Image</button>
      )}
    </div>
  )
}

function ButtonsComp({ comp, onChange }) {
  const btns = comp.components || []
  const update = (id, field, val) => onChange({ components: btns.map(b => b.id === id ? { ...b, [field]: val } : b) })
  const remove = id => onChange({ components: btns.filter(b => b.id !== id) })
  const add = () => onChange({ components: [...btns, { id: uid(), type: 2, style: 1, label: 'Button', custom_id: 'btn_' + uid(), disabled: false }] })

  return (
    <div>
      {btns.map((btn, i) => (
        <div key={btn.id || i} className="cv2-inner-card">
          <div className="cv2-inner-hdr">
            <span className="cv2-inner-lbl">Button {i + 1}</span>
            <button className="btn-icon del" onClick={() => remove(btn.id)}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="field" style={{ flex: 2 }}>
              <label className="lbl">Label</label>
              <input className="inp" value={btn.label || ''} onChange={e => update(btn.id, 'label', e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="lbl">Style</label>
              <select className="inp" value={btn.style} onChange={e => update(btn.id, 'style', +e.target.value)}>
                <option value={1}>Primary</option>
                <option value={2}>Secondary</option>
                <option value={3}>Success</option>
                <option value={4}>Danger</option>
                <option value={5}>Link</option>
              </select>
            </div>
          </div>
          {btn.style === 5
            ? <div className="field"><label className="lbl">URL</label><input className="inp" placeholder="https://..." value={btn.url || ''} onChange={e => update(btn.id, 'url', e.target.value)} /></div>
            : <div className="field"><label className="lbl">Custom ID</label><input className="inp" value={btn.custom_id || ''} onChange={e => update(btn.id, 'custom_id', e.target.value)} /></div>
          }
          <label className="chk-row" style={{ marginBottom: 0 }}>
            <input type="checkbox" checked={!!btn.disabled} onChange={e => update(btn.id, 'disabled', e.target.checked)} />
            <span>Disabled</span>
          </label>
        </div>
      ))}
      {btns.length < 5 && <button className="cv2-add-inner" onClick={add}>＋ Add Button</button>}
    </div>
  )
}

// ─── Inner component card (used inside Container) ─────────────────────────────

const INNER_TYPE_META = {
  10: { label: 'Text Display',  badge: 'bdg-blue',   icon: '📝' },
  14: { label: 'Separator',     badge: 'bdg-green',  icon: '─'  },
  12: { label: 'Media Gallery', badge: 'bdg-purple', icon: '🖼' },
   1: { label: 'Action Row',    badge: 'bdg-red',    icon: '🔘' },
}

function InnerCard({ comp, idx, total, onChange, onRemove, onMove }) {
  const [open, setOpen] = useState(false)
  const m = INNER_TYPE_META[comp.type] || { label: 'Component', badge: '', icon: '?' }

  const preview = comp.type === 10 ? (comp.content || '').slice(0, 36)
    : comp.type === 14 ? `${comp.divider ? 'divider' : 'spacer'} · ${comp.spacing === 2 ? 'large' : 'small'}`
    : comp.type === 12 ? `${comp.items?.length || 0} image(s)`
    : `${comp.components?.length || 0} button(s)`

  return (
    <div className="cv2-inner-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="cv2-inner-hdr inner-card-hdr" onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer', padding: '7px 8px' }}>
        <span style={{ fontSize: 13 }}>{m.icon}</span>
        <span className={`cv2-badge ${m.badge}`}>{m.label}</span>
        <span className="cv2-prev" style={{ fontSize: 10 }}>{preview}</span>
        <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
          <button className="btn-icon" style={{ width: 20, height: 20, fontSize: 11 }} onClick={() => onMove(-1)} disabled={idx === 0}>↑</button>
          <button className="btn-icon" style={{ width: 20, height: 20, fontSize: 11 }} onClick={() => onMove(1)} disabled={idx === total - 1}>↓</button>
          <button className="btn-icon del" style={{ width: 20, height: 20, fontSize: 11 }} onClick={onRemove}>✕</button>
        </div>
        <span className={`chev${open ? ' open' : ''}`} style={{ fontSize: 11 }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: '8px 8px 10px', borderTop: '1px solid var(--border)' }}>
          {comp.type === 10 && <TextComp comp={comp} onChange={onChange} />}
          {comp.type === 14 && <SepComp comp={comp} onChange={onChange} />}
          {comp.type === 12 && <MediaComp comp={comp} onChange={onChange} />}
          {comp.type ===  1 && <ButtonsComp comp={comp} onChange={onChange} />}
        </div>
      )}
    </div>
  )
}

// ─── Add component dropdown (like Discohook) ─────────────────────────────────

const ADD_TYPES = [
  { type: 10, icon: '📝', label: 'Text Display',   desc: 'Formatted text with markdown' },
  { type: 14, icon: '─',  label: 'Separator',       desc: 'Divider line or spacing' },
  { type: 12, icon: '🖼', label: 'Media Gallery',   desc: 'Up to 10 images in a grid' },
  { type:  1, icon: '🔘', label: 'Action Row',      desc: 'Up to 5 buttons' },
]

function AddDropdown({ onAdd, label = '＋ Add Component', excludeTypes = [] }) {
  const [open, setOpen] = useState(false)
  const types = ADD_TYPES.filter(t => !excludeTypes.includes(t.type))

  return (
    <div className="add-dropdown-wrap">
      <button className="cv2-add-inner add-dd-btn" onClick={() => setOpen(o => !o)}>
        {label} <span style={{ fontSize: 10, marginLeft: 2 }}>▾</span>
      </button>
      {open && (
        <>
          <div className="add-dd-backdrop" onClick={() => setOpen(false)} />
          <div className="add-dd-menu">
            {types.map(t => (
              <div
                key={t.type}
                className="add-dd-item"
                onClick={() => { onAdd(t.type); setOpen(false) }}
              >
                <span className="add-dd-icon">{t.icon}</span>
                <div>
                  <div className="add-dd-label">{t.label}</div>
                  <div className="add-dd-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Container component editor ───────────────────────────────────────────────

function ContainerComp({ comp, onChange }) {
  const inner = comp.components || []
  const noAccent = comp.accent_color == null
  const intToHex = n => n == null ? '#7c3aed' : '#' + n.toString(16).padStart(6, '0')
  const hexToInt = h => parseInt(h.replace('#', ''), 16)

  const addInner = type => {
    const c = defaultCV2Component(type)
    onChange({ components: [...inner, c] })
  }
  const updateInner = (id, patch) => onChange({ components: inner.map(c => c.id === id ? { ...c, ...patch } : c) })
  const removeInner = id => onChange({ components: inner.filter(c => c.id !== id) })
  const moveInner = (id, dir) => {
    const arr = [...inner]
    const i = arr.findIndex(c => c.id === id)
    if (i + dir < 0 || i + dir >= arr.length) return
    ;[arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]
    onChange({ components: arr })
  }

  return (
    <div>
      {/* Accent color */}
      <div className="field">
        <label className="lbl">Accent Color</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            className="color-swatch"
            value={intToHex(comp.accent_color)}
            onChange={e => onChange({ accent_color: hexToInt(e.target.value) })}
            disabled={noAccent}
          />
          <label className="chk-row">
            <input type="checkbox" checked={noAccent} onChange={e => onChange({ accent_color: e.target.checked ? null : 0x7c3aed })} />
            <span>No accent</span>
          </label>
        </div>
      </div>

      {/* Inner components */}
      <div className="field">
        <label className="lbl">Inner Components ({inner.length})</label>
        {inner.length === 0 && (
          <div className="cv2-container-empty">Container is empty — add components below</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: inner.length ? 8 : 0 }}>
          {inner.map((c, i) => (
            <InnerCard
              key={c.id || i}
              comp={c}
              idx={i}
              total={inner.length}
              onChange={patch => updateInner(c.id, patch)}
              onRemove={() => removeInner(c.id)}
              onMove={dir => moveInner(c.id, dir)}
            />
          ))}
        </div>

        {/* Discohook-style dropdown to add inner components */}
        <AddDropdown onAdd={addInner} label="＋ Add Component" />
      </div>
    </div>
  )
}

// ─── Top-level CV2 component card ─────────────────────────────────────────────

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
    : comp.type === 17 ? `${comp.components?.length || 0} component(s) inside`
    : `${comp.components?.length || 0} button(s)`

  return (
    <div className="cv2-card">
      <div className="cv2-hdr" onClick={onToggle}>
        <span style={{ fontSize: 14 }}>{m.icon}</span>
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

// ─── Root CV2 editor ──────────────────────────────────────────────────────────

// Top-level types (Container is only at top level)
const TOP_ADD_TYPES = [
  { type: 10, icon: '📝', label: 'Text Display',   desc: 'Formatted text with markdown' },
  { type: 14, icon: '─',  label: 'Separator',       desc: 'Divider line or spacing' },
  { type: 12, icon: '🖼', label: 'Media Gallery',   desc: 'Up to 10 images in a grid' },
  { type: 17, icon: '📦', label: 'Container',       desc: 'Group components with optional accent color' },
  { type:  1, icon: '🔘', label: 'Action Row',      desc: 'Up to 5 buttons' },
]

function AddDropdownTop({ onAdd }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="add-dropdown-wrap">
      <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setOpen(o => !o)}>
        ＋ Add Component <span style={{ fontSize: 10, marginLeft: 4 }}>▾</span>
      </button>
      {open && (
        <>
          <div className="add-dd-backdrop" onClick={() => setOpen(false)} />
          <div className="add-dd-menu add-dd-menu-top">
            {TOP_ADD_TYPES.map(t => (
              <div key={t.type} className="add-dd-item" onClick={() => { onAdd(t.type); setOpen(false) }}>
                <span className="add-dd-icon">{t.icon}</span>
                <div>
                  <div className="add-dd-label">{t.label}</div>
                  <div className="add-dd-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="sec-title" style={{ marginBottom: 0 }}>
            Components V2
            <span style={{ fontSize: 9, color: 'var(--text4)', marginLeft: 6, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              flags: 32768
            </span>
          </div>
          <span className="count-badge">{components.length}</span>
        </div>

        {components.length === 0 && (
          <div className="empty-hint" style={{ marginBottom: 10 }}>No components yet.</div>
        )}

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

        <AddDropdownTop onAdd={add} />
      </section>

      <style>{`
        .cv2-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 7px; background: var(--bg); }
        .cv2-hdr { display: flex; align-items: center; gap: 6px; padding: 8px 10px; cursor: pointer; user-select: none; background: var(--bg3); }
        .cv2-badge { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; }
        .bdg-blue   { background: #1b3a5f; color: #60a5fa; }
        .bdg-green  { background: #1a3025; color: #34d399; }
        .bdg-purple { background: #3b1f5f; color: #c084fc; }
        .bdg-indigo { background: #201d4a; color: #818cf8; }
        .bdg-red    { background: #3b1a20; color: #f87171; }
        .cv2-prev { font-size: 11px; color: var(--text4); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; font-family: 'DM Mono', monospace; }
        .cv2-ctrl { display: flex; gap: 2px; flex-shrink: 0; }
        .cv2-body { padding: 10px; border-top: 1px solid var(--border); }
        .cv2-inner-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 6px; overflow: hidden; }
        .cv2-inner-card:last-child { margin-bottom: 0; }
        .cv2-inner-hdr { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; }
        .inner-card-hdr { display: flex; align-items: center; gap: 5px; }
        .cv2-inner-lbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); }
        .cv2-add-inner { width: 100%; padding: 7px; border-radius: 5px; border: 1px dashed var(--border); background: transparent; color: var(--accent); font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .15s; display: block; }
        .cv2-add-inner:hover { border-color: var(--accent); background: var(--bg3); }
        .cv2-ta { min-height: 70px; resize: vertical; }
        .cv2-container-empty { font-size: 12px; color: var(--text4); text-align: center; padding: 10px; background: var(--bg); border: 1px dashed var(--border); border-radius: 5px; margin-bottom: 8px; }

        /* Dropdown */
        .add-dropdown-wrap { position: relative; }
        .add-dd-backdrop { position: fixed; inset: 0; z-index: 50; }
        .add-dd-menu {
          position: absolute; left: 0; right: 0; top: calc(100% + 4px); z-index: 60;
          background: var(--bg2); border: 1px solid var(--border2); border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,.5); overflow: hidden;
        }
        .add-dd-menu-top { min-width: 260px; }
        .add-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; cursor: pointer; transition: background .1s;
        }
        .add-dd-item:hover { background: var(--bg4); }
        .add-dd-item:not(:last-child) { border-bottom: 1px solid var(--border); }
        .add-dd-icon { font-size: 16px; flex-shrink: 0; width: 24px; text-align: center; }
        .add-dd-label { font-size: 12px; font-weight: 700; color: var(--text); }
        .add-dd-desc { font-size: 10px; color: var(--text3); margin-top: 1px; }
        .add-dd-btn { text-align: left; display: flex; align-items: center; justify-content: space-between; }
      `}</style>
    </div>
  )
}
