module.exports = {
  ifSelected: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },
  ifCond: (a, b, options) => {
    if (a === true && b === true) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}