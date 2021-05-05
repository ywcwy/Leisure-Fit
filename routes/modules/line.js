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


router.get('/', (req, res) => res.end(`I'm listening. Please access with POST.`))

router.post('/callback', (req, res) => {
  // 驗證 signature
  const headerXLine = req.get('X-Line-Signature')
  const body = JSON.stringify(req.body) // Request body string
  const signature = crypto
    .createHmac('SHA256', process.env.LINE_BOT_CHANNEL_SECRET)
    .update(body).digest('base64')

  if (headerXLine !== signature) { // 驗證後，發現不是由 LINE server 發來的訊息
    return res.status(401).send('Unauthorized');
  }

  // 如果驗證後確認是由 LINE server 發來的訊息
  // event
  const event = req.body.events[0]
  const { type, replyToken, source, message } = event
  // console.log(type, replyToken, source, message)

  // follow event
  if (type === 'follow') {
    handleFollow(replyToken)
  }

  // message event
  if (type === 'message') {
    handleMessage(message, source, replyToken)
  }

  return res.status(200).end()

})


function handleFollow(replyToken) {
  client.replyMessage(replyToken, {
    type: 'text',
    text: '歡迎加入 Leisure-Fit 戶外訓練，每週課表請詳連結 https://leisure-fit.herokuapp.com/calendar 。'
  })
}

function handleMessage(message, source, replyToken) {
  if (message.type === 'text' && message.text === '課程' || '課表' || '課程表') {
    if (source.type === 'user') {
      client.replyMessage(replyToken, [{
        type: 'image',
        originalContentUrl: 'https://i.imgur.com/qzzXpU1.png',
        previewImageUrl: 'https://i.imgur.com/qzzXpU1.png'
      }, {
        type: 'text',
        text: '每週二，一起變強 - 戶外體能。每週三，一起變辣 - 女性限定。每週四，一起變強 - Cross - Fit。每週課表請詳連結 https://leisure-fit.herokuapp.com/calendar'
      }]).catch(err => console.log(err))
    }
  }
}



module.exports = router