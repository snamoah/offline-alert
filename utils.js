'use strict'

const os = require('os')
const path = require('path')

module.exports = {
  getPidFilePath() {
    return path.join(os.homedir(), '.offlinealert')
  },

  handlePidProcess (fn) {
    return (err, running) => {
      if (err) {
        console.error('Error reading pid file', err)
      } else {
        return fn(running)
      }
    }
  }
}
