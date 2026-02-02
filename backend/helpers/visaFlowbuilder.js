const mongoose = require("mongoose");

const usaVisaSchema = require("../model/masters/studentApplication/visa/usaFlow");
const ukVisaSchema = require("../model/masters/studentApplication/visa/ukflow");
const canadaVisaSchema = require("../model/masters/studentApplication/visa/canadaFlow");
const australiaVisaSchema = require("../model/masters/studentApplication/visa/ausFlow");
const germanyVisaSchema = require("../model/masters/studentApplication/visa/germanyFlow");
const franceVisaSchema = require("../model/masters/studentApplication/visa/franceFlow");
const baseVisaSchema = require("../model/masters/studentApplication/visa/universalFlow");

const buildVisaApplication = (country, userId, userName) => {
  const lcCountry = (country || "").toLowerCase();

  const createVisaFlow = (schemaObj) => ({
    _id: new mongoose.Types.ObjectId(),
    ...Object.fromEntries(Object.keys(schemaObj).map((key) => [key, null])),
    created_by: userId,
    createdByName: userName,
  });

  if (lcCountry === "united states") {
    return createVisaFlow(usaVisaSchema.obj);
  }

  if (lcCountry === "canada") {
    return createVisaFlow(canadaVisaSchema.obj);
  }

  if (lcCountry === "united kingdom") {
    return createVisaFlow(ukVisaSchema.obj);
  }

  if (lcCountry === "australia") {
    return createVisaFlow(australiaVisaSchema.obj);
  }

  if (lcCountry === "germany") {
    return createVisaFlow(germanyVisaSchema.obj);
  }

  if (lcCountry === "france") {
    return createVisaFlow(franceVisaSchema.obj);
  }

  // Default to base schema
  return createVisaFlow(baseVisaSchema.obj);
};

module.exports = { buildVisaApplication };
