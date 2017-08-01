const _ = require('lodash');
const checker = require('./word_ladder_checker');

const test_cases = [
  ['SILT', 'SALT', true],
  ['ROOM', 'BOOM', true],

  ['SLIDE', 'GLIDE', true],

  ['WORD', 'RODE', false],

  ['ROOM', 'BROOM', true],
  ['BAND', 'BRAND', true],
  ['HAND', 'HANDY', true],

  ['BROOM', 'ROOM', true],
  ['BRAND', 'BRAD', true],
  ['HANDY', 'HAND', true],

  ['SPON', 'SPOON', true],
  ['HOOFS', 'HOOF', true],

  ['BAD', 'BRAND', false],
  ['FORTH', 'FOR', false],
];

_.each(test_cases, test_case => {
  const [start, end, expected] = test_case;
  it(`${start} → ${end} = ${expected ? '✓' : '✕'}`, () => {
    expect(checker.isValid(start, end)).toBe(expected);
  });
});
