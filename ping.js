'use strict'

const ping = require('ping')
const notifier = require('node-notifier');
const { getPidFilePath, handlePidProcess } = require('./utils')
const pid = require('daemon-pid')(getPidFilePath())

const DEFAULT_HOST = 'google.com'
const PING_INTERVAL = 2000;
const DELAY = 1000 * 60;

let interval;

const offlineBeep = _ => {
  notifier.notify({
    title: 'Offline Alert',
    message: 'Your computer is offline',
    sound: true,
    wait: true,
  });

  notifier.on('click', () => {
    clearInterval(interval); 

    setTimeout(() => {
      interval = setInterval(checkConnection, PING_INTERVAL)
    }, DELAY);
  })
}


const checkConnection = _ =>
  ping.sys.probe(DEFAULT_HOST, isAlive => { 
    isAlive || offlineBeep() 
  })

pid.write(handlePidProcess(_ => {
  interval = setInterval(checkConnection, PING_INTERVAL)

  process.on('SIGTERM', _ => {
    clearInterval(interval)
    pid.delete(err => {
      if (err) console.error('Something wrong happened while deleting pid file')
      console.log('Pinging stopped')
    })
  })
}))
