#!/usr/bin/env node

'use strict'

var Mopidy = require('mopidy')
var Twitter = require('twitter')
var userHome = require('user-home')
var fs = require('fs')
var path = require('path')

var configDir = path.join(userHome, '.config', 'mopidy-twitter')
var optionsFile = path.resolve(configDir, 'options.json')
var config = {
  mopidy: require(path.resolve(configDir, 'mopidy.json')),
  twitter: require(path.resolve(configDir, 'twitter.json')),
  options: fs.existsSync(optionsFile) ? require(optionsFile) : {}
}

var client = new Twitter(config.twitter)
var currentTrack = null
var tweetTimeout = null

var artistsToString = function (artists) {
  var artistNames = artists.map(function (artist) { return artist.name })
  var len = artistNames.length
  return (len === 0) ? 'Unknown Artist'
    : (len === 1) ? artistNames[0]
    : artistNames.slice(0, len - 1).join(', ') + ' & ' + artistNames[len - 1]
}

var trackToString = function (track) {
  var artists = (track.artists && track.artists.length)
    ? artistsToString(track.artists) + ' - '
    : ''
  return artists + track.name
}

var truncate = function (str, max) {
  return (str.length <= max) ? str : str.substr(0, max - 1) + '…'
}

var tweet = function () {
  var status = '♫ Now Playing: ' + currentTrack
  console.info('Posting tweet:', status)
  client.post('statuses/update', {status: truncate(status, 140)}, function (err) {
    if (err) {
      console.error('Error posting tweet:', err)
    } else {
      console.info('Tweet successfully posted')
    }
  })
}

var acceptTrack = function (track) {
  var trackStr = track ? trackToString(track) : null
  console.info('Track:', (currentTrack !== null) ? currentTrack : '(none)')
  if (trackStr !== currentTrack) {
    currentTrack = trackStr
    if (tweetTimeout) {
      clearTimeout(tweetTimeout)
      tweetTimeout = null
    }
    if (currentTrack !== null) {
      var delay = (typeof config.options.delay === 'number')
        ? config.options.delay
        : 5000
      tweetTimeout = setTimeout(tweet, delay)
    }
  }
}

var host = config.mopidy.hostname + ':' + (config.mopidy.port || 6680)
var mopidy = new Mopidy({
  webSocketUrl: 'ws://' + host + '/mopidy/ws',
  callingConvention: 'by-position-or-by-name'
})

mopidy.on('state:online', function () {
  mopidy.playback.getCurrentTrack()
    .then(acceptTrack)
    .catch(console.error)

  mopidy.on('event:trackPlaybackStarted', function (data) {
    acceptTrack(data.track || data[Object.keys(data)[0]].track)
  })
})
