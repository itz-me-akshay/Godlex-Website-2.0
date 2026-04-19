export default function Topbar({ onJsonOpen, onBackupOpen, onClearAll, mobileTab, setMobileTab }) {
  return (
    <header className="topbar">
      <div className="topbar-logo">
        <span className="logo-icon">⬡</span>
        <div>
          <div className="logo-name">HookSender</div>
          <div className="logo-sub">Discord Webhook Builder</div>
        </div>
      </div>

      <div className="topbar-center">
        {/* mobile tabs */}
        <div className="mobile-tabs">
          <button className={`mtab${mobileTab === 'editor' ? ' on' : ''}`} onClick={() => setMobileTab('editor')}>✏️ Editor</button>
          <button className={`mtab${mobileTab === 'preview' ? ' on' : ''}`} onClick={() => setMobileTab('preview')}>👁 Preview</button>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="tbtn" onClick={onJsonOpen} title="View JSON payload">
          <span>{'{ }'}</span> JSON
        </button>
        <button className="tbtn" onClick={onBackupOpen} title="Backup & Restore">
          💾 Backup
        </button>
        <button className="tbtn danger" onClick={() => { if (confirm('Clear everything?')) onClearAll() }} title="Clear all">
          🗑 Clear
        </button>
      </div>

      <style>{`
        .topbar {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px;
          background: var(--bg2); border-bottom: 1px solid var(--border);
          flex-shrink: 0; z-index: 10;
        }
        .topbar-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .logo-icon { font-size: 22px; background: linear-gradient(135deg, #c4b5fd, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo-name { font-size: 16px; font-weight: 800; background: linear-gradient(130deg, #c4b5fd, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }
        .logo-sub { font-size: 10px; color: var(--text4); margin-top: 1px; font-family: 'DM Mono', monospace; }
        .topbar-center { flex: 1; display: flex; justify-content: center; }
        .topbar-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .tbtn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 11px; border-radius: 5px; border: 1px solid var(--border2);
          background: transparent; color: var(--text2); font-size: 11px; font-weight: 700;
          cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .tbtn:hover { background: var(--bg3); border-color: var(--accent); color: var(--text); }
        .tbtn.danger { border-color: #3d1010; color: var(--danger); }
        .tbtn.danger:hover { background: #2d0a0a; }
        .mobile-tabs { display: none; }
        @media (max-width: 768px) {
          .mobile-tabs { display: flex; gap: 4px; }
          .mtab { padding: 5px 12px; border-radius: 5px; border: 1px solid var(--border); background: transparent; color: var(--text3); font-size: 11px; font-weight: 700; cursor: pointer; transition: all .15s; }
          .mtab.on { background: var(--bg3); border-color: var(--accent); color: var(--text2); }
          .tbtn span { display: none; }
        }
      `}</style>
    </header>
  )
}
