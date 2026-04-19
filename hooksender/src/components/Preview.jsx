import { renderMarkdown, intToHex } from '../utils.js'

const BTN_COLORS = { 1:'#5865f2', 2:'#4e5058', 3:'#248046', 4:'#da373c', 5:'#4e5058' }

function DiscordMd({ text, inline }) {
  if (!text) return null
  const html = renderMarkdown(text)
  return inline
    ? <span dangerouslySetInnerHTML={{ __html: html }} />
    : <div dangerouslySetInnerHTML={{ __html: html }} />
}

function CV2Component({ comp }) {
  if (comp.type === 10) return (
    <div className="cv2p-text"><DiscordMd text={comp.content} /></div>
  )
  if (comp.type === 14) return comp.divider
    ? <hr className="cv2p-hr" style={{ margin: comp.spacing === 2 ? '12px 0' : '5px 0' }} />
    : <div style={{ height: comp.spacing === 2 ? 16 : 8 }} />
  if (comp.type === 12) {
    const valid = (comp.items || []).filter(i => i.media?.url)
    if (!valid.length) return <div className="cv2p-no-img">No images</div>
    return (
      <div className="cv2p-gallery" style={{ gridTemplateColumns: valid.length > 1 ? '1fr 1fr' : '1fr' }}>
        {valid.map((it, i) => (
          <img key={i} src={it.media.url} alt={it.description || ''} className="cv2p-img"
            onError={e => { e.target.style.opacity = 0.3 }} />
        ))}
      </div>
    )
  }
  if (comp.type === 17) {
    const accent = comp.accent_color != null ? intToHex(comp.accent_color) : null
    return (
      <div className="cv2p-container" style={{ borderLeft: accent ? `4px solid ${accent}` : '4px solid var(--border)' }}>
        {(comp.components || []).map((c, i) => <CV2Component key={i} comp={c} />)}
      </div>
    )
  }
  if (comp.type === 1) return (
    <div className="cv2p-btns">
      {(comp.components || []).map((btn, i) => (
        <button key={i} className="cv2p-btn" style={{ background: BTN_COLORS[btn.style] || '#5865f2', opacity: btn.disabled ? 0.4 : 1 }}>
          {btn.style === 5 && '🔗 '}{btn.label || 'Button'}
        </button>
      ))}
    </div>
  )
  return null
}

