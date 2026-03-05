import { fetchHackerNews, fetchReddit } from './sources.mjs'
import { generateBriefing } from './summarize.mjs'
import { sendTelegram } from './telegram.mjs'
import { wrapBriefing, getDateString } from './format.mjs'

async function main() {
  // Validate env
  for (const key of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'ANTHROPIC_API_KEY']) {
    if (!process.env[key]) {
      console.error(`Missing: ${key}`)
      process.exit(1)
    }
  }

  console.log('Fetching data...')
  const [hnResult, redditResult] = await Promise.allSettled([
    fetchHackerNews(),
    fetchReddit(),
  ])

  const hn = hnResult.status === 'fulfilled' ? hnResult.value : []
  const reddit = redditResult.status === 'fulfilled' ? redditResult.value : []
  console.log(`HN: ${hn.length} stories, Reddit: ${reddit.length} posts`)

  if (hn.length === 0 && reddit.length === 0) {
    console.error('No data from any source')
    process.exit(1)
  }

  console.log('Generating briefing...')
  const aiContent = await generateBriefing(hn, reddit)

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
