#!/usr/bin/env node

'use strict'

const program = require('commander')
const { version } = require('./package.json')

program
  .version(version)
  .arguments('<command>', 'Turn Offline alert on/off')
  .action(command => {
    
  })
  .parse(process.argv)
