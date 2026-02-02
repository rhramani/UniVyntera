const baseResolver = (v) => {

  if (!v) return null;

  // if (v.visaOutcomeStatus) {
  //   return "Visa Decision Updated also upload visa decision proof";
  // }
  if (v.visaOutcomeStatus) {
    return `Visa Decision Updated: ${v.visaOutcomeStatus}`;
  }

  if (
    v.visaFileSubmission?.finalChecklistConfirmed &&
    v.visaFileSubmission?.fileSubmission?.isSubmitted &&
    v.visaFileSubmission?.submissionDateRecorded
  ) {
    return "Visa Filed";
  }

  if (v.VFSAppointmentDateTime) {
    return "VFS Date Booked";
  }

  if (v.biometricsUploaded) {
    return "Biometrics Completed";
  }

  if (v.feeStatus === "Paid") {
    return "Visa Fee Paid";
  }

  return v.status || null;
};

const ukResolver = (v) => {
  if (!v) return null;

  // if (v.visaDecision?.decision) {
  //   return "Visa Decision Updated also upload visa decision proof";
  // }
  if (v.visaDecision?.decision) {
    return `Visa Decision Updated: ${v.visaDecision?.decision}`;
  }

  if (v.biometricCompletion?.completed) {
    return "Biometrics Completed";
  }

  if (v.biometricAppointment?.booked) {
    return "VFS Date Booked";
  }
  if (v.tbTestDetails?.required || v.tbTestDetails?.testDate) {
    return "TB Test Updated";
  }
  if (v.tuitionAndFunds?.depositPaid) {
    return "Tution Fee Deposit Paid";
  }

  if (v.visaApplicationForm?.started) {
    return "Visa Filed";
  }
  if (v.cas?.issued) {
    return "CAS Issued";
  }
  if (v.cas?.applied) {
    return "CAS Applied";
  }
  if(v.fees) {
    return "Visa Fee Payment Updated";
  }

  return null;
};

const usaResolver = (v) => {
  // if (v.decision?.decision) {
  //   return "Visa Decision Updated also upload visa decision proof";
  // }

  if (v.decision?.decision) {
    return `Visa Decision Updated: ${v.decision?.decision}`;
  }

  if (v.appointmentBooking?.confirmed) {
    return "VFS Date Booked";
  }

  if (v.ds160Confirmation?.confirmed) {
    return "Visa Filed";
  }

  if (v.ds160Registration?.started) {
    return "DS-160 Started";
  }

  if (v.i20Received?.received) {
    return "I-20 Received";
  }

  if (v.i20Application?.applied) {
    return "I-20 Applied";
  }

  if (v.sevisPayment) {
    return "Sevis Payment Updated";
  }
  if (v.visaFeePayment?.paymentDate) {
    return "Visa Fees Paid";
  }

  if (v.appointmentBooking?.vac) {
    return "Vac Updated";
  }

  if (v.appointmentBooking?.interview) {
    return "Interview Details Updated";
  }

  if(v.fundsShow){
    return "Funds Show Details Updated";
  }
  return null;
};

const canadaResolver = (v) => {
  if (!v) return null;

  // if (v.visaDecision?.decision) {
  //   return "Visa Decision Updated also upload visa decision proof";
  // }

  if (v.visaDecision?.decision) {
    return `Visa Decision Updated: ${v.visaDecision?.decision}`;
  }

  if (v.biometricRequest?.applicationDate) {
    return "Biometrics Updated";
  }

  if (v.submissionConfirmation?.documents?.length) {
    return "Visa Filed";
  }
  if (v.applicationFormLock?.locked) {
    return "Application Locked";
  }
  if (v.conditionalOfferLetter?.received) {
    return "Offer Letter Received";
  }
  if (v.medicalProcess?.dateTime) {
    return "Medical Process Updated";
  } 
  if(v.tutuionFeePayment) {
    return "Tution Fee Payment Updated";
  }

  if (v.conditionalOfferLetter?.received) {
    return "Conditional Offer Letter Received";
  }
  if (v.gicDetails?.bankName) {
    return "GIC Details Updated";
  }
  if (v.gckeyAccount?.accountOpenDate) {
    return "GC Key Account details Updated";
  }
  if (v.applicationFormLock?.locked) {
    return "Application Form Loced";
  }
  if (v.visaFeePayment?.paymentDateTime) {
    return "Visa Fees Paid";
  }
  if(v.bvlAndPpr){
    return "BVL & PPR Updated";
  }
  if(v.poeLetter) {
    return "POE Letter Updated";
  }
  if(v.permits) {
    return "Permit Details Updated";
  }


  return null;
};

