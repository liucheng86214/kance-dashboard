export function getDateString() {
  return new Date().toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })
}

export function wrapBriefing(aiContent, dateStr) {
  const line = '─'.repeat(18)
  return `☀️ *KANCE 早安日报*
📅 ${dateStr}
${line}

${aiContent}

${line}
📡 HackerNews · Lobsters · Dev.to
🤖 Claude AI 编辑整理`
}
