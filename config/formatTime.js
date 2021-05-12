const moment = require('moment')

function formatTime(time) {
  return moment(time, moment.HTML5_FMT.TIME).format("HH:mm")
}

module.exports = formatTime