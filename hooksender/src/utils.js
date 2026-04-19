export const uid = () => Math.random().toString(36).slice(2, 9)

export const defaultEmbed = () => ({
  id: uid(),
  color: null,
  author: { name: '', url: '', icon_url: '' },
  title: '',
  url: '',
  description: '',
  fields: [],
  image: { url: '' },
  thumbnail: { url: '' },
  footer: { text: '', icon_url: '' },
  timestamp: false,
})

export const defaultMessage = () => ({
  id: uid(),
  content: '',
  username: '',
  avatar_url: '',
  thread_id: '',
  embeds: [],
  components: [],
})

export const defaultCV2Component = (type) => {
  const base = { id: uid(), type }
  switch (type) {
    case 10: return { ...base, content: 'Hello, **world**!' }
    case 14: return { ...base, divider: true, spacing: 1 }
    case 12: return { ...base, items: [{ id: uid(), media: { url: '' }, description: '' }] }
    case 17: return { ...base, accent_color: null, components: [] }
    case 1:  return { ...base, components: [{ id: uid(), type: 2, style: 1, label: 'Button', custom_id: 'btn_' + uid(), disabled: false }] }
    default: return base
  }
}

export const stripIds = (arr) =>
  arr.map(({ id, ...rest }) => {
    if (rest.components) rest.components = stripIds(rest.components)
    if (rest.fields) rest.fields = rest.fields.map(({ id: _, ...f }) => f)
    if (rest.items) rest.items = rest.items.map(({ id: _, ...i }) => i)
    return rest
  })

export const buildPayload = (msg, useCV2) => {
  const p = {}
  if (msg.username.trim()) p.username = msg.username.trim()
  if (msg.avatar_url.trim()) p.avatar_url = msg.avatar_url.trim()
  if (useCV2) {
    p.flags = 32768
    p.components = stripIds(msg.components)
  } else {
    if (msg.content.trim()) p.content = msg.content.trim()
    if (msg.embeds.length > 0) {
      p.embeds = msg.embeds.map(e => {
        const out = {}
        if (e.color != null) out.color = e.color
        if (e.author.name) out.author = Object.fromEntries(Object.entries(e.author).filter(([,v]) => v))
        if (e.title) out.title = e.title
        if (e.url) out.url = e.url
        if (e.description) out.description = e.description
        if (e.fields.length) out.fields = e.fields.map(({id:_,...f}) => f)
        if (e.image.url) out.image = { url: e.image.url }
        if (e.thumbnail.url) out.thumbnail = { url: e.thumbnail.url }
        if (e.footer.text) out.footer = Object.fromEntries(Object.entries(e.footer).filter(([,v]) => v))
        if (e.timestamp) out.timestamp = new Date().toISOString()
        return out
      })
    }
  }
  return p
}

// Simple Discord markdown -> HTML (no XSS risk as we escape first)
export const renderMarkdown = (text = '') => {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^>>> (.+)$/gm, '<blockquote class="bq bq-big">$1</blockquote>')
    .replace(/^> (.+)$/gm, '<blockquote class="bq">$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="dlink">$1</a>')
    .replace(/(https?:\/\/[^\s<]+)/g, (url) => `<a href="${url}" target="_blank" rel="noopener" class="dlink">${url}</a>`)
    .replace(/\n/g, '<br />')
}

export const intToHex = n => n == null ? null : '#' + n.toString(16).padStart(6, '0')
export const hexToInt = h => parseInt(h.replace('#', ''), 16)
