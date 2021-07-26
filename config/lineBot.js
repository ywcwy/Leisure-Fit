const line = require('@line/bot-sdk')
const client = new line.Client({
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
})
const fetch = require('node-fetch')

// push message
const pushMessage = function (userId, text) {
  if (Array.isArray(userId)) {
    const lineUserId = []
    userId.map(u => lineUserId.push(u.lineUserId))
    client.pushMessage(lineUserId.toString(','), { type: 'text', text })
  } else {
    client.pushMessage(userId, { type: 'text', text })
  }
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

async function handleMessage(message, replyToken) {
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

    case '空氣品質':
    case '空品':
    case 'AQI':
      return client.replyMessage(replyToken, {
        type: 'text',
        text: await crawlAQI()
      }).catch(err => console.log(err))
  }
}

async function crawlAQI() {
  const url = 'https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1&api_key=0a32774f-3dec-49ac-9919-1deacaf3b6f7&filters=County,EQ,臺北市|SiteName,EQ,古亭'
  try {
    const response = await fetch(encodeURI(url))
    try {
      const data = await response.json()
      return `${data.records[0].PublishTime} 的空氣品質監測結果：AQI指標為"${data.records[0].AQI}"，狀態為"${data.records[0].Status}"。`
    }
    catch (error) {
      console.log('There has been a problem with your fetch operation: ', error.message)
    }
  }
  catch { throw new Error('Network response was not ok.') }
}

module.exports = { pushMessage, handleEvent }