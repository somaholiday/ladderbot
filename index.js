#!/usr/bin/env node

'use strict';

const _ = require('lodash');
const { RtmClient, RTM_EVENTS, CLIENT_EVENTS, MemoryDataStore } = require('@slack/client');

const bot_token = process.env.SLACK_TOKEN || '';

const bot = new RtmClient(bot_token, {
  logLevel: 'error',
  dataStore: new MemoryDataStore()
});

bot.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
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

const entries = [];

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

  console.log({ message })
  
  if (!match) { return; }

  const word = _.upperCase(match[1]);
  
  if (_.isEmpty(entries)) {
    entries.push({
      word,
      user,
    });
    return;
  }

  const lastWord = _.last(entries).word;

  if (!isValid(lastWord, word)) {
    respondInvalid(channel, word, lastWord);
    return;
  }

  entries.push({
    word,
    user,
  });
}

function respondInvalid(channel, invalidWord, lastWord) {
  const message = `:no_good: ${invalidWord} does not follow ${lastWord}`;
  bot.sendMessage(message, channel);
}
