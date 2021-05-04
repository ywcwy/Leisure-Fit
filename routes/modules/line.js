const express = require('express')
const router = express.Router()
const line = require('@line/bot-sdk')
const crypto = require('crypto')

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

router.get('/', (req, res) => res.end(`I'm listening. Please access with POST.`))

router.post('/callback', (req, res) => {
  // 驗證 signature
  const headerXLine = req.get('X-Line-Signature')
  const body = JSON.stringify(req.body) // Request body string
  const signature = crypto
    .createHmac('SHA256', client.channelSecret)
    .update(body).digest('base64')

  if (headerXLine === signature) { // 如果驗證後確認是由 LINE server 發來的訊息
    res.status(200)
    // event
    const event = req.body.events[0]
    const { type, replyToken, source, message } = event
    console.log(type, replyToken, source, message)

    // follow event
    if (type === 'follow') {
      client.replyMessage(replyToken, {
        type: 'text',
        text: '歡迎加入 Leisure-Fit 戶外訓練，每週課表請詳連結 https://leisure-fit.herokuapp.com/calendar 。'
      })
    }

    // message event
    if (type === 'message') {
      if (message.type === 'text' && message.text === '課程') {
        if (source.type === 'user') {
          client.replyMessage(replyToken, {
            type: 'image',
            text: '每週二，一起變強 - 戶外體能。每週三，一起變辣 - 女性限定。每週四，一起變強 - Cross - Fit。每週課表請詳連結 https://leisure-fit.herokuapp.com/calendar'
          })
            .catch(err => console.log(err))
        }
      }
    }
  }
})


module.exports = router