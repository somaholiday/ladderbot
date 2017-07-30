#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const { MessageBot } = require('./rtm_bot');
const checker = require('./word_ladder_checker');
const responses = require('./responses');

let words;

const token = process.env.SLACK_TOKEN;
if (_.isUndefined(token)) {
  throw new Error('Please provide a SLACK_TOKEN environment variable');
}

const ladderBot = new MessageBot(token, handleMessage);

/**
 * Called every time MessageBot receives a message.
 *
 * Sample message payload:
 * {
 *  type: 'message',
 *  channel: 'C6B5NJK18',
 *  user: 'U0A6KPH6J',
 *  text: 'Hi',
 *  ts: '1501378526.633613',
 *  source_team: 'T060Z1Q6T',
 *  team: 'T060Z1Q6T'
 * }
 *
 * @param message
 */
function handleMessage(message) {
  const { text, channel } = message;

  /* Check if the message is a word entry */
  const word = checker.wordMatch(text);

  if (!word) {
    return;
  }

  // const words = db.getWords(channel);

  /* Is this the first word of the game? */
  if (!words) {
    // TODO: Do game initialization for this channel + game
    newGame(word, channel);
    return;
  }

  /* Has this word been used before? */
  if (_.includes(words, word)) {
    handleRepeat(word, channel);
    return;
  }

  /* Is this word a valid follow-up to the last word? */
  const lastWord = _.last(words);

  if (!checker.isValid(lastWord, word)) {
    handleInvalid(lastWord, word, channel);
    return;
  }

  /* Word was valid. Update the list. */
  words.push(word);
}

function newGame(word, channel) {
  words = [word];
  ladderBot.say(responses.firstWord(word), channel);
}

function handleRepeat(word, channel) {
  ladderBot.say(responses.repeat(word), channel);
}

function handleInvalid(lastWord, word, channel) {
  ladderBot.say(responses.invalid(lastWord, word), channel);
}
