import { fetchHackerNews, fetchLobsters, fetchDevTo } from './sources.mjs'
import { generateBriefing } from './summarize.mjs'
import { sendTelegram } from './telegram.mjs'
import { wrapBriefing, getDateString } from './format.mjs'

async function main() {
  for (const key of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'ANTHROPIC_API_KEY']) {
    if (!process.env[key]) {
      console.error(`Missing: ${key}`)
      process.exit(1)
    }
  }

  console.log('Fetching data...')
  const [hnResult, lobstersResult, devtoResult] = await Promise.allSettled([
    fetchHackerNews(),
    fetchLobsters(),
    fetchDevTo(),
  ])

  const hn = hnResult.status === 'fulfilled' ? hnResult.value : []
  const lobsters = lobstersResult.status === 'fulfilled' ? lobstersResult.value : []
  const devto = devtoResult.status === 'fulfilled' ? devtoResult.value : []
  console.log(`HN: ${hn.length}, Lobsters: ${lobsters.length}, Dev.to: ${devto.length}`)

  if (hn.length === 0 && lobsters.length === 0 && devto.length === 0) {
    console.error('No data from any source')
    process.exit(1)
  }

  console.log('Generating briefing...')
  const aiContent = await generateBriefing(hn, lobsters, devto)

  const fullMessage = wrapBriefing(aiContent, getDateString())
  console.log(`Message length: ${fullMessage.length} chars`)

  console.log('Sending to Telegram...')
  await sendTelegram(fullMessage)
  console.log('Done!')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
