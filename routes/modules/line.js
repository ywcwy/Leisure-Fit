const express = require('express')
const router = express.Router()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const line = require('@line/bot-sdk')


// const client = new line.Client({
//   channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
//   channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
// })

const message = {
  type: 'text',
  text: "Hi, hi , i'm Wendy"
}

router.post('/callback', (req, res) => {
  console.log(req.body)
})
// client.replyMessage('<replytoken>')

module.exports = router