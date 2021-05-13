const moment = require('moment')

const formatDate = function (date) {
  return moment(date).format('YYYY-MM-DD')
}

const formatTime = function (time) {
  return moment(time, moment.HTML5_FMT.TIME).format("HH:mm")
}

module.exports = { formatDate, formatTime }