const australiaResolver = (v) => {
  if (!v) return null;

  // if (v.visaOutCome?.decision) {
  //   return "Visa Decision Updated also upload visa decision proof";
  // }
  if (v.visaOutcome?.decision) {
    return `Visa Decision Updated: ${v.visaOutcome?.decision}`;
  }
  if (v.biometrics?.appointmentDateTime) {
    return "Biometrics Completed";
  }
  if (v.medicalExamination?.hospitalName) {
    return "Medical Examination Updated";
  }
  if (v.tuitionFeePayment?.paymentDate) {
    return "Tuition Fee Payment";
  }
  if (v.visaApplication?.submitted) {
    return "Visa Filed";
  }
  if (v.coe?.received) {
    return "COE Received";
  }
  if (v.offerLetter?.received) {
    return "Offer Letter Received"; 
  }
  if(v.oshc){
    return "OSHC Updated";
  }
  if(v.immiAccount) {
    return "immiAccount Details Updated";
  }
  if(v.visaFeePayment) {
    return "visa Fee Payment Updated";
  }
  if(v.travelPreparation){
    return "Travel Preparation Updated";
  }

  return null;
};

const franceResolver = (v) => {
  if (!v) return null;

  if (v.admissionLetter?.received) {
    return "Admission Letter Received";
  }

  // if (v.visaDecision?.status) {
  //   return "Visa Decision Updated also upload visa decision proof";
  // }

  if (v.visaDecision?.status) {
    return `Visa Decision Updated: ${v.visaDecision?.status}`;
  }

  if (v.biometricsSubmission?.dateTime) {
    return "Biometrics Completed";
  }

  if (v.appointmentBooking?.confirmed) {
    return "VFS Date Booked";
  }

  if (v.franceVisasForm?.submissionDate) {
    return "Visa Filed";
  }

  if (v.visaFeePayment?.paymentDate) {
    return "Visa Fee Paid";
  }

  if(v.proofOfFunds) {
    return "proof Of Funds Updated";
  }

  if(v.medicalInsurance) {
    return "Medical Insurance Updated";
  }

  if(v.postArrivalFormalities) {
    return "Post Arrival Formalities Updated"
  }

  if (v.campusFranceRegistration?.submissionDate) {
    return "Campus France Registration Completed";
  }

  if (v.tuitionFeePayment?.paymentDate) {
    return "Tuition Fee Payment Updated";
  }

  if (v.admissionLetter?.received) {
    return "Admission Letter Received";
  }

  if (v.campusFranceRegistration?.accountCreated) {
    return "campus France Registration Updated";
  }

  if (v.medicalInsurance?.providerName) {
    return "Medical Insurance Updated";
  }

  return null;
};

const germanyResolver = (v) => {
  if (!v) return null;

  // 1️⃣ Final decision
  // if (v.visaDecision?.status) {
  //   return "Visa Decision Updated also upload visa decision proof";
  // }

  if (v.visaDecision?.status) {
    return `Visa Decision Updated: ${v.visaDecision?.status}`;
  }

  // 2️⃣ Biometrics / Interview completed
  if (v.biometricsInterview?.interviewDateTime) {
    return "Biometrics Completed";
  }

  // 3️⃣ Visa application form completed (checked before appointment to prioritize completed forms)`
  if (v.visaApplicationForm?.completed) {
    return "Visa Filed";
  }

  // 4️⃣ Appointment booked
  if (v.appointmentBooking?.appointmentDateTime) {
    return "VFS Date Booked";
  }

  // 5️⃣ Visa fee paid
  if (v.visaFeePayment?.paymentDate) {
    return "Visa Fee Paid";
  }

  if (v.healthInsurance?.policyNumber) {
    return "Health Insurance Completed";
  }

  // 7️⃣ Blocked account opened
  if (v.blockedAccount?.accountOpeningDate) {
    return "Blocked Account Opened";
  }

  if (v.admissionLetter?.received) {
    return "Admission Letter Received";
  }

  if (v.blockedAccount?.bankName) {
    return "Blocked Account Details Updated";
  }

  if(v.travelResidencePermit){
    return "Travel Residence Permit Updated";
  }

  return null;
};

const normalizeCountryName = {
  "United Kingdom": "UK",
  UK: "UK",

  "United States": "USA",
  USA: "USA",

  Canada: "CANADA",
  CANADA: "CANADA",

  Australia: "AUSTRALIA",
  AUSTRALIA: "AUSTRALIA",

  France: "FRANCE",
  FRANCE: "FRANCE",

  Germany: "GERMANY",
  GERMANY: "GERMANY",

  BASE: "BASE",
};

const resolvers = {
  BASE: baseResolver,
  UK: ukResolver,
  USA: usaResolver,
  CANADA: canadaResolver,
  AUSTRALIA: australiaResolver,
  FRANCE: franceResolver,
  GERMANY: germanyResolver,
};

module.exports.resolveVisaStatus = (country, visaData) => {
  const normalizedCountry = normalizeCountryName[country] || "BASE";
  const resolver = resolvers[normalizedCountry] || baseResolver;
  return resolver(visaData);
};

module.exports.getVisaDecision = (country, v) => {
  if (!v) return null;

  const normalizedCountry = normalizeCountryName[country] || "BASE";

  switch (normalizedCountry) {
    case "UK":
    case "CANADA":
      return v.visaDecision?.decision || null;

    case "USA":
      return v.decision?.decision || null;

    case "FRANCE":
    case "GERMANY":
      return v.visaDecision?.status || null;

    case "AUSTRALIA":
      return v.visaOutCome?.decision || null;

    case "BASE":
    default:
      return v.visaOutcomeStatus || null;
  }
};
