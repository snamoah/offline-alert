#!/usr/bin/env node

'use strict'

const program = require('commander')
const { spawn } = require('child_process')
const { version } = require('./package.json')
const { getPidFilePath, handlePidProcess } = require('./utils')
const pid = require('daemon-pid')(getPidFilePath())

program
  .version(version)
  .arguments('<command>', 'Turn Offline alert on/off (on|off)')
  .action(command => {
    switch(command.toLowerCase()) {
      case 'on':
        pid.running(handlePidProcess(running => {

          if (running) {
            console.log('Offline Alert already running')
            process.exit(-1)
          }

          const child = spawn('node', [`${__dirname}/ping.js`], {
            detached: true,
            stdio: 'inherit'
          })
          
          console.log('Offline Alert started');

          child.unref()
        }))
        break

      case 'off':
        pid.running(handlePidProcess(running => {
          if(!running) {
            console.log('Offline Alert not running')
            process.exit(-1)
          }

          pid.kill('SIGTERM', error => {
            if (error)
              console.error('Failed to kill offline alert process')
          })
        }))
        break
     default:
        console.error('Usage: offlinealert (on|off)')
    }
  })
  .parse(process.argv)
