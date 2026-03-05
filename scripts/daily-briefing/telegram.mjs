export async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // Telegram limit is 4096 chars
  const msg = text.length > 4000
    ? text.slice(0, 4000) + '\n\n... (内容已截断)'
    : text

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: msg,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  })

  const result = await res.json()
  if (!result.ok) {
    throw new Error(`Telegram error: ${result.description}`)
  }
  return result
}
