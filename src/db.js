const Datastore = require('nedb');

const DATABASE_FILE = 'words.db';

// const db = new Datastore({ filename: DATABASE_FILE });
const db = new Datastore();

module.exports = {
  db,
};
