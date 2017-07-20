#!/usr/bin/env node

'use strict';

const _ = require('lodash');
const { RtmClient, RTM_EVENTS, CLIENT_EVENTS, MemoryDataStore } = require('@slack/client');

// BOT INITIALIZATION
const bot_token = process.env.SLACK_TOKEN || '';

const bot = new RtmClient(bot_token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});

bot.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  const channelName = bot.dataStore.getChannelById(message.channel).name;

  if (message.type === 'message') {
    handleMessage(message);
  }
});

bot.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
  const user = bot.dataStore.getUserById(bot.activeUserId);
  const team = bot.dataStore.getTeamById(bot.activeTeamId);
  console.log('Connected to ' + team.name + ' as ' + user.name);
});

bot.start();

// WORD LADDER HANDLING

/* channel -> { word, user } */
const entries = {};

const pattern = /^\*(\w{3,5})\*/;

function isValid(lastWord, newWord) {
  if (lastWord.length === newWord.length) {
    let diffs = 0;
    let len = lastWord.length;
    let i = 0;

    while (i < len && diffs <= 1) {
      if (lastWord[i] !== newWord[i]) {
        diffs++;
      }
      i++;
    }

    return diffs === 1;
  }

  // TODO handle different lengths
  return false;
}

function handleMessage(message) {
  const { text, channel, user } = message;

  const match = text.match(pattern);
  
  if (!match) { return; }

  const word = _.upperCase(match[1]);
  
  const channelEntries = entries[channel];

  if (_.isUndefined(channelEntries)) {
    entries[channel] = [{
      word,
      user,
    }];
    return;
  }

  const channelWords = _.map(channelEntries, 'word');

  if (_.includes(channelWords, word)) {
    respondRepeat(channel, word);
    return;
  }

  const lastWord = _.last(channelWords);

  if (!isValid(lastWord, word)) {
    respondInvalid(channel, word, lastWord);
    return;
  }

  channelEntries.push({
    word,
    user,
  });
}

function respondRepeat(channel, repeatWord) {
  const message = `:no_good: *${repeatWord}* has been played before.`;
  bot.sendMessage(message, channel);
}

function respondInvalid(channel, invalidWord, lastWord) {
  const message = `*${lastWord}* → *${invalidWord}* = :no_good:`;
  bot.sendMessage(message, channel);
}
