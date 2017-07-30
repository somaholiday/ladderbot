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

  if (Math.abs(lastWord.length - newWord.length) === 1) {
    // TODO: this is broken. Check if longerWord - diffLetter === shorterWord
    const diff = _.xor(lastWord.split(''), newWord.split(''));
    return diff.length === 1;
  }

  return false;
}

module.exports = {
  wordMatch,
  isValid,
};
