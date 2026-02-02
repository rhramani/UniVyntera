
import * as Yup from "yup";



export const formatDate = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  if (dateStr.includes("-")) {
    return new Date(dateStr);
  }
  return null;
};

// Helper to get yyyy-mm-dd for API/backend
export const toISODate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


// validation

export const validationSchema = Yup.object({
  inquiry_for: Yup.string().nullable().required("Inquiry For is required"),
  name: Yup.string().required("Name is required"),
  intake: Yup.string(),
  email: Yup.string(),
  phone: Yup.string().required("Phone number is required"),
  alternate_contact: Yup.string(),
  gender: Yup.string(),
  dateofbirth: Yup.date(),
  age: Yup.number(),
  address: Yup.string(),
  comments: Yup.string(),
  office_use_only: Yup.string(),
  remarks: Yup.string(),
  lead_status: Yup.string().default("New"),
  lead_sub_status: Yup.string(),
  lead_form: Yup.string(),
  lead_assign: Yup.mixed().nullable(), // Can be string or array
  lead_role: Yup.string().nullable(),
  lead_assign_Branch: Yup.string().nullable(),
  country_interested: Yup.array().of(Yup.string()),
  course: Yup.string(),
  level: Yup.string(),
  budget: Yup.string(),
  how_much_in_bank: Yup.string(),
  english_proficiency: Yup.string(),
  passport: Yup.string(),
  family_work: Yup.array().of(
    Yup.object({
      occupation_father: Yup.string(),
      occupation: Yup.string(),
      work_experience: Yup.string().nullable(),
      work_post: Yup.string().nullable(),
      work_year: Yup.number().nullable(),
    })
  ),
  visa_info: Yup.array().of(
    Yup.object({
      visitaed_countries: Yup.string(),
      visit_count: Yup.number(),
      visa_type: Yup.string(),
      visa_refused: Yup.string(),
      refused_country: Yup.string(),
      refused_times: Yup.number(),
      refused_years: Yup.array().of(Yup.number()),
      refused_visa_type: Yup.string(),
    })
  ),
  // occupation_father: Yup.string(),
  // occupation_mother: Yup.string(),
  // work_experience: Yup.string(),
  // work_post: Yup.string(),
  // work_year: Yup.number(),
  // visited_countries: Yup.string(),
  // visit_count: Yup.number(),
  // visa_type: Yup.string(),
  // visa_refused: Yup.string(),
  form_type: Yup.string(),
  // refused_country: Yup.string(),
  // refused_times: Yup.number(),
  // refused_years: Yup.array().of(Yup.number()),
  // refused_visa_type: Yup.string(),
  next_follow_up: Yup.date(),
  from: Yup.string(),
  to: Yup.string(),
  nationality: Yup.string(),
  pincode: Yup.string(),
  follow_up_type: Yup.string().nullable().notRequired(),
  lead_followup_remark: Yup.string(),
  lead_text_remark: Yup.string(),
  source_of_reference: Yup.string(),
  city: Yup.string().required("City is required"),
  country: Yup.string(),

  refer_friend: Yup.object({
    name: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email("Invalid email format"),
    suggested_countries: Yup.string(),
    courses: Yup.string(),
    response: Yup.string(),
  }),

  reviews: Yup.object({
    reception_greetings: Yup.string(),
    counsellor_explanation: Yup.string(),
    hospitality: Yup.string(),
    hygiene_cleanliness: Yup.string(),
    team_response: Yup.string(),
  }),

  education_evaluation: Yup.array().of(
    Yup.object({
      test_name: Yup.string(),
      scores: Yup.object({
        listen: Yup.number(),
        read: Yup.number(),
        write: Yup.number(),
        speak: Yup.number(),
        overall: Yup.number(),
        duolingoScore: Yup.number(),
      }),
    })
  ),

  education_details: Yup.array().of(
    Yup.object({
      degree: Yup.string(),
      stream: Yup.string(),
      moi: Yup.string(),
      year: Yup.number(),
      score: Yup.string(),
      institution: Yup.string(),
      backlogs: Yup.number(),
    })
  ),
});