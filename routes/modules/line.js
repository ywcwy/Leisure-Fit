const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const { handleEvent } = require('../../config/lineBot')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}



router.get('/', (req, res) => res.end(`I'm listening. Please access with POST.`))

router.post('/callback', (req, res) => {
  // 需於1秒內回傳 status code
  res.status(200)

  // 驗證 signature
  const headerXLine = req.get('X-Line-Signature') // 使用 req.get() 拿 HTTP request header 資料
  const body = JSON.stringify(req.body) // Request body string
  const signature = crypto
    .createHmac('SHA256', process.env.LINE_BOT_CHANNEL_SECRET)
    .update(body).digest('base64')

  if (headerXLine !== signature) { // 驗證後，發現不是由 LINE server 發來的訊息
    return res.status(401).send('Unauthorized');
  }

  // 如果驗證後確認是由 LINE server 發來的訊息，進行訊息的後續處理(webhook請求中可能同時有多個事件)
  return req.body.events.forEach(e => handleEvent(e))
})



module.exports = router