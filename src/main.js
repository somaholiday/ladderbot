#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const { MessageBot } = require('./rtm_bot');
const checker = require('./word_ladder_checker');
const responses = require('./responses');
const { db } = require('./db');

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
  const { text, channel, user, ts } = message;

  /* Check if the message is a word entry */
  const word = checker.wordMatch(text);

  if (!word) {
    return;
  }

  // THIS IS A HENIOUS MESS, BUT I WANTED TO SEE IT WORK
  db.find({ channel: channel }).sort({ timestamp: 1 }).exec((err, docs) => {
    const words = _.map(docs, 'word');

    /* Is this the first word of the game? */
    if (_.isEmpty(words)) {
      // TODO: Do game initialization for this channel + game
      const record = {
        channel,
        user, // TODO: look up and save user name
        word,
        text,
        timestamp: ts,
      };

      db.insert(record, function(err, doc) {
        console.log('Inserted', doc.word, 'with ID', doc._id);
      });
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
    const record = {
      channel,
      user, // TODO: look up and save user name
      word,
      text,
      timestamp: ts,
    };

    db.insert(record, function(err, doc) {
      console.log('Inserted', doc.word, 'with ID', doc._id);
    });
  });
}

function newGame(word, channel) {
  ladderBot.say(responses.firstWord(word), channel);
}

function handleRepeat(word, channel) {
  ladderBot.say(responses.repeat(word), channel);
}

function handleInvalid(lastWord, word, channel) {
  ladderBot.say(responses.invalid(lastWord, word), channel);
}
