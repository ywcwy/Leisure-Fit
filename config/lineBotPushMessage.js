const line = require('@line/bot-sdk')
const client = new line.Client({
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
})

const pushMessage = function (userId, text) {
  client.pushMessage(userId, { type: 'text', text })
}

module.exports = pushMessage