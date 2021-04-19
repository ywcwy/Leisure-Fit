const express = require('express')
const router = express.Router()
const line = require('@line/bot-sdk')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const client = new line.Client({
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
})


const message = {
  type: 'text',
  text: "Hi, hi , i'm Wendy"
}


let replyToken = ''
router.post('/callback', (req, res) => {
  replyToken = req.body.events.replyToken
  console.log(replyToken)
  console.log(req.body.events)
  console.log(req.body.events.message)
})
// client.replyMessage('<replytoken>')

module.exports = router