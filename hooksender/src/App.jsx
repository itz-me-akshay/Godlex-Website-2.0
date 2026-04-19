import { useState, useEffect } from 'react'
import { uid, defaultMessage } from './utils.js'
import Topbar from './components/Topbar.jsx'
import Editor from './components/Editor.jsx'
import Preview from './components/Preview.jsx'
import JsonModal from './components/JsonModal.jsx'
import BackupModal from './components/BackupModal.jsx'

const STORAGE_KEY = 'hooksender_state'

const loadState = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return JSON.parse(s)
  } catch {}
  return null
}

const initState = () => {
  const saved = loadState()
  if (saved) return saved
  const msg = defaultMessage()
  return {
    webhookUrl: '',
    messages: [msg],
    activeId: msg.id,
    useCV2: false,
  }
}

export default function App() {
  const [state, setState] = useState(initState)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [backupOpen, setBackupOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState(null) // {ok, msg}
  const [mobileTab, setMobileTab] = useState('editor') // 'editor' | 'preview'

  const { webhookUrl, messages, activeId, useCV2 } = state
  const activeMsg = messages.find(m => m.id === activeId) || messages[0]

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  const set = (patch) => setState(s => ({ ...s, ...patch }))

  const setMsg = (patch) => setState(s => ({
    ...s,
    messages: s.messages.map(m => m.id === s.activeId ? { ...m, ...patch } : m)
  }))

  const addMessage = () => {
    const msg = defaultMessage()
    setState(s => ({ ...s, messages: [...s.messages, msg], activeId: msg.id }))
  }

  const removeMessage = (id) => {
    setState(s => {
      if (s.messages.length === 1) return s
      const msgs = s.messages.filter(m => m.id !== id)
      const activeId = s.activeId === id ? msgs[msgs.length - 1].id : s.activeId
      return { ...s, messages: msgs, activeId }
    })
  }

  const duplicateMessage = (id) => {
    setState(s => {
      const src = s.messages.find(m => m.id === id)
      if (!src) return s
      const copy = { ...JSON.parse(JSON.stringify(src)), id: uid() }
      const idx = s.messages.findIndex(m => m.id === id)
      const msgs = [...s.messages.slice(0, idx + 1), copy, ...s.messages.slice(idx + 1)]
      return { ...s, messages: msgs, activeId: copy.id }
    })
  }

  const clearAll = () => {
    const msg = defaultMessage()
    setState({ webhookUrl: '', messages: [msg], activeId: msg.id, useCV2: false })
  }

  const send = async () => {
    if (!webhookUrl.trim()) { setSendStatus({ ok: false, msg: 'Webhook URL is required.' }); return }
    setSending(true); setSendStatus(null)
    const { buildPayload } = await import('./utils.js')
    const payload = buildPayload(activeMsg, useCV2)
    const url = webhookUrl.trim() + (activeMsg.thread_id.trim() ? `?thread_id=${activeMsg.thread_id.trim()}&wait=true` : '?wait=true')
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { setSendStatus({ ok: true, msg: 'Message sent!' }) }
      else { const e = await res.json().catch(() => ({})); setSendStatus({ ok: false, msg: e.message || `Error ${res.status}` }) }
    } catch (e) { setSendStatus({ ok: false, msg: e.message || 'Network error' }) }
    setSending(false)
    setTimeout(() => setSendStatus(null), 4000)
  }

  return (
    <div className="app-root">
      <Topbar
        onJsonOpen={() => setJsonOpen(true)}
        onBackupOpen={() => setBackupOpen(true)}
        onClearAll={clearAll}
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
      />

      <div className="app-body">
        <div className={`panel-editor${mobileTab === 'editor' ? ' mobile-show' : ' mobile-hide'}`}>
          <Editor
            state={state}
            activeMsg={activeMsg}
            setMsg={setMsg}
            set={set}
            addMessage={addMessage}
            removeMessage={removeMessage}
            duplicateMessage={duplicateMessage}
            webhookUrl={webhookUrl}
            setWebhookUrl={url => set({ webhookUrl: url })}
            useCV2={useCV2}
            setUseCV2={v => set({ useCV2: v })}
            sending={sending}
            sendStatus={sendStatus}
            onSend={send}
          />
        </div>

        <div className={`panel-preview${mobileTab === 'preview' ? ' mobile-show' : ' mobile-hide'}`}>
          <Preview activeMsg={activeMsg} useCV2={useCV2} />
        </div>
      </div>

      {jsonOpen && (
        <JsonModal
          activeMsg={activeMsg}
          useCV2={useCV2}
          webhookUrl={webhookUrl}
          onClose={() => setJsonOpen(false)}
        />
      )}
      {backupOpen && (
        <BackupModal
          state={state}
          onRestore={(s) => { setState(s); setBackupOpen(false) }}
          onClose={() => setBackupOpen(false)}
        />
      )}

      <style>{`
        .app-root { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
        .app-body { display: flex; flex: 1; overflow: hidden; }
        .panel-editor {
          width: 420px; min-width: 420px; flex-shrink: 0;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; overflow: hidden;
          background: var(--bg2);
        }
        .panel-preview {
          flex: 1; overflow: hidden;
          background: var(--bg);
        }
        @media (max-width: 768px) {
          .panel-editor, .panel-preview { width: 100%; min-width: 0; flex-shrink: 0; }
          .panel-editor.mobile-hide, .panel-preview.mobile-hide { display: none; }
          .panel-editor.mobile-show, .panel-preview.mobile-show { display: flex; flex: 1; flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
