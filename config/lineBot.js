const line = require('@line/bot-sdk')
const client = new line.Client({
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
})

// push message
const pushMessage = function (userId, text) {
  if (userId.isArray()) {
    const lineUserId = []
    userId.map(u => lineUserId.push(u.lineUserId))
    client.pushMessage(lineUserId, { type: 'text', text })
  }
  client.pushMessage(userId, { type: 'text', text })
}

// reply message
const handleEvent = function (event) {
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
  switch (message.text) {
    case '課程':
    case '課表':
    case '課程表':
      return client.replyMessage(replyToken, [{
        type: 'image',
        originalContentUrl: 'https://i.imgur.com/xfLhBxy.png',
        previewImageUrl: 'https://i.imgur.com/xfLhBxy.png'
      }, {
        type: 'text',
        text: '每週二，一起變強 - 戶外體能。每週三，一起變辣 - 女性限定。每週四，一起變強 - Cross - Fit。每週課表請詳連結 https://leisure-fit.herokuapp.com/calendar'
      }]).catch(err => console.log(err))

    case '雨備':
    case '雨備場地':
      return client.replyMessage(replyToken, {
        type: 'location',
        title: '雨備場地',
        address: '辛亥橋下(辛亥與新生南路交接口）',
        latitude: 25.022428,
        longitude: 121.534221
      }).catch(err => console.log(err))

    case '台大場地':
    case '操場':
      return client.replyMessage(replyToken, {
        type: 'location',
        title: '台大場地',
        address: '台大操場',
        latitude: 25.018878,
        longitude: 121.534602
      }).catch(err => console.log(err))
  }
}

module.exports = { pushMessage, handleEvent }