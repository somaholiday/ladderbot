const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

const patterns = {
  word: /^\*([A-Za-z]{3,5})\*/,
  date: /^----- (\w*) (\w*) -----$/,
  time: /^(.*) \[(.*)\]$/
}

const user_map = {
  'James Troup': 'jamest',
  'Nathan Alison': 'nfa',
  'Arjun Baokar': 'arjun',
  'Jason Ng': 'jng',
  'Michael Millerick': 'mmillerick',
  'Laney Erokan': 'laney',
  'Yubo Su': 'yubo',
  'Alex Fish': 'alexf',
  'Gabriel Szczepanek': 'gabe',
  'Charlotte Willens': 'charlotte',
  'Danh Trang': 'danh',
  'Rohan Varma': 'rohan',
  'Bryan Lee': 'bryanl',
  'Jeremy Lai': 'jeremy',
  'Ryan Huttman': 'ryanh',
  'Forest Trimble': 'forest',
  'Alex Lew': 'alew',
  'Eugene Marinelli': 'eugene',
};

const filename = 'word_ladder_log';
const output = 'word_ladders.json';

const lines = fs.readFileSync(filename, 'utf-8').split('\n');

// console.log(lines);

let year, month, day, hour, minute, ampm;
let date;
let user_name;

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
    user_name = user_map[_.trim(match[1])];
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
      text: line,
      timestamp: date.valueOf(),
    });
  }
});

// console.log(entries);

fs.writeFile(output, JSON.stringify(entries, null, 2), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
