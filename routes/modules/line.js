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
  const event = req.body.events[0]
  handleEvent(event)

  return res.status(200).end()

})

function handleEvent(event) {
  const { type, replyToken } = event

  switch (type) {
    case 'follow':
      return handleFollow(replyToken)
    case 'message':
      const message = event.message
      switch (message.type) {
        case 'text':
          return handleMessage(message, replyToken)
      }
  }
}


function handleFollow(replyToken) {
  client.replyMessage(replyToken, {
    type: 'text',
    text: '歡迎加入 Leisure-Fit 戶外訓練，每週課表請詳連結 https://leisure-fit.herokuapp.com/calendar 。'
  })
}

function handleMessage(message, replyToken) {
  console.log(message.text)
  switch (message.text) {
    case '課程':
    case '課表':
    case '課程表':
      console.log('1')
      return client.replyMessage(replyToken, [{
        type: 'image',
        originalContentUrl: 'https://i.imgur.com/qzzXpU1.png',
        previewImageUrl: 'https://i.imgur.com/qzzXpU1.png'
      }, {
        type: 'text',
        text: '每週二，一起變強 - 戶外體能。每週三，一起變辣 - 女性限定。每週四，一起變強 - Cross - Fit。每週課表請詳連結 https://leisure-fit.herokuapp.com/calendar'
      }]).catch(err => console.log(err))

    case '雨備':
    case '雨備場地':
      console.log('2')
      return client.replyMessage(replyToken, {
        type: 'location',
        title: '雨備場地',
        address: '辛亥橋下(辛亥與新生南路交接口）',
        latitude: 25.022428,
        longitude: 121.534221
      }).catch(err => console.log(err))

    case '台大場地':
    case '操場':
      console.log('3')
      return client.replyMessage(replyToken, {
        type: 'location',
        title: '台大場地',
        address: '台大操場',
        latitude: 25.018878,
        longitude: 121.534602
      }).catch(err => console.log(err))
  }
}



module.exports = router