function DiscordEmbed({ embed }) {
  const color = intToHex(embed.color)
  const hasContent =
    embed.author?.name || embed.title || embed.description ||
    embed.fields?.length || embed.image?.url || embed.footer?.text || embed.timestamp

  if (!hasContent) return null

  return (
    <div className="dembed" style={{ borderLeft: `4px solid ${color || '#1e1a2e'}` }}>
      {/* Author */}
      {embed.author?.name && (
        <div className="dembed-author">
          {embed.author.icon_url && <img src={embed.author.icon_url} alt="" className="dembed-author-icon" onError={e => e.target.style.display='none'} />}
          {embed.author.url ? <a href={embed.author.url} target="_blank" rel="noopener" className="dembed-author-name link">{embed.author.name}</a>
            : <span className="dembed-author-name">{embed.author.name}</span>}
        </div>
      )}

      <div className="dembed-main">
        <div className="dembed-content">
          {/* Title */}
          {embed.title && (
            embed.url
              ? <a href={embed.url} target="_blank" rel="noopener" className="dembed-title link">{embed.title}</a>
              : <div className="dembed-title">{embed.title}</div>
          )}

          {/* Description */}
          {embed.description && (
            <div className="dembed-desc"><DiscordMd text={embed.description} /></div>
          )}

          {/* Fields */}
          {embed.fields?.length > 0 && (
            <div className="dembed-fields">
              {embed.fields.map((f, i) => (
                <div key={f.id || i} className="dembed-field" style={{ gridColumn: f.inline ? 'span 1' : '1 / -1' }}>
                  <div className="dembed-field-name">{f.name}</div>
                  <div className="dembed-field-value"><DiscordMd text={f.value} /></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail */}
        {embed.thumbnail?.url && (
          <img src={embed.thumbnail.url} alt="" className="dembed-thumb" onError={e => e.target.style.display='none'} />
        )}
      </div>

      {/* Image */}
      {embed.image?.url && (
        <img src={embed.image.url} alt="" className="dembed-image" onError={e => e.target.style.display='none'} />
      )}

      {/* Footer */}
      {(embed.footer?.text || embed.timestamp) && (
        <div className="dembed-footer">
          {embed.footer?.icon_url && <img src={embed.footer.icon_url} alt="" className="dembed-footer-icon" onError={e => e.target.style.display='none'} />}
          <span className="dembed-footer-text">
            {embed.footer?.text}
            {embed.footer?.text && embed.timestamp && ' • '}
            {embed.timestamp && new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}
    </div>
  )
}

export default function Preview({ activeMsg, useCV2 }) {
  const name = activeMsg.username || 'Webhook'
  const avatar = activeMsg.avatar_url || null
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const hasContent = useCV2
    ? activeMsg.components?.length > 0
    : activeMsg.content || activeMsg.embeds?.length > 0

  return (
    <div className="preview-root">
      <div className="preview-inner">

        {/* Channel header mock */}
        <div className="preview-channel-hdr">
          <span className="preview-ch-hash">#</span>
          <span className="preview-ch-name">general</span>
          <span className="preview-ch-sep">|</span>
          <span className="preview-ch-topic">Live preview of your webhook message</span>
        </div>

        {/* Messages area */}
        <div className="preview-msgs">
          {!hasContent && (
            <div className="preview-empty">
              <div className="preview-empty-icon">👁</div>
              <div>Your message preview will appear here</div>
              <div style={{ fontSize: 12, color: 'var(--text4)', marginTop: 4 }}>Add content in the Editor panel</div>
            </div>
          )}

          {hasContent && (
            <div className="dmsg">
              <div className="dmsg-avatar">
                {avatar
                  ? <img src={avatar} alt="" className="dmsg-avatar-img" onError={e => e.target.style.display='none'} />
                  : <div className="dmsg-avatar-fallback">{name[0]?.toUpperCase()}</div>
                }
              </div>
              <div className="dmsg-content">
                <div className="dmsg-meta">
                  <span className="dmsg-name">{name}</span>
                  <span className="dmsg-app">APP</span>
                  <span className="dmsg-time">Today at {time}</span>
                </div>

                {!useCV2 ? (
                  <>
                    {activeMsg.content && (
                      <div className="dmsg-text">
                        <DiscordMd text={activeMsg.content} />
                      </div>
                    )}
                    {activeMsg.embeds?.map((embed, i) => (
                      <DiscordEmbed key={embed.id || i} embed={embed} />
                    ))}
                  </>
                ) : (
                  <div className="dmsg-cv2">
                    {activeMsg.components?.map((comp, i) => (
                      <CV2Component key={comp.id || i} comp={comp} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .preview-root { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: #1e1a2e; }
        .preview-channel-hdr {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-bottom: 1px solid #2d2540;
          background: #1a162b; flex-shrink: 0;
        }
        .preview-ch-hash { font-size: 18px; color: #4a3a70; font-weight: 700; }
        .preview-ch-name { font-size: 14px; font-weight: 800; color: #e2d4f5; }
        .preview-ch-sep { color: #4a3a70; }
        .preview-ch-topic { font-size: 12px; color: #6d4b9a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .preview-inner { flex: 1; overflow-y: auto; }
        .preview-msgs { padding: 20px 16px; min-height: 100%; }
        .preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #4a3a70; font-size: 14px; gap: 8px; }
        .preview-empty-icon { font-size: 48px; opacity: .3; }

        /* Discord message */
        .dmsg { display: flex; gap: 14px; padding: 4px 0 8px; }
        .dmsg-avatar { width: 40px; height: 40px; flex-shrink: 0; }
        .dmsg-avatar-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .dmsg-avatar-fallback { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #4c1d95); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: 800; }
        .dmsg-content { flex: 1; min-width: 0; }
        .dmsg-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .dmsg-name { font-size: 15px; font-weight: 700; color: #e2d4f5; }
        .dmsg-app { font-size: 9px; font-weight: 700; background: #5865f2; color: #fff; padding: 1px 5px; border-radius: 3px; vertical-align: middle; }
        .dmsg-time { font-size: 11px; color: #4a3a70; }
        .dmsg-text { font-size: 14px; color: #dcddde; line-height: 1.55; margin-bottom: 4px; }
        .dmsg-text code { background: #2d2044; color: #c4b5fd; padding: 1px 5px; border-radius: 3px; font-size: .9em; }
        .dmsg-text strong { color: #f0e9ff; }
        .dmsg-text blockquote.bq { border-left: 4px solid #4a2585; padding-left: 10px; margin: 4px 0; color: #a0a0b0; }
        .dmsg-text blockquote.bq-big { border-left: 4px solid #4a2585; padding-left: 10px; margin: 4px 0; color: #a0a0b0; }
        .dmsg-text a.dlink { color: #a78bfa; text-decoration: none; }
        .dmsg-text a.dlink:hover { text-decoration: underline; }

        /* Embeds */
        .dembed {
          max-width: 520px; background: #1e1a2e; border-radius: 4px;
          border: 1px solid #2d2540; margin: 4px 0; padding: 12px 16px 12px 12px;
          overflow: hidden; position: relative;
        }
        .dembed-author { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; }
        .dembed-author-icon { width: 20px; height: 20px; border-radius: 50%; }
        .dembed-author-name { font-size: 13px; font-weight: 700; color: #e2d4f5; }
        .dembed-author-name.link { color: #a78bfa; text-decoration: none; }
        .dembed-main { display: flex; gap: 12px; }
        .dembed-content { flex: 1; min-width: 0; }
        .dembed-title { font-size: 15px; font-weight: 700; color: #e2d4f5; margin-bottom: 4px; }
        .dembed-title.link { color: #a78bfa; text-decoration: none; display: block; }
        .dembed-title.link:hover { text-decoration: underline; }
        .dembed-desc { font-size: 13px; color: #b9bbbe; line-height: 1.5; margin-bottom: 8px; }
        .dembed-desc code { background: #2d2044; color: #c4b5fd; padding: 1px 5px; border-radius: 3px; font-size: .9em; }
        .dembed-desc strong { color: #f0e9ff; }
        .dembed-desc a.dlink { color: #a78bfa; text-decoration: none; }
        .dembed-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px; }
        .dembed-field { }
        .dembed-field-name { font-size: 12px; font-weight: 700; color: #e2d4f5; margin-bottom: 2px; }
        .dembed-field-value { font-size: 12px; color: #b9bbbe; line-height: 1.4; }
        .dembed-field-value code { background: #2d2044; color: #c4b5fd; padding: 1px 4px; border-radius: 3px; font-size: .85em; }
        .dembed-thumb { width: 80px; height: 80px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
        .dembed-image { max-width: 100%; border-radius: 4px; margin-top: 8px; display: block; max-height: 300px; object-fit: cover; }
        .dembed-footer { display: flex; align-items: center; gap: 7px; margin-top: 8px; }
        .dembed-footer-icon { width: 16px; height: 16px; border-radius: 50%; }
        .dembed-footer-text { font-size: 11px; color: #72767d; }
        .link { cursor: pointer; }

        /* CV2 preview */
        .dmsg-cv2 { display: flex; flex-direction: column; gap: 5px; }
        .cv2p-text { font-size: 14px; color: #dcddde; line-height: 1.55; }
        .cv2p-text code { background: #2d2044; color: #c4b5fd; padding: 1px 5px; border-radius: 3px; font-size: .9em; }
        .cv2p-text strong { color: #f0e9ff; }
        .cv2p-hr { border: none; border-top: 1px solid #2d2540; }
        .cv2p-gallery { display: grid; gap: 4px; border-radius: 6px; overflow: hidden; }
        .cv2p-img { width: 100%; height: 140px; object-fit: cover; display: block; background: #2d1758; }
        .cv2p-no-img { background: #1b1030; border-radius: 6px; padding: 12px; color: #4a3a70; font-size: 12px; text-align: center; }
        .cv2p-container { background: #1a1528; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
        .cv2p-btns { display: flex; flex-wrap: wrap; gap: 5px; }
        .cv2p-btn { padding: 6px 14px; border-radius: 3px; border: none; color: #fff; font-size: 13px; font-weight: 500; cursor: default; }
      `}</style>
    </div>
  )
}
