import { useState } from 'react'

export default function BackupModal({ state, onRestore, onClose }) {
  const json = JSON.stringify(state, null, 2)
  const [input, setInput] = useState('')
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(json).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const restore = () => {
    try {
      const parsed = JSON.parse(input.trim())
      if (!parsed.messages || !Array.isArray(parsed.messages)) throw new Error('Invalid backup format')
      onRestore(parsed)
    } catch (e) {
      setErr(e.message)
    }
  }

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'hooksender-backup.json'
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box backup-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-title">💾 Backup & Restore</div>
          <button className="btn-icon del" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="bk-section">
            <div className="bk-label">Export / Backup</div>
            <p className="bk-desc">Save your current messages and settings to a JSON file.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? '✓ Copied!' : '📋 Copy JSON'}</button>
              <button className="btn btn-primary btn-sm" onClick={download}>⬇ Download .json</button>
            </div>
          </div>
          <div className="bk-divider" />
          <div className="bk-section">
            <div className="bk-label">Import / Restore</div>
            <p className="bk-desc">Paste a previously exported JSON backup to restore your session.</p>
            <textarea
              className="inp"
              style={{ minHeight: 120, resize: 'vertical', marginBottom: 8 }}
              placeholder='Paste backup JSON here...'
              value={input}
              onChange={e => { setInput(e.target.value); setErr('') }}
            />
            {err && <div className="bk-err">✗ {err}</div>}
            <button className="btn btn-primary btn-sm" onClick={restore} disabled={!input.trim()}>↩ Restore</button>
          </div>
        </div>
      </div>

      <style>{`
        .backup-modal { width: 100%; max-width: 520px; max-height: 80vh; }
        .bk-section { padding: 4px 0; }
        .bk-label { font-size: 12px; font-weight: 800; color: var(--text2); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .bk-desc { font-size: 12px; color: var(--text3); margin-bottom: 10px; line-height: 1.5; }
        .bk-divider { border-top: 1px solid var(--border); margin: 14px 0; }
        .bk-err { font-size: 12px; color: var(--danger); margin-bottom: 8px; }
      `}</style>
    </div>
  )
}
