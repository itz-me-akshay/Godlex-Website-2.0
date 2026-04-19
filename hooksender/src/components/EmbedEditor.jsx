import { useState } from 'react'
import { uid, intToHex, hexToInt } from '../utils.js'

const PRESET_COLORS = [
  '#5865f2','#57f287','#fee75c','#ed4245','#eb459e',
  '#3ba55c','#faa61a','#9b59b6','#1abc9c','#e67e22',
]

function ColorPicker({ value, onChange }) {
  const hex = intToHex(value)
  return (
    <div className="color-picker-wrap">
      <div className="color-presets">
        <button
          className={`cp-swatch no-color${value == null ? ' selected' : ''}`}
          onClick={() => onChange(null)}
          title="No color"
        >✕</button>
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            className={`cp-swatch${hex === c ? ' selected' : ''}`}
            style={{ background: c }}
            onClick={() => onChange(hexToInt(c))}
            title={c}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          className="color-swatch"
          style={{ width: 40, height: 30 }}
          value={hex || '#7c3aed'}
          onChange={e => onChange(hexToInt(e.target.value))}
        />
        <input
          className="inp"
          placeholder="#7c3aed"
          value={hex || ''}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(hexToInt(v))
            else if (v === '' || v === '#') onChange(null)
          }}
          style={{ width: 100 }}
        />
      </div>
    </div>
  )
}

