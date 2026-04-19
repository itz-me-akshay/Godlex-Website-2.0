import { useState } from 'react'
import { buildPayload } from '../utils.js'

export default function JsonModal({ activeMsg, useCV2, webhookUrl, onClose }) {
  const payload = buildPayload(activeMsg, useCV2)
  const json = JSON.stringify(payload, null, 2)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box json-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-title">{ } JSON Payload</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
            <button className="btn-icon del" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body">
          {webhookUrl && (
            <div className="json-url-bar">
              <span className="json-method">POST</span>
              <span className="json-url">{webhookUrl || '(no webhook URL)'}</span>
            </div>
          )}
          <pre className="json-pre">{json}</pre>
        </div>
      </div>

      <style>{`
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-box { background: var(--bg2); border: 1px solid var(--border2); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
        .json-modal { width: 100%; max-width: 640px; max-height: 80vh; }
        .modal-hdr { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
        .modal-title { font-size: 14px; font-weight: 800; color: var(--text); }
        .modal-body { flex: 1; overflow-y: auto; padding: 16px; }
        .json-url-bar { display: flex; align-items: center; gap: 8px; background: var(--bg); border: 1px solid var(--border); border-radius: 5px; padding: 7px 10px; margin-bottom: 10px; overflow: hidden; }
        .json-method { font-size: 11px; font-weight: 800; color: var(--success); flex-shrink: 0; }
        .json-url { font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .json-pre { background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 14px; font-family: 'DM Mono', monospace; font-size: 12px; color: #c4b5fd; white-space: pre; overflow-x: auto; line-height: 1.7; }
      `}</style>
    </div>
  )
}
