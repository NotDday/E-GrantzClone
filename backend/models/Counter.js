const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
}, {
  collection: 'counters'
});

const Counter = mongoose.model('Counter', counterSchema, 'counters');

async function getNextApplicationNumber(year = new Date().getFullYear()) {
  const counterId = `application_${year}`;
  const counter = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const padded = String(counter.seq).padStart(6, '0');
  return `EG-${year}-${padded}`;
}

async function getNextStudentRegisterNumber() {
  const counterId = 'student_register_number';
  const counter = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const padded = String(counter.seq).padStart(6, '0');
  return `STU${padded}`;
}

module.exports = {
  Counter,
  getNextApplicationNumber,
  getNextStudentRegisterNumber
};
