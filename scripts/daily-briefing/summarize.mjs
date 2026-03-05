export async function generateBriefing(hnData, redditData) {
  const dateStr = new Date().toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })

  const prompt = `你是KANCE——一位混迹硅谷科技圈的资深极客，同时也是一位金融观察者。请根据以下数据生成一份简洁的中文早安日报。

今天：${dateStr}

要求：
1. 分以下板块，每板块挑2-4条最有价值的（没有好内容的板块可跳过）：
   🤖 AI与科技前沿
   💰 金融与华尔街
   🔥 硅谷热议
   🚀 值得关注的产品/项目
2. 每条用一行中文概括要点，末尾标注来源如 [HN] [Reddit]
3. 总字数300-500，语气：专业、犀利、有洞察力，像一个真正混圈子的极客朋友在跟你聊天
4. 开头用一句话抓住今日核心
5. 末尾加一句简短有力的早安寄语（不要鸡汤，要有极客范）
6. 过滤掉重复、低质量、纯娱乐内容
7. 使用Telegram Markdown格式：*粗体* _斜体_（不要用**或__）

=== HackerNews Top Stories ===
${JSON.stringify(hnData.slice(0, 25), null, 2)}

=== Reddit Highlights ===
${JSON.stringify(redditData.slice(0, 40), null, 2)}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.content[0].text
}
