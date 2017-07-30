const _ = require('lodash');

const wordPattern = /^\*([A-Za-z]{3,6})\*/;

function wordMatch(text) {
  const match = text.match(wordPattern);

  if (!match) {
    return null;
  }

  return _.upperCase(match[1]);
}

function isValid(lastWord, newWord) {
  const diff = _.xor(lastWord.split(''), newWord.split(''));

  if (lastWord.length === newWord.length) {
    return diff.length === 2;
  }

  if (Math.abs(lastWord.length - newWord.length) === 1) {
    return diff.length === 1;
  }

  return false;
}

module.exports = {
  wordMatch,
  isValid,
};
