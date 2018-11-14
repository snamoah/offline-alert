#!/usr/bin/env node

'use strict'

const ping = require('ping')
const beep = require('beepbeep')

const DEFAULT_HOST = 'google.com'

const last = 200
const baseline = [ 200, 200, 200 ]
const interlude = [ 50, 50, 50, 50 ]

const offlineBeep = _ =>
  beep([...baseline, ...interlude, last])

ping.sys.probe(DEFAULT_HOST, isAlive => { 
  isAlive || offlineBeep() 
})
