'use strict'

const ping = require('ping')
const beep = require('beepbeep')
const { getPidFilePath, handlePidProcess } = require('./utils')
const pid = require('daemon-pid')(getPidFilePath())

const DEFAULT_HOST = 'google.com'

const last = 200
const baseline = [ 200, 200, 200 ]
const interlude = [ 50, 50, 50, 50 ]

const offlineBeep = _ =>
  beep([...baseline, ...interlude, last])


const checkConnection = _ =>
  ping.sys.probe(DEFAULT_HOST, isAlive => { 
    isAlive || offlineBeep() 
  })

pid.write(handlePidProcess(_ => {
  const interval = setInterval(checkConnection, 2000)

  process.on('SIGTERM', _ => {
    clearInterval(interval)
    pid.delete(err => {
      if (err) console.error('Something wrong happened while deleting pid file')
      console.log('Pinging stopped')
    })
  })
}))
