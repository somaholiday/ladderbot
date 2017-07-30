'use strict';

const AWS = require('aws-sdk');
const qs = require('querystring');
const _ = require('lodash');
const checker = require('./word-ladder-checker');
const responses = require('./responses');

const kmsEncryptedToken = process.env.kmsEncryptedToken;
let token;
let docClient;

function checkRequestToken(requestToken) {
  if (requestToken !== token) {
    console.error(`Request token (${requestToken}) does not match expected`);
    return callback('Invalid request token');
  }
}

/*

Sample payload:

token=_SLACK_TOKEN_
team_id=T0001
team_domain=team_name
channel_id=C2147483705
channel_name=word_ladders
timestamp=1355517523.000005
user_id=U2147483697
user_name=Steve
text=googlebot: What is the air-speed velocity of an unladen swallow?
trigger_word=googlebot:

*/

function processEvent(event, callback) {
  const params = qs.parse(event.body);

  // Validate that it's really our slackbot
  checkRequestToken(params.token);

  const { team_id, team_domain, channel_id, channel_name, user_id, user_name, timestamp, text } = params;

  // If the message was from the bot, don't infinitely loop.
  if (user_name === 'slackbot') {
    callback(null);
  }

  // Check if the message is a word entry
  const word = checker.wordMatch(text);

  if (!word) {
    callback(null, 'No word pattern.');
  }

  // Get words for this channel + game
  // db.getWords
  const words = ['ROOM', 'BOOM'];

  // If there's no words, this is the first of the game.
  if (!words) {
    // Do game initialization for this channel + game
    // db.putWord
    callback(null, checker.responses.firstWord(word));
  }

  if (_.includes(words, word)) {
    callback(null, checker.responses.repeat(word));
  }

  const lastWord = _.last(words);

  if (checker.isValid(lastWord, word)) {
    // db.putWord
  }

  callback(null, `${user_name} added ${word} (but not really yet.)`);
}

exports.handler = (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message || err : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    });

  if (token) {
    // Container reuse, simply process the event with the key in memory
    processEvent(event, done);
  } else if (kmsEncryptedToken && kmsEncryptedToken !== '<kmsEncryptedToken>') {
    const cipherText = {
      CiphertextBlob: new Buffer(kmsEncryptedToken, 'base64'),
    };

    const kms = new AWS.KMS();
    kms.decrypt(cipherText, (err, data) => {
      if (err) {
        console.log('Decrypt error:', err);
        return done(err);
      }
      token = data.Plaintext.toString('ascii');

      docClient = new AWS.DynamoDB.DocumentClient();

      processEvent(event, done);
    });
  } else {
    done('Token has not been set.');
  }
};
