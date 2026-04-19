import { useState } from 'react'
import { uid, defaultEmbed, defaultMessage } from '../utils.js'
import EmbedEditor from './EmbedEditor.jsx'
import CV2Editor from './CV2Editor.jsx'

export default function Editor({
  state, activeMsg, setMsg, set,
  addMessage, removeMessage, duplicateMessage,
  webhookUrl, setWebhookUrl,
  useCV2, setUseCV2,
  sending, sendStatus, onSend,
}) {
  const { messages, activeId } = state

  const setEmbed = (id, patch) => setMsg({
    embeds: activeMsg.embeds.map(e => e.id === id ? { ...e, ...patch } : e)
  })
  const addEmbed = () => {
    if (activeMsg.embeds.length >= 10) return
    setMsg({ embeds: [...activeMsg.embeds, defaultEmbed()] })
  }
  const removeEmbed = (id) => setMsg({ embeds: activeMsg.embeds.filter(e => e.id !== id) })
  const moveEmbed = (id, dir) => {
    const arr = [...activeMsg.embeds]
    const i = arr.findIndex(e => e.id === id)
    if (i + dir < 0 || i + dir >= arr.length) return
    ;[arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]
    setMsg({ embeds: arr })
  }
  const duplicateEmbed = (id) => {
    const src = activeMsg.embeds.find(e => e.id === id)
    if (!src) return
    const copy = { ...JSON.parse(JSON.stringify(src)), id: uid() }
    const idx = activeMsg.embeds.findIndex(e => e.id === id)
    const embeds = [...activeMsg.embeds.slice(0, idx + 1), copy, ...activeMsg.embeds.slice(idx + 1)]
    setMsg({ embeds })
  }

  return (
    <div className="editor-root">

      {/* Message Tabs */}
      <div className="msg-tabs">
        {messages.map((m, i) => (
          <div
            key={m.id}
            className={`msg-tab${m.id === activeId ? ' active' : ''}`}
            onClick={() => set({ activeId: m.id })}
          >
            <span>Message {i + 1}</span>
            {messages.length > 1 && (
              <button
                className="tab-del"
                onClick={e => { e.stopPropagation(); removeMessage(m.id) }}
                title="Remove message"
              >✕</button>
            )}
          </div>
        ))}
        <button className="msg-tab-add" onClick={addMessage} title="Add message">＋</button>
      </div>

      {/* Scrollable editor body */}
      <div className="editor-scroll">

        {/* Webhook config */}
        <section className="ed-section">
          <div className="sec-title">Webhook</div>
          <div className="field">
            <label className="lbl">Webhook URL</label>
            <input
              className="inp"
              type="text"
              placeholder="https://discord.com/api/webhooks/ID/TOKEN"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
            />
          </div>
          <div className="row2">
            <div className="field" style={{ flex: 1 }}>
              <label className="lbl">Override Username</label>
              <input className="inp" placeholder="Bot Name" value={activeMsg.username} onChange={e => setMsg({ username: e.target.value })} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="lbl">Thread ID</label>
              <input className="inp" placeholder="Optional" value={activeMsg.thread_id} onChange={e => setMsg({ thread_id: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label className="lbl">Override Avatar URL</label>
            <input className="inp" placeholder="https://i.imgur.com/..." value={activeMsg.avatar_url} onChange={e => setMsg({ avatar_url: e.target.value })} />
          </div>
        </section>

        {/* CV2 Toggle */}
        <section className="ed-section" style={{ paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="sec-title" style={{ marginBottom: 0 }}>Message Mode</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`mode-btn${!useCV2 ? ' active' : ''}`}
                onClick={() => setUseCV2(false)}
              >📋 Embeds</button>
              <button
                className={`mode-btn${useCV2 ? ' active' : ''}`}
                onClick={() => setUseCV2(true)}
              >🧩 Components V2</button>
            </div>
          </div>
        </section>

        {!useCV2 ? (
          <>
            {/* Message Content */}
            <section className="ed-section">
              <div className="sec-title">Content</div>
              <div className="field">
                <label className="lbl">Message Content</label>
                <textarea
                  className="inp"
                  style={{ minHeight: 90, resize: 'vertical' }}
                  placeholder="Message content (markdown supported)"
                  value={activeMsg.content}
                  onChange={e => setMsg({ content: e.target.value })}
                />
              </div>
            </section>

            {/* Embeds */}
            <section className="ed-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="sec-title" style={{ marginBottom: 0 }}>
                  Embeds <span className="count-badge">{activeMsg.embeds.length}/10</span>
                </div>
                <button className="btn btn-sm btn-ghost" onClick={addEmbed} disabled={activeMsg.embeds.length >= 10}>
                  ＋ Add Embed
                </button>
              </div>

              {activeMsg.embeds.length === 0 && (
                <div className="empty-hint">No embeds. Click "Add Embed" to create one.</div>
              )}

              {activeMsg.embeds.map((embed, idx) => (
                <EmbedEditor
                  key={embed.id}
                  embed={embed}
                  idx={idx}
                  total={activeMsg.embeds.length}
                  onChange={patch => setEmbed(embed.id, patch)}
                  onRemove={() => removeEmbed(embed.id)}
                  onMove={dir => moveEmbed(embed.id, dir)}
                  onDuplicate={() => duplicateEmbed(embed.id)}
                />
              ))}

              {activeMsg.embeds.length > 0 && activeMsg.embeds.length < 10 && (
                <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={addEmbed}>
                  ＋ Add Embed
                </button>
              )}
            </section>
          </>
        ) : (
          <CV2Editor
            components={activeMsg.components}
            onChange={components => setMsg({ components })}
          />
        )}

      </div>

      {/* Send bar */}
      <div className="send-bar">
        <div className="send-status-wrap">
          {sendStatus && (
            <span className={sendStatus.ok ? 'status-ok' : 'status-err'}>
              {sendStatus.ok ? '✓' : '✗'} {sendStatus.msg}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => duplicateMessage(activeId)}
            title="Duplicate this message"
          >⊕ Duplicate</button>
          <button
            className="send-btn"
            onClick={onSend}
            disabled={sending || !webhookUrl.trim()}
          >{sending ? 'Sending…' : '↑ Send'}</button>
        </div>
      </div>

      <style>{`
        .editor-root { display: flex; flex-direction: column; height: 100%; overflow: hidden; }

        .msg-tabs {
          display: flex; align-items: center; gap: 0;
          background: var(--bg); border-bottom: 1px solid var(--border); padding: 0 10px;
          overflow-x: auto; flex-shrink: 0;
        }
        .msg-tabs::-webkit-scrollbar { height: 3px; }
        .msg-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 14px; font-size: 12px; font-weight: 700; color: var(--text3);
          cursor: pointer; border-bottom: 2px solid transparent;
          transition: all .15s; white-space: nowrap; user-select: none;
        }
        .msg-tab:hover { color: var(--text2); }
        .msg-tab.active { color: var(--text2); border-bottom-color: var(--accent); }
        .tab-del {
          width: 16px; height: 16px; border-radius: 3px; border: none;
          background: transparent; color: var(--text4); font-size: 10px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all .15s;
        }
        .tab-del:hover { background: #3d0a0a; color: var(--danger); }
        .msg-tab-add {
          padding: 9px 12px; background: transparent; border: none;
          color: var(--text4); font-size: 16px; cursor: pointer; transition: color .15s;
          flex-shrink: 0;
        }
        .msg-tab-add:hover { color: var(--accent2); }

        .editor-scroll { flex: 1; overflow-y: auto; padding-bottom: 6px; }

        .ed-section {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }
        .sec-title {
          font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.8px;
          color: var(--accent); margin-bottom: 10px;
        }
        .count-badge {
          background: var(--bg4); padding: 1px 6px; border-radius: 10px;
          font-size: 9px; color: var(--text3); margin-left: 6px;
        }
        .row2 { display: flex; gap: 8px; }
        .row2 .field { margin-bottom: 10px; }

        .mode-btn {
          padding: 5px 12px; border-radius: 5px; border: 1px solid var(--border);
          background: transparent; color: var(--text3); font-size: 11px; font-weight: 700;
          cursor: pointer; transition: all .15s;
        }
        .mode-btn:hover { border-color: var(--accent); color: var(--text2); }
        .mode-btn.active { background: var(--bg4); border-color: var(--accent); color: var(--text2); }

        .empty-hint {
          text-align: center; padding: 20px; color: var(--text4);
          font-size: 13px; border: 1px dashed var(--border); border-radius: 6px;
          background: var(--bg);
        }

        .send-bar {
          flex-shrink: 0; padding: 10px 14px;
          background: var(--bg2); border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .send-status-wrap { flex: 1; min-width: 0; overflow: hidden; }
        .status-ok { font-size: 12px; color: var(--success); font-weight: 700; }
        .status-err { font-size: 12px; color: var(--danger); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
      `}</style>
    </div>
  )
}
