const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

const patterns = {
  word: /^\*([A-Za-z]{3,5})\*/,
  date: /^----- (\w*) (\w*) -----$/,
  time: /^(.*) \[(.*)\]$/
}

const user_map = {
  'Alex Fish': {
    user_name: 'alexf',
    user_id: 'U5H9W9WB0'
  },
  'Alex Lew': {
    user_name: 'alew',
    user_id: 'U21GVT7HB'
  },
  'Arjun Baokar': {
    user_name: 'arjun',
    user_id: 'U1X5009CH'
  },
  'Bryan Lee': {
    user_name: 'bryanl',
    user_id: 'U5H9WKAPQ'
  },
  'Charlotte Willens': {
    user_name: 'charlotte',
    user_id: 'U45GAP5AS'
  },
  'Forest Trimble': {
    user_name: 'forest',
    user_id: 'U263MEQTH'
  },
  'James Troup': {
    user_name: 'jamest',
    user_id: 'U5066LZGS'
  },
  'Jason Ng': {
    user_name: 'jng',
    user_id: 'U5GJF4KEH'
  },
  'Jeremy Lai': {
    user_name: 'jeremy',
    user_id: 'U1UUZB82V'
  },
  'Laney Erokan': {
    user_name: 'laney',
    user_id: 'U4PK0QSD6'
  },
  'Nathan Alison': {
    user_name: 'nfa',
    user_id: 'U1P0YT8H5'
  },
  'Danh Trang': {
    user_name: 'danh',
    user_id: 'U0BFCK27L'
  },
  'Eugene Marinelli': {
    user_name: 'eugene',
    user_id: 'U024JK9C9'
  },
  'Gabriel Szczepanek': {
    user_name: 'gabe',
    user_id: 'U66HB9336'
  },
  'Michael Millerick': {
    user_name: 'mmillerick',
    user_id: 'U4HNA59FX'
  },
  'Rohan Varma': {
    user_name: 'rohan',
    user_id: 'U5VBH8324'
  },
  'Ryan Huttman': {
    user_name: 'ryanh',
    user_id: 'U4QA86P34'
  },
  'Yubo Su': {
    user_name: 'yubo',
    user_id: 'U1P11BRE3'
  }
}

const filename = 'word_ladders.slack';
const output = 'word_ladders.json';

const lines = fs.readFileSync(filename, 'utf-8').split('\n');

// console.log(lines);

let year, month, day, hour, minute, ampm;
let date;
let user_name;
let user_id;

// CHANGE THESE TO MATCH BLEND
const team_id = 'T060Z1Q6T';
const channel_id = 'C6B5NJK18';

const entries = [];

_.each(lines, line => {
  line = _.trim(line);

  let match;
  if (match = line.match(patterns.date)) {
    month = match[1];
    day = match[2];
    year = "2017";
    // console.log(`${month} ${day} ${year}`);
  }

  if (match = line.match(patterns.time)) {
    user_full_name = _.trim(match[1]);
    const user = user_map[user_full_name];
    user_name = user.user_name;
    user_id = user.user_id;

    const timeString = match[2];

    const dateString = `${year} ${month} ${day} ${timeString}`;
    date = moment(dateString, 'YYYY MMMM Do h:mm A')

    // console.log(dateString, date);
    // console.log(userName, timeString);
  }

  if (match = line.match(patterns.word)) {
    const word = match[1];
    // console.log(word, line);
    entries.push({
      team_id,
      channel_id,
      word,
      user_name,
      user_id,
      text: line,
      timestamp: date.valueOf(),
    });
  }
});

// console.log(entries);

fs.writeFile(output, JSON.stringify(entries, null, 2), 'utf8', function(err) {
  if (err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
