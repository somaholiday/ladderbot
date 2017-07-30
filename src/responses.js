const responses = {
  firstWord: firstWord => `:ok_hand: The first word is *${firstWord}*.`,
  repeat: repeatedWord => `:no_good: *${repeatedWord}* has been played before.`,
  invalid: (lastWord, invalidWord) => `:no_good: *${lastWord}* ⇏ *${invalidWord}*`
}

module.exports = responses;