function FieldRow({ field, idx, total, onChange, onRemove, onMove }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="field-row">
      <div className="field-row-hdr" onClick={() => setOpen(o => !o)}>
        <span className="field-row-idx">Field {idx + 1}</span>
        <span className="field-row-name">{field.name || 'Untitled field'}</span>
        <div className="field-row-ctrl" onClick={e => e.stopPropagation()}>
          <button className="btn-icon" onClick={() => onMove(-1)} disabled={idx === 0} title="Move up">↑</button>
          <button className="btn-icon" onClick={() => onMove(1)} disabled={idx === total - 1} title="Move down">↓</button>
          <button className="btn-icon del" onClick={onRemove} title="Delete">✕</button>
        </div>
        <span className={`chev${open ? ' open' : ''}`}>▾</span>
      </div>
      {open && (
        <div className="field-row-body">
          <div className="row2">
            <div className="field" style={{ flex: 2 }}>
              <label className="lbl">Name</label>
              <input className="inp" placeholder="Field name" value={field.name} onChange={e => onChange({ name: e.target.value })} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="lbl">Inline</label>
              <div className="chk-row" style={{ marginTop: 8 }}>
                <input type="checkbox" checked={!!field.inline} onChange={e => onChange({ inline: e.target.checked })} />
                <span>Inline</span>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="lbl">Value</label>
            <textarea className="inp" style={{ minHeight: 60 }} placeholder="Field value (markdown)" value={field.value} onChange={e => onChange({ value: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function EmbedEditor({ embed, idx, total, onChange, onRemove, onMove, onDuplicate }) {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('general') // general | fields | footer

  const f = (field, patch) => onChange({ [field]: { ...embed[field], ...patch } })

  const addField = () => {
    if (embed.fields.length >= 25) return
    onChange({ fields: [...embed.fields, { id: uid(), name: '', value: '', inline: false }] })
  }
  const updateField = (id, patch) => onChange({ fields: embed.fields.map(f => f.id === id ? { ...f, ...patch } : f) })
  const removeField = (id) => onChange({ fields: embed.fields.filter(f => f.id !== id) })
  const moveField = (id, dir) => {
    const arr = [...embed.fields]
    const i = arr.findIndex(f => f.id === id)
    if (i + dir < 0 || i + dir >= arr.length) return
    ;[arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]
    onChange({ fields: arr })
  }

  const colorHex = intToHex(embed.color)
  const previewColor = colorHex || 'var(--border2)'

  return (
    <div className="embed-card">
      {/* Embed header */}
      <div className="embed-hdr" onClick={() => setOpen(o => !o)}>
        <div className="embed-color-strip" style={{ background: colorHex || 'var(--border)' }} />
        <span className="embed-num">Embed {idx + 1}</span>
        <span className="embed-title-preview">{embed.title || embed.author?.name || '(empty)'}</span>
        <div className="embed-ctrl" onClick={e => e.stopPropagation()}>
          <button className="btn-icon" onClick={() => onMove(-1)} disabled={idx === 0} title="Move up">↑</button>
          <button className="btn-icon" onClick={() => onMove(1)} disabled={idx === total - 1} title="Move down">↓</button>
          <button className="btn-icon" onClick={onDuplicate} title="Duplicate">⊕</button>
          <button className="btn-icon del" onClick={onRemove} title="Delete">✕</button>
        </div>
        <span className={`chev${open ? ' open' : ''}`}>▾</span>
      </div>

      {open && (
        <div className="embed-body">
          {/* Tabs */}
          <div className="embed-tabs">
            {['general', 'fields', 'images'].map(t => (
              <button key={t} className={`etab${activeTab === t ? ' on' : ''}`} onClick={() => setActiveTab(t)}>
                {t === 'general' ? '⚙ General' : t === 'fields' ? `📋 Fields (${embed.fields.length})` : '🖼 Images'}
              </button>
            ))}
          </div>

          {activeTab === 'general' && (
            <div className="embed-section">
              {/* Color */}
              <div className="field">
                <label className="lbl">Color</label>
                <ColorPicker value={embed.color} onChange={v => onChange({ color: v })} />
              </div>

              {/* Author */}
              <div className="embed-group">
                <div className="group-label">Author</div>
                <div className="field">
                  <label className="lbl">Name</label>
                  <input className="inp" placeholder="Author name" value={embed.author.name} onChange={e => f('author', { name: e.target.value })} />
                </div>
                <div className="row2">
                  <div className="field" style={{ flex: 1 }}>
                    <label className="lbl">URL</label>
                    <input className="inp" placeholder="https://..." value={embed.author.url} onChange={e => f('author', { url: e.target.value })} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label className="lbl">Icon URL</label>
                    <input className="inp" placeholder="https://..." value={embed.author.icon_url} onChange={e => f('author', { icon_url: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="field">
                <label className="lbl">Title</label>
                <input className="inp" placeholder="Embed title" value={embed.title} onChange={e => onChange({ title: e.target.value })} />
              </div>
              <div className="field">
                <label className="lbl">Title URL</label>
                <input className="inp" placeholder="https://..." value={embed.url} onChange={e => onChange({ url: e.target.value })} />
              </div>

              {/* Description */}
              <div className="field">
                <label className="lbl">Description</label>
                <textarea className="inp" style={{ minHeight: 90, resize: 'vertical' }} placeholder="Embed description (markdown supported)" value={embed.description} onChange={e => onChange({ description: e.target.value })} />
              </div>

              {/* Footer */}
              <div className="embed-group">
                <div className="group-label">Footer</div>
                <div className="field">
                  <label className="lbl">Text</label>
                  <input className="inp" placeholder="Footer text" value={embed.footer.text} onChange={e => f('footer', { text: e.target.value })} />
                </div>
                <div className="field">
                  <label className="lbl">Icon URL</label>
                  <input className="inp" placeholder="https://..." value={embed.footer.icon_url} onChange={e => f('footer', { icon_url: e.target.value })} />
                </div>
              </div>

              {/* Timestamp */}
              <div className="field">
                <label className="chk-row">
                  <input type="checkbox" checked={!!embed.timestamp} onChange={e => onChange({ timestamp: e.target.checked })} />
                  <span>Include timestamp (current time when sent)</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="embed-section">
              {embed.fields.length === 0 && <div className="empty-hint">No fields. Add up to 25 fields.</div>}
              {embed.fields.map((field, i) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  idx={i}
                  total={embed.fields.length}
                  onChange={patch => updateField(field.id, patch)}
                  onRemove={() => removeField(field.id)}
                  onMove={dir => moveField(field.id, dir)}
                />
              ))}
              {embed.fields.length < 25 && (
                <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={addField}>
                  ＋ Add Field
                </button>
              )}
            </div>
          )}

          {activeTab === 'images' && (
            <div className="embed-section">
              <div className="field">
                <label className="lbl">Thumbnail URL (top right)</label>
                <input className="inp" placeholder="https://i.imgur.com/..." value={embed.thumbnail.url} onChange={e => f('thumbnail', { url: e.target.value })} />
                {embed.thumbnail.url && <img src={embed.thumbnail.url} alt="" style={{ marginTop: 6, maxWidth: 80, maxHeight: 80, borderRadius: 4, border: '1px solid var(--border)' }} onError={e => e.target.style.display='none'} />}
              </div>
              <div className="field">
                <label className="lbl">Image URL (bottom, large)</label>
                <input className="inp" placeholder="https://i.imgur.com/..." value={embed.image.url} onChange={e => f('image', { url: e.target.value })} />
                {embed.image.url && <img src={embed.image.url} alt="" style={{ marginTop: 6, maxWidth: '100%', maxHeight: 150, borderRadius: 4, border: '1px solid var(--border)', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .embed-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: var(--bg); }
        .embed-hdr { display: flex; align-items: center; gap: 8px; padding: 8px 10px; cursor: pointer; user-select: none; background: var(--bg3); }
        .embed-color-strip { width: 4px; height: 28px; border-radius: 2px; flex-shrink: 0; }
        .embed-num { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text3); flex-shrink: 0; }
        .embed-title-preview { font-size: 12px; color: var(--text2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; }
        .embed-ctrl { display: flex; gap: 3px; flex-shrink: 0; }
        .chev { font-size: 13px; color: var(--text3); transition: transform .2s; flex-shrink: 0; }
        .chev.open { transform: rotate(180deg); }
        .embed-body { border-top: 1px solid var(--border); }
        .embed-tabs { display: flex; border-bottom: 1px solid var(--border); }
        .etab { flex: 1; padding: 7px; font-size: 11px; font-weight: 700; color: var(--text4); background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: all .15s; }
        .etab:hover { color: var(--text2); }
        .etab.on { color: var(--text2); border-bottom-color: var(--accent); background: var(--bg2); }
        .embed-section { padding: 12px; display: flex; flex-direction: column; gap: 0; }
        .embed-group { background: var(--bg2); border-radius: 6px; padding: 10px; margin-bottom: 10px; border: 1px solid var(--border); }
        .group-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--accent); margin-bottom: 8px; }
        .field-row { border: 1px solid var(--border); border-radius: 6px; overflow: hidden; margin-bottom: 6px; }
        .field-row-hdr { display: flex; align-items: center; gap: 7px; padding: 7px 10px; cursor: pointer; user-select: none; background: var(--bg3); }
        .field-row-idx { font-size: 9px; font-weight: 800; color: var(--text4); text-transform: uppercase; flex-shrink: 0; }
        .field-row-name { font-size: 12px; color: var(--text2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; }
        .field-row-ctrl { display: flex; gap: 2px; flex-shrink: 0; }
        .field-row-body { padding: 10px; border-top: 1px solid var(--border); }
        .color-picker-wrap { display: flex; flex-direction: column; gap: 8px; }
        .color-presets { display: flex; flex-wrap: wrap; gap: 5px; }
        .cp-swatch { width: 22px; height: 22px; border-radius: 4px; border: 2px solid transparent; cursor: pointer; transition: all .15s; }
        .cp-swatch:hover { border-color: #fff; transform: scale(1.1); }
        .cp-swatch.selected { border-color: #fff; outline: 2px solid var(--accent); }
        .cp-swatch.no-color { background: var(--bg3); border: 1px solid var(--border2); color: var(--danger); font-size: 11px; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  )
}
