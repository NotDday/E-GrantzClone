const User = require('./User');
const Student = require('./Student');
const District = require('./District');
const Institution = require('./Institution');
const Course = require('./Course');
const Scheme = require('./Scheme');
const { Counter, getNextApplicationNumber, getNextStudentRegisterNumber } = require('./Counter');
const Application = require('./Application');
const Notice = require('./Notice');
const Contact = require('./Contact');

const models = {
  User,
  Student,
  District,
  Institution,
  Course,
  Scheme,
  Counter,
  Application,
  Notice,
  Contact
};

async function syncAllIndexes() {
  for (const [name, model] of Object.entries(models)) {
    if (model && typeof model.syncIndexes === 'function') {
      try {
        await model.syncIndexes();
      } catch (err) {
        console.warn(`Warning: syncIndexes for ${name} encountered: ${err.message}`);
      }
    }
  }
}

module.exports = {
  ...models,
  models,
  syncAllIndexes,
  getNextApplicationNumber,
  getNextStudentRegisterNumber
};
