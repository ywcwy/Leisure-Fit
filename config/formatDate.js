const moment = require('moment')

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

module.exports = formatDate