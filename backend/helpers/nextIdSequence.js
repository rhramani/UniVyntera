const Counter = require("../model/counter"); 
const visitorCounter = require("../model/visitorCounter");
const leadCounter = require("../model/leadCounter");

const getNextSequence = async (name, prefix, padding = 5) => {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `${prefix}${counter.seq.toString().padStart(padding, '0')}`;
};


const getVisitorNextSequence = async (name, prefix, padding = 5) => {
  const visitorcounter = await visitorCounter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true}
  );

  return `${prefix}${visitorcounter.seq.toString().padStart(padding, '0')}`;
}

const getLeadNextSequence = async (name, prefix, padding = 5) => {
  const visitorcounter = await leadCounter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true}
  );

  return `${prefix}${visitorcounter.seq.toString().padStart(padding, '0')}`;
}

module.exports = { getNextSequence , getVisitorNextSequence , getLeadNextSequence};
