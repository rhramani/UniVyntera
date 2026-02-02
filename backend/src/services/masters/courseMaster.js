const ExcelJS = require("exceljs");
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const currencyCodes = require("currency-codes");
const { Country } = require("country-state-city");

const Course = require("../../../model/masters/course");
const Institute = require("../../../model/masters/institute");
const ProgramLevel = require("../../../model/masters/programLevel");
const Requirements = require("../../../model/masters/requirements");
const Campus = require("../../../model/masters/campus");
const CourseTag = require("../../../model/masters/courseTags");
const RolePermissions = require("../../../model/rolesPermission");

const { buildCountryRegex } = require("../../../helpers/countryNameMapping");
const paginate = require("../../../utils/pagination");
const institute = require("../../../model/masters/institute");

const calculatePercentage = (score, scoreOutOf) => {
  if (!score || !scoreOutOf || isNaN(score) || isNaN(scoreOutOf)) return null;

  const scoreNum = parseFloat(score);
  const outOfNum = parseFloat(scoreOutOf);

  if (outOfNum <= 0) return null;

  return parseFloat(((scoreNum / outOfNum) * 100).toFixed(2));
};

const hasCourseFinderEditAccess = async (roleId, isPublic = false) => {
  // 🔹 Public users → NO edit access
  if (isPublic) return false;

  if (!mongoose.Types.ObjectId.isValid(roleId)) return false;

  const rolePerm = await RolePermissions.findOne({ roleId }).lean();
  if (!rolePerm || !Array.isArray(rolePerm.tabs)) return false;

  const tab = rolePerm.tabs.find(
    (t) =>
      t.tabName?.trim().toLowerCase() === "course finder" &&
      t.permission?.edit === true
  );

  return !!tab;
};

const courseServices = {
  createCourse: async (data, userId, userName) => {
    const { university, programName, score, scoreOutOf, ...courseData } = data;

    if (!Array.isArray(university) || university.length === 0) {
      throw {
        status: false,
        message: "At least one university must be selected",
      };
    }

    let percentage = null;
    if (score && scoreOutOf && !isNaN(score) && !isNaN(scoreOutOf)) {
      const scoreNum = parseFloat(score);
      const outOfNum = parseFloat(scoreOutOf);
      if (outOfNum > 0) {
        percentage = parseFloat(((scoreNum / outOfNum) * 100).toFixed(2));
      }
    }

    // 🔹 Fetch institutes with country (string)
    const institutes = await Institute.find({
      _id: { $in: university },
    }).select("_id country");

    // 🔹 Map id -> country string
    const instituteMap = institutes.reduce((acc, inst) => {
      acc[inst._id.toString()] = inst.country?.trim() || "";
      return acc;
    }, {});

    // 🔹 Check duplicates
    const existingCourses = await Course.find({
      university: { $in: university },
      programName: { $regex: new RegExp(`^${programName}$`, "i") },
    }).select("university");

    const existingUniIds = existingCourses.map((c) => c.university.toString());

    const universitiesToInsert = university.filter(
      (uniId) => !existingUniIds.includes(uniId.toString())
    );

    if (universitiesToInsert.length === 0) {
      throw {
        status: false,
        message:
          "Course with same program name already exists for selected universities.",
      };
    }

    // 🔹 Prepare payload
    const coursePayload = universitiesToInsert.map((uniId) => {
      const country =
        instituteMap[uniId.toString()] && instituteMap[uniId.toString()] !== ""
          ? instituteMap[uniId.toString()]
          : null;

      return {
        university: uniId,
        ...courseData,
        country, // ✅ string country name
        programName,
        score,
        scoreOutOf,
        percentage,
        created_by: userId,
        createdByName: userName,
      };
    });

    const insertedCourses = await Course.insertMany(coursePayload);
    return insertedCourses;
  },

  bulkUploadCourse: async (filePath, userId) => {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = xlsx.utils.sheet_to_json(sheet, {
        defval: "", // retain empty cells as empty string
        raw: false, // use formatted text from Excel, not raw values
      });

      // Check if sheet is empty
      if (!rows || rows.length === 0) {
        throw new Error(
          "The uploaded sheet has no data. Please check your file and try again."
        );
      }

      const createdCourses = [];

      for (const row of rows) {
        try {
          // Define institute fields to pull from Excel
          const instituteFields = [
            "instituteName",
            "country",
            "state",
            "city",
            "instituteRanking",
            "offerLetterEmail",
            "offerLetterEmailCC",
            "refundEmail",
            "refundEmailCC",
            "ttEmail",
            "ttEmailCC",
            "contact1",
            "contact2",
            "contactPerson",
            "admissionType",
            "portal",
            "webAddress",
            "postalAddress",
            "fax",
            "commissionPeriod",
            "commissionPercentage",
            "profile",
            "brochure",
            "otherInfo",
            "backlog",
            "recruitmentTerritoryRights",
            "agreementStartDate",
            "agreementEndDate",
            "agreementStatus",
            "typeOfAssociation",
          ];

          // Find existing Institute
          // let university = await Institute.findOne({
          //   instituteName: row.instituteName,
          //   country: row.country,
          // });

          let campus = await Campus.findOne({
            campus: row.campus?.trim(),
            country: row.country?.trim(),
          });

          if (!campus) {
            campus = await new Campus({
              campus: row.campus?.trim(),
              country: row.country?.trim(),
              created_by: userId,
            }).save();
          }

          let university;

          if (row.state && row.city) {
            university = await Institute.findOne({
              instituteName: row.instituteName?.trim(),
              country: row.country?.trim(),
              state: row.state?.trim(),
              city: row.city?.trim(),
              campus: campus._id,
            });
          } else {
            university = await Institute.findOne({
              instituteName: row.instituteName?.trim(),
              country: row.country?.trim(),
              campus: campus._id,
            });
          }

          if (!university) {
            const newInstituteData = {
              created_by: userId,
              campus: campus._id,
            };

            for (const field of instituteFields) {
              if (row[field] !== undefined && row[field] !== "") {
                if (field === "contactPerson") {
                  const contacts = [];
                  const entries = row[field]
                    .split("|")
                    .map((e) => e.trim())
                    .filter(Boolean);

                  for (const entry of entries) {
                    const [name, designation, email, phone] = entry
                      .split(",")
                      .map((x) => x.trim());
                    if (name)
                      contacts.push({ name, designation, email, phone });
                  }

                  if (contacts.length)
                    newInstituteData.contactPerson = contacts;
                } else if (
                  ["agreementStartDate", "agreementEndDate"].includes(field)
                ) {
                  const dateValue = new Date(row[field]);
                  if (!isNaN(dateValue)) {
                    newInstituteData[field] = dateValue;
                  }
                } else {
                  newInstituteData[field] = row[field];
                }
              }
            }

            if (
              row.commissionPercentage !== undefined &&
              row.commissionPercentage !== ""
            ) {
              const commissionPercentage = Number(row.commissionPercentage);
              if (isNaN(commissionPercentage)) {
                throw new Error("Commission Percentage must be a valid number");
              }
              if (commissionPercentage < 0 || commissionPercentage > 100) {
                throw new Error(
                  "Commission Percentage must be between 0 and 100"
                );
              }
              newInstituteData.commissionPercentage = commissionPercentage;
            }
            // Handle olTATPeriod with validation
            if (row.olTATPeriodValue || row.olTATPeriodUnit) {
              // Check if olTATPeriodValue is a valid number
              const periodValue = Number(row.olTATPeriodValue || 0);
              if (isNaN(periodValue)) {
                throw new Error("olTATPeriodValue must be a valid number");
              }

              newInstituteData.olTATPeriod = {
                value: periodValue,
                unit: row.olTATPeriodUnit || "days",
              };
            }

            // Validate required fields
            if (!row.instituteName) {
              throw new Error("Institute Name is required");
            }

            if (!row.country) {
              throw new Error("Country is required");
            }

            university = await new Institute(newInstituteData).save();
          } else {
            // Update missing Institute fields
            let updated = false;
            for (const field of instituteFields) {
              if (
                (!university[field] || university[field] === "") &&
                row[field]
              ) {
                university[field] = row[field];
                updated = true;
              }
            }

            // Update commission percentage with validation
            if (
              (!university.commissionPercentage ||
                university.commissionPercentage === "") &&
              row.commissionPercentage !== undefined &&
              row.commissionPercentage !== ""
            ) {
              const commissionPercentage = Number(row.commissionPercentage);
              if (isNaN(commissionPercentage)) {
                throw new Error("Commission Percentage must be a valid number");
              }
              if (commissionPercentage < 0 || commissionPercentage > 100) {
                throw new Error(
                  "Commission Percentage must be between 0 and 100"
                );
              }
              university.commissionPercentage = commissionPercentage;
              updated = true;
            }

            if (updated) await university.save();
          }

          // HANDLE STUDY LEVEL
          const studyLevelNames = row.studyLevel
            ? row.studyLevel.split(",")
            : [];
          const studyLevelIds = [];
          for (const name of studyLevelNames) {
            let level = await ProgramLevel.findOne({ name: name.trim() });
            if (!level) {
              level = await new ProgramLevel({
                name: name.trim(),
                created_by: userId,
              }).save();
            }
            studyLevelIds.push(level._id);
          }

          // HANDLE REQUIREMENTS
          const requirementsList = row.requirements
            ? row.requirements
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [];
          const requirementIds = [];

          for (const reqName of requirementsList) {
            let r = await Requirements.findOne({ name: reqName });
            if (!r) {
              r = await new Requirements({
                name: reqName,
                created_by: userId,
              }).save();
            }
            requirementIds.push(r._id);
          }

          // HANDLE TAGS
          const tagsList = row.tags
            ? row.tags
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [];

          const tagIds = [];
          // Define tag colors array
          const tagColors = [
            "#9e591c",
            "#6BCB77",
            "#4D96FF",
            "#FFB703",
            "#660ead",
            "#96b81a",
            "#F15BB5",
            "#8AC926",
            "#d383de",
            "#1982C4",
            "#8338EC",
            "#F77F00",
          ];
          const getRandomFromArray = (arr) =>
            arr[Math.floor(Math.random() * arr.length)];

          for (const tagName of tagsList) {
            let tag = await CourseTag.findOne({ name: tagName.trim() });
            if (!tag) {
              const usedColors = await CourseTag.distinct("color");
              let selectedColor;

              if (usedColors.length < tagColors.length) {
                // Choose from unused colors if possible
                const availableColors = tagColors.filter(
                  (color) => !usedColors.includes(color)
                );
                selectedColor = getRandomFromArray(availableColors);
              } else {
                // All colors used — reuse from full list
                selectedColor = getRandomFromArray(tagColors);
              }

              tag = await new CourseTag({
                name: tagName,
                color: selectedColor,
                created_by: userId,
              }).save();
            }
            tagIds.push(tag._id);
          }

          const parseArray = (value, type = "string") => {
            if (!value) return [];

            if (typeof value === "number") {
              return [value];
            }

            if (typeof value === "string") {
              const arr = value
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item !== "");

              return type === "number"
                ? arr.map((item) => {
                    const num = Number(item);
                    return isNaN(num) ? item : num;
                  })
                : arr;
            }
            return [];
          };

          const parseIntakes = (value) => {
            if (!value || typeof value !== "string") return [];

            const convertIntake = value
              .split(",")
              .map((entry) => {
                const match = entry
                  .trim()
                  .match(/^(.+?)\s*\((Active|Inactive)\)$/i);
                if (match) {
                  return {
                    month: match[1].trim(),
                    status: match[2].trim(),
                  };
                }
                return null;
              })
              .filter(Boolean); // remove any invalid entries
            return convertIntake;
          };

          // const existingCourse = await Course.findOne({
          //   university: university._id,
          //   programName: row.programName,
          // });

          // if (existingCourse) {
          //   // console.log(`Duplicate course found: ${row.programName}. Skipping.`);
          //   continue;
          // }

          const existingCourse = await Course.findOne({
            university: university._id,
            programName: row.programName,
          });

          if (existingCourse) {
            let updated = false;

            // Define the fields to check and update if changed
            const updatableFields = [
              "concentration",
              "websiteUrl",
              "duration",
              // "intakes",
              "intakeYear",
              "applicationStartDate",
              "applicationEndDate",
              "currencyCode",
              "applicationFee",
              "yearlyTuitionFee",
              "scholarshipAvailable",
              "scholarshipDetails",
              "remarks",
              "eslElpAvailable",
              "eslElpDetails",
              "applicationMode",
              "englishProficiencyExamWaiver",
              "entryRequirements",
              "criteria",
              "status",
              "studyArea",
              "disciplineArea",
              "career",
            ];

            // Handle array fields
            const arrayFields = {
              // intakes: parseIntakes(row.intakes),
              intakeYear: parseArray(row.intakeYear, "string"),
              applicationStartDate: parseArray(row.applicationStartDate),
              applicationEndDate: parseArray(row.applicationEndDate),
            };

            // Update fields if they differ
            for (const field of updatableFields) {
              if (
                row[field] !== undefined &&
                row[field] !== "" &&
                existingCourse[field] !== row[field]
              ) {
                existingCourse[field] = row[field];
                updated = true;
              }
            }

            // Handle intakes separately with proper parsing
            if (row.intakes !== undefined && row.intakes !== "") {
              const newIntakes = parseIntakes(row.intakes);
              const oldIntakes = existingCourse.intakes || [];

              // Compare intakes arrays
              const oldIntakesStr = oldIntakes
                .map((i) => `${i.month} (${i.status})`)
                .sort();
              const newIntakesStr = newIntakes
                .map((i) => `${i.month} (${i.status})`)
                .sort();

              if (
                JSON.stringify(oldIntakesStr) !== JSON.stringify(newIntakesStr)
              ) {
                existingCourse.intakes = newIntakes;
                updated = true;
              }
            }

            // Handle other array fields
            for (const field in arrayFields) {
              if (
                JSON.stringify(existingCourse[field]) !==
                JSON.stringify(arrayFields[field])
              ) {
                existingCourse[field] = arrayFields[field];
                updated = true;
              }
            }
            if (row.score !== undefined && row.score !== "") {
              const newScore = Number(row.score);
              if (!isNaN(newScore) && existingCourse.score !== newScore) {
                existingCourse.score = newScore;
                updated = true;
              }
            }

            if (row.scoreOutOf !== undefined && row.scoreOutOf !== "") {
              const newScoreOutOf = Number(row.scoreOutOf);
              if (
                !isNaN(newScoreOutOf) &&
                existingCourse.scoreOutOf !== newScoreOutOf
              ) {
                existingCourse.scoreOutOf = newScoreOutOf;
                updated = true;
              }
            }

            // ✅ Auto-update percentage if score and scoreOutOf exist
            if (
              (row.score !== undefined && row.score !== "") ||
              (row.scoreOutOf !== undefined && row.scoreOutOf !== "")
            ) {
              existingCourse.percentage = calculatePercentage(
                row.score || existingCourse.score,
                row.scoreOutOf || existingCourse.scoreOutOf
              );
              updated = true;
            }

            // Check and update studyLevel
            if (
              studyLevelIds.length > 0 &&
              JSON.stringify(
                existingCourse.studyLevel?.map((id) => id.toString()).sort()
              ) !==
                JSON.stringify(studyLevelIds.map((id) => id.toString()).sort())
            ) {
              existingCourse.studyLevel = studyLevelIds;
              updated = true;
            }

            // Check and update requirements
            if (
              requirementIds.length > 0 &&
              JSON.stringify(
                existingCourse.requirements?.map((id) => id.toString()).sort()
              ) !==
                JSON.stringify(requirementIds.map((id) => id.toString()).sort())
            ) {
              existingCourse.requirements = requirementIds;
              updated = true;
            }

            // Check and update discipineArea
            if (
              row.disciplineArea &&
              JSON.stringify(existingCourse.disciplineArea || []) !==
                JSON.stringify(parseArray(row.disciplineArea))
            ) {
              existingCourse.disciplineArea = parseArray(row.disciplineArea);
              updated = true;
            }

            // Check and update tags
            if (
              tagIds.length > 0 &&
              JSON.stringify(
                existingCourse.tags?.map((id) => id.toString()).sort()
              ) !== JSON.stringify(tagIds.map((id) => id.toString()).sort())
            ) {
              existingCourse.tags = tagIds;
              updated = true;
            }

            if (updated) {
              await existingCourse.save();
              createdCourses.push(existingCourse); // optionally track updated too
            }

            continue; // skip new insert
          }

          // Validate program name
          if (!row.programName) {
            throw new Error("Program Name is required");
          }

          // CREATE COURSE
          const newCourse = new Course({
            university: university._id,
            country: university.country,
            programName: row.programName,
            concentration: row.concentration,
            websiteUrl: row.websiteUrl,
            studyLevel: studyLevelIds,
            duration: row.duration,
            intakes: parseIntakes(row.intakes),
            intakeYear: parseArray(row.intakeYear, "string"),
            applicationStartDate: parseArray(row.applicationStartDate),
            applicationEndDate: parseArray(row.applicationEndDate),
            // applicationDeadlines: parseArray(row.applicationDeadlines),
            currencyCode: row.currencyCode,
            applicationFee: row.applicationFee,
            yearlyTuitionFee: row.yearlyTuitionFee,
            scholarshipAvailable: row.scholarshipAvailable,
            scholarshipDetails: row.scholarshipDetails,
            remarks: row.remarks,
            eslElpAvailable: row.eslElpAvailable,
            eslElpDetails: row.eslElpDetails,
            applicationMode: row.applicationMode,
            englishProficiencyExamWaiver: row.englishProficiencyExamWaiver,
            requirements: requirementIds,
            entryRequirements: row.entryRequirements,
            tags: tagIds,
            criteria: row.criteria,
            status: row.status || "Active",
            studyArea: row.studyArea,
            disciplineArea: parseArray(row.disciplineArea),
            created_by: userId,
            score: row.score || null,
            scoreOutOf: row.scoreOutOf || null,
            percentage: calculatePercentage(row.score, row.scoreOutOf),
            career: row.career || "",
          });
          await newCourse.save();
          createdCourses.push(newCourse);
        } catch (rowError) {
          // Handle individual row errors
          console.error(
            `Error processing row with instituteName: ${row.instituteName}, programName: ${row.programName}: ${rowError.message}`
          );

          // You can choose to throw the error to stop the whole process
          // or continue to the next row
          throw new Error(
            `Error in row for ${row.instituteName}: ${rowError.message}`
          );
        }
      }

      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }, 1000); // wait 1 second before deletion

      return createdCourses;
    } catch (error) {
      // Extract meaningful error messages from mongoose validation errors
      if (error.name === "ValidationError") {
        const errorDetails = {};

        for (const field in error.errors) {
          const path = error.errors[field].path;
          const kind = error.errors[field].kind;

          // Handle specific field errors with user-friendly messages
          if (path === "olTATPeriod.value") {
            errorDetails[path] = "olTATPeriodValue must be a valid number";
          } else if (path === "commissionPercentage") {
            if (kind === "min") {
              errorDetails[path] =
                "Commission Percentage cannot be less than 0";
            } else if (kind === "max") {
              errorDetails[path] =
                "Commission Percentage cannot be greater than 100";
            } else {
              errorDetails[path] =
                "Commission Percentage must be a valid number between 0 and 100";
            }
          } else if (path.includes("email")) {
            errorDetails[path] = `${
              path.charAt(0).toUpperCase() + path.slice(1)
            } must be a valid email address`;
          } else if (path === "country" || path === "instituteName") {
            errorDetails[path] = `${
              path.charAt(0).toUpperCase() + path.slice(1)
            } is required`;
          } else if (kind === "required") {
            errorDetails[path] = `${
              path.charAt(0).toUpperCase() + path.slice(1)
            } is required`;
          } else if (kind === "Number") {
            errorDetails[path] = `${
              path.charAt(0).toUpperCase() + path.slice(1)
            } must be a valid number`;
          } else if (kind === "min") {
            errorDetails[path] = `${
              path.charAt(0).toUpperCase() + path.slice(1)
            } is below the minimum allowed value`;
          } else if (kind === "max") {
            errorDetails[path] = `${
              path.charAt(0).toUpperCase() + path.slice(1)
            } is above the maximum allowed value`;
          } else {
            // Format the field name for better readability
            const formattedPath = path
              .split(".")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" ");

            errorDetails[
              path
            ] = `Invalid ${formattedPath}: ${error.errors[field].message}`;
          }
        }

        throw new Error(JSON.stringify(errorDetails));
      }

      // Re-throw the original error if it's not a validation error
      throw error;
    }
  },

  updateCourse: async (updateId, updateData, userId, userName) => {
    if (!mongoose.Types.ObjectId.isValid(updateId)) {
      throw { status: false, message: "Invalid course ID" };
    }

    if (
      updateData.hasOwnProperty("Score") ||
      updateData.hasOwnProperty("scoreOutOf")
    ) {
      const existingCourse = await Course.findById(updateId).select(
        "score scoreOutOf"
      );

      if (!existingCourse) {
        throw { status: false, message: "Course not found" };
      }

      const score =
        updateData.score !== undefined
          ? updateData.score
          : existingCourse.score;

      const scoreOutOf =
        updateData.scoreOutOf !== undefined
          ? updateData.scoreOutOf
          : existingCourse.scoreOutOf;

      updateData.percentage = calculatePercentage(score, scoreOutOf);
    }

    const update = await Course.findByIdAndUpdate(
      updateId,
      { ...updateData, updated_by: userId, updatedByName: userName },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!update) {
      throw { status: false, message: "Course not found" };
    }

    return update;
  },
  getAllCourse: async (page, limit, searchText = "") => {
    const populateFields = [
      { path: "university", select: "instituteName instituteRanking country" },
      { path: "studyLevel", select: "name" },
      { path: "requirements", select: "name" },
    ];

    const searchOptions = {
      searchText,
      searchFields: [
        "programName",
        "concentration",
        "studyArea",
        "disciplineArea",
      ],
    };
    const getCourse = await paginate(
      Course,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getCourse || getCourse.totalRecords === 0) {
      throw { status: false, message: "No course found" };
    }

    return getCourse;
  },
  getOneCourse: async (id) => {
    const populateFields = [
      {
        path: "university",
        select:
          "instituteName instituteRanking campus country state city profile brochure youtubeLink galleryLink",
        populate: { path: "campus", select: "campus" },
      },
      { path: "studyLevel", select: "name" },
      { path: "requirements", select: "name" },
      { path: "created_by", select: "name" },
      { path: "tags", select: "name color" },
    ];

    const getData = await Course.findById(id).populate(populateFields);

    if (!getData) {
      throw { status: false, message: "Course not found" };
    }

    return getData;
  },

  deleteCourse: async (deleteId) => {
    const deleteData = await Course.findByIdAndDelete(deleteId);

    if (!deleteData) {
      throw { status: false, message: "Course not found" };
    }
    return "Course deleted succesfully";
  },

  // courseFilter: async (page, limit, filters = {}, role) => {
  //   const {
  //     searchText,
  //     months,
  //     year,
  //     country,
  //     state,
  //     programLevel,
  //     studyArea,
  //     duration,
  //     eslElpAvailable,
  //     requirements,
  //     scholarshipAvailable,
  //     campus,
  //     institute,
  //   } = filters;

  //   const getQuery = async (excludedFilters = []) => {
  //     const query = {};
  //     // if(role.name !== "superAdmin"){
  //     //   query.status = "Active"
  //     // }

  //     if (!excludedFilters.includes("searchText") && searchText) {
  //       const searchWords = searchText
  //         .split(/[\s,]+/) // split by spaces or commas
  //         .map((word) => word.trim())
  //         .filter(Boolean);

  //       query.$or = searchWords.flatMap((word) => [
  //         { programName: { $regex: word, $options: "i" } },
  //         { concentration: { $regex: word, $options: "i" } },
  //       ]);
  //     }

  //     if (!excludedFilters.includes("months") && months?.length > 0) {
  //       const monthArr = Array.isArray(months)
  //         ? months
  //         : months.split(",").map((m) => m.trim());
  //       if (monthArr.length) {
  //         query.intakes = { $in: monthArr };
  //       }
  //     }

  //     if (!excludedFilters.includes("year") && year?.length > 0) {
  //       const yearArr = Array.isArray(year)
  //         ? year.map((y) => parseInt(y))
  //         : year.split(",").map((y) => parseInt(y.trim()));
  //       if (yearArr.length) {
  //         query.intakeYear = { $in: yearArr };
  //       }
  //     }

  //     if (
  //       !excludedFilters.includes("country") ||
  //       !excludedFilters.includes("state")
  //     ) {
  //       const universityMatch = {};

  //       if (!excludedFilters.includes("country") && country) {
  //         const countryArr = Array.isArray(country)
  //           ? country
  //           : country.split(",").map((c) => c.trim());

  //         if (countryArr.length) {
  //           if (countryArr.length === 1) {
  //             const regex = buildCountryRegex(countryArr[0]);
  //             universityMatch.country = { $regex: regex };
  //           } else {
  //             universityMatch.country = { $in: countryArr };
  //           }
  //         }
  //       }

  //       if (!excludedFilters.includes("state") && state) {
  //         const stateArr = Array.isArray(state)
  //           ? state
  //           : state.split(",").map((s) => s.trim());

  //         if (stateArr.length) universityMatch.state = { $in: stateArr };
  //       }

  //       if (Object.keys(universityMatch).length) {
  //         const universities = await Institute.find(universityMatch).select(
  //           "_id"
  //         );
  //         const universityIds = universities.map((u) => u._id);
  //         query.university = { $in: universityIds };
  //       }
  //     }

  //     if (!excludedFilters.includes("programLevel") && programLevel) {
  //       const levels = Array.isArray(programLevel)
  //         ? programLevel
  //         : programLevel.split(",").map((l) => l.trim());
  //       if (levels.length) query.studyLevel = { $in: levels };
  //     }

  //     if (!excludedFilters.includes("studyArea") && studyArea) {
  //       query.concentration = { $regex: studyArea, $options: "i" };
  //     }

  //     if (!excludedFilters.includes("duration") && duration) {
  //       query.duration = duration;
  //     }

  //     if (!excludedFilters.includes("eslElpAvailable") && eslElpAvailable) {
  //       query.eslElpAvailable = eslElpAvailable;
  //     }

  //     if (!excludedFilters.includes("requirements") && requirements) {
  //       const reqArr = Array.isArray(requirements)
  //         ? requirements
  //         : requirements.split(",").map((r) => r.trim());
  //       if (reqArr.length) query["requirements"] = { $in: reqArr };
  //     }

  //     if (
  //       !excludedFilters.includes("scholarshipAvailable") &&
  //       scholarshipAvailable
  //     ) {
  //       query.scholarshipAvailable = scholarshipAvailable;
  //     }

  //     if (!excludedFilters.includes("campus") && campus) {
  //       const campusArr = Array.isArray(campus) ? campus : [campus];

  //       const matchedInstitutes = await Institute.find({
  //         campus: { $in: campusArr },
  //       }).select("_id");

  //       const instituteIds = matchedInstitutes.map((i) => i._id);

  //       query.university = query.university
  //         ? {
  //             $in: instituteIds.filter((id) =>
  //               query.university.$in.includes(id)
  //             ),
  //           }
  //         : { $in: instituteIds };
  //     }

  //     if (!excludedFilters.includes("institute") && institute) {
  //       const instituteArr = Array.isArray(institute)
  //         ? institute
  //         : institute.split(",").map((id) => id.trim());

  //       const mongoose = require("mongoose");
  //       const validIds = instituteArr.filter((id) =>
  //         mongoose.Types.ObjectId.isValid(id)
  //       );

  //       if (validIds.length) {
  //         query.university = query.university
  //           ? {
  //               $in: validIds.filter((id) => query.university.$in.includes(id)),
  //             }
  //           : { $in: validIds };
  //       }
  //     }

  //     return query;
  //   };

  //   const populateFields = [
  //     {
  //       path: "university",
  //       select:
  //         "instituteName instituteRanking campus country state city profile brochure",
  //       populate: {
  //         path: "campus",
  //         select: "campus",
  //       },
  //     },
  //     { path: "studyLevel", select: "name" },
  //     { path: "requirements", select: "name" },
  //     { path: "created_by", select: "name" },
  //     { path: "tags", select: "name color" },
  //   ];

  //   // Helper function to get all data, sort with tags priority, then paginate
  //   const getFilteredAndSortedData = async (query) => {
  //     // Get ALL data first (without pagination)
  //     const allData = await Course.find(query)
  //       .populate(populateFields)
  //       .sort({ createdAt: -1 })
  //       .lean();

  //     if (allData.length === 0) {
  //       return {
  //         data: [],
  //         totalRecords: 0,
  //         totalPages: 0,
  //         currentPage: page,
  //         hasNextPage: false,
  //         hasPrevPage: false,
  //       };
  //     }

  //     // Prioritize full-phrase matches over keyword matches
  //     const lowerSearch = searchText?.trim()?.toLowerCase() || "";

  //     const sortedData = allData.sort((a, b) => {
  //       const aText = `${a.programName} ${a.concentration}`.toLowerCase();
  //       const bText = `${b.programName} ${b.concentration}`.toLowerCase();

  //       const aExact = aText.includes(lowerSearch);
  //       const bExact = bText.includes(lowerSearch);

  //       if (aExact && !bExact) return -1;
  //       if (!aExact && bExact) return 1;

  //       // Prioritize records with tags
  //       const aHasTags = a.tags && a.tags.length > 0;
  //       const bHasTags = b.tags && b.tags.length > 0;

  //       if (aHasTags && !bHasTags) return -1;
  //       if (!aHasTags && bHasTags) return 1;

  //       // Otherwise, sort by latest
  //       return new Date(b.createdAt) - new Date(a.createdAt);
  //     });

  //     // Apply pagination to the sorted data
  //     const totalRecords = sortedData.length;
  //     const totalPages = Math.ceil(totalRecords / limit);
  //     const startIndex = (page - 1) * limit;
  //     const endIndex = startIndex + limit;
  //     const paginatedData = sortedData.slice(startIndex, endIndex);

  //     return {
  //       data: paginatedData,
  //       totalRecords,
  //       totalPages,
  //       currentPage: page,
  //       hasNextPage: page < totalPages,
  //       hasPrevPage: page > 1,
  //     };
  //   };

  //   const allFilters = [
  //     "months",
  //     "year",
  //     "country",
  //     "state",
  //     "programLevel",
  //     "studyArea",
  //     "duration",
  //     "eslElpAvailable",
  //     "requirements",
  //     "scholarshipAvailable",
  //     "campus",
  //     "institute",
  //   ];

  //   // Try with all filters first
  //   let result = await getFilteredAndSortedData(await getQuery([]));
  //   console.log("resultt===========================" , result);

  //   if (result.totalRecords === 0) {
  //     // Try relaxing filters one by one
  //     for (const filterToExclude of allFilters) {
  //       result = await getFilteredAndSortedData(
  //         await getQuery([filterToExclude])
  //       );

  //       if (result.totalRecords > 0) {
  //         return {
  //           message: `No exact match found, But our Smart AI suggests results by relaxing '${filterToExclude}' filter.`,
  //           ...result,
  //         };
  //       }
  //     }

  //     // If still no result, relax everything except searchText
  //     result = await getFilteredAndSortedData(await getQuery(allFilters));

  //     return {
  //       message:
  //         result.totalRecords === 0
  //           ? "No matching courses found."
  //           : "Showing results with relaxed filters.",
  //       ...result,
  //     };
  //   }

  //   return {
  //     message: "Courses fetched successfully",
  //     ...result,
  //   };
  // },

  // GET /api/filters/dependent
  getDependentCourseFilters: async (country, studyArea) => {
    const matchQuery = {};

    // Filter by country via institutes
    if (country) {
      const countryList = country
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      if (countryList.length) {
        const universities = await Institute.find({
          country: { $in: countryList },
        }).select("_id");
        const universityIds = universities.map((i) => i._id);
        matchQuery.university = { $in: universityIds };
      }
    }

    // Filter by studyArea (multi-value + case-insensitive)
    if (studyArea) {
      const studyAreaList = studyArea
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (studyAreaList.length) {
        matchQuery.$or = studyAreaList.map((s) => ({
          studyArea: { $regex: new RegExp(s, "i") },
        }));
      }
    }

    const pipeline = [{ $match: matchQuery }];

    if (!country && !studyArea) {
      pipeline.push({
        $group: {
          _id: null,
          studyAreas: { $addToSet: "$studyArea" },
          disciplineAreas: { $addToSet: "$disciplineArea" },
        },
      });
    } else if (country && !studyArea) {
      pipeline.push({
        $group: {
          _id: null,
          studyAreas: { $addToSet: "$studyArea" },
          disciplineAreas: { $addToSet: "$disciplineArea" },
        },
      });
    } else if (!country && studyArea) {
      pipeline.push({
        $group: {
          _id: null,
          disciplineAreas: { $addToSet: "$disciplineArea" },
        },
      });
    } else if (country && studyArea) {
      pipeline.push({
        $group: {
          _id: null,
          disciplineAreas: { $addToSet: "$disciplineArea" },
        },
      });
    }

    const results = await Course.aggregate(pipeline);
    const data = results[0] || {};

    return {
      type: "dependent",
      studyAreas: data.studyAreas?.filter(Boolean) || [],
      disciplineAreas: data.disciplineAreas?.filter(Boolean) || [],
    };
  },
  getStudyAreasByCountry: async (country) => {
    const matchQuery = {};

    // Step 1: If country is passed, get university IDs in that country
    if (country) {
      const countryList = country
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (countryList.length) {
        const universities = await Institute.find({
          country: { $in: countryList },
        }).select("_id");

        const universityIds = universities.map((i) => i._id);

        // Filter courses by these universities
        matchQuery.university = { $in: universityIds };
      }
    }

    // Step 2: Build pipeline
    const pipeline = [
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          studyAreas: { $addToSet: "$studyArea" },
        },
      },
    ];

    // Step 3: Aggregate
    const result = await Course.aggregate(pipeline);
    const studyAreas = result[0]?.studyAreas?.filter(Boolean) || [];

    return {
      studyAreas,
    };
  },

  courseFilter: async (
    page,
    limit,
    filters = {},
    roleId,
    isSuperAdmin = false,
    isPublic
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const {
      searchText,
      months,
      year,
      country,
      state,
      programLevel,
      studyArea,
      disciplineArea,
      duration,
      eslElpAvailable,
      requirements,
      scholarshipAvailable,
      campus,
      institute,
      minTuitionFee,
      maxTuitionFee,
      backlog,
      score,
      scoreOutOf,
    } = filters;

    let canEditCourseFinder = false;

    if (isSuperAdmin) {
      // ⭐ Super Admin always has full access
      canEditCourseFinder = true;
    } else {
      // ⭐ Normal roles → check permission
      canEditCourseFinder = await hasCourseFinderEditAccess(roleId, isPublic);
    }

    // const baseStatusQuery = canEditCourseFinder ? {} : { status: "Active" };
    const baseStatusQuery = {};

    // Base function to generate query from selected filters
    const buildQuery = async (exclude = []) => {
      const query = {};

      // Object.assign(query, baseStatusQuery);
      Object.assign(query);

      if (months?.length && !exclude.includes("months")) {
        query.intakes = {
          $elemMatch: {
            month: { $in: months },
            status: "Active",
          },
        };
      }

      // if (year?.length && !exclude.includes("year")) {
      //   const yearArr = Array.isArray(year)
      //     ? year
      //     : year.split(",").map(Number);
      //   query.intakeYear = { $in: yearArr };
      // }
      if (year?.length && !exclude.includes("year")) {
        const years = Array.isArray(year)
          ? year
          : year.split(",").map((y) => y.trim());

        // Convert filter years to strings
        const yearStrings = years.map((y) => String(Number(y)));

        query.$expr = {
          $gt: [
            {
              $size: {
                $setIntersection: [
                  yearStrings,
                  {
                    $map: {
                      input: {
                        $cond: [
                          { $isArray: "$intakeYear" },
                          "$intakeYear",
                          ["$intakeYear"],
                        ],
                      },
                      as: "yr",
                      in: { $toString: "$$yr" },
                    },
                  },
                ],
              },
            },
            0,
          ],
        };
      }

      if (programLevel && !exclude.includes("programLevel")) {
        const levelArr = Array.isArray(programLevel)
          ? programLevel
          : programLevel.split(",");
        query.studyLevel = {
          $in: levelArr.filter((id) => mongoose.Types.ObjectId.isValid(id)),
        };
      }
      // if (studyArea && !exclude.includes("studyArea")) {
      //   query.studyArea = { $regex: studyArea, $options: "i" };
      // }

      if (score && scoreOutOf && !exclude.includes("percentage")) {
        const scores = parseFloat(score);
        const scoresOutOf = parseFloat(scoreOutOf);

        if (!isNaN(scores) && !isNaN(scoresOutOf) && scoresOutOf > 0) {
          const percentage = (scores / scoresOutOf) * 100;
          const roundedPercentage = parseFloat(percentage.toFixed(2));

          query.percentage = { $eq: roundedPercentage };
        }
      }

      const orConditions = [];

      if (studyArea && !exclude.includes("studyArea")) {
        const areas = Array.isArray(studyArea)
          ? studyArea
          : studyArea
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean);

        orConditions.push(
          ...areas.map((area) => ({
            studyArea: { $regex: area, $options: "i" },
          }))
        );
      }

      if (disciplineArea && !exclude.includes("disciplineArea")) {
        const disciplineArray = Array.isArray(disciplineArea)
          ? disciplineArea
          : disciplineArea
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean);

        orConditions.push(
          ...disciplineArray.map((d) => ({
            disciplineArea: { $regex: d, $options: "i" },
          }))
        );
      }

      // Attach to main query if any
      if (orConditions.length) {
        query.$and = query.$and || [];
        query.$and.push({ $or: orConditions });
      }

      if (duration && !exclude.includes("duration")) {
        query.duration = duration;
      }

      if (eslElpAvailable && !exclude.includes("eslElpAvailable")) {
        query.eslElpAvailable = eslElpAvailable;
      }

      if (requirements?.length && !exclude.includes("requirements")) {
        const reqArr = Array.isArray(requirements)
          ? requirements
          : requirements.split(",");
        query.requirements = { $in: reqArr };
      }

      if (scholarshipAvailable && !exclude.includes("scholarshipAvailable")) {
        query.scholarshipAvailable = scholarshipAvailable;
      }

      const instFilter = {};

      if (country && !exclude.includes("country")) {
        instFilter.country = {
          $in: Array.isArray(country) ? country : country.split(","),
        };
      }

      // if (state && !exclude.includes("state")) {
      //   instFilter.state = {
      //     $in: Array.isArray(state) ? state : state.split(","),
      //   };
      // }

      if (state && !exclude.includes("state")) {
        const stateArr = Array.isArray(state)
          ? state
          : state
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

        instFilter.state = { $in: stateArr };
      }

      // if (campus && !exclude.includes("campus")) {
      //   instFilter.campus = { $in: Array.isArray(campus) ? campus : [campus] };
      // }

      if (campus && !exclude.includes("campus")) {
        const campusArr = Array.isArray(campus)
          ? campus
          : campus
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);

        instFilter.campus = { $in: campusArr };
      }

      // if (institute && !exclude.includes("institute")) {
      //   const instArr = Array.isArray(institute)
      //     ? institute
      //     : institute.split(",");
      //   instFilter._id = {
      //     $in: instArr.filter((id) => mongoose.Types.ObjectId.isValid(id)),
      //   };
      // }

      if (institute && !exclude.includes("institute")) {
        const instDocs = await Institute.find({ _id: institute }).select(
          "instituteName"
        );

        if (instDocs.length) {
          const instName = instDocs[0].instituteName;

          const allInsts = await Institute.find({
            instituteName: instName,
          }).select("_id");
          instFilter._id = { $in: allInsts.map((i) => i._id) };
        }
      }

      if (backlog && !exclude.includes("backlog")) {
        const backlogNumber = parseInt(backlog);
        if (!isNaN(backlogNumber)) {
          instFilter.$expr = {
            $and: [
              {
                $and: [
                  { $ne: [{ $type: "$backlog" }, "missing"] },
                  { $ne: ["$backlog", ""] },
                  { $ne: ["$backlog", null] },
                ],
              },
              {
                $lte: [{ $toInt: "$backlog" }, backlogNumber],
              },
            ],
          };
        }
      }

      if (Object.keys(instFilter).length > 0) {
        const matchedInsts = await Institute.find(instFilter).select("_id");
        query.university = { $in: matchedInsts.map((i) => i._id) };
      }

      // Always apply tuition fee filters (strict - never relaxed)
      // Alternative simpler approach for tuition fee filtering
      if (minTuitionFee || maxTuitionFee) {
        const conditions = [];

        if (minTuitionFee) {
          conditions.push({
            $expr: {
              $gte: [
                {
                  $cond: {
                    if: { $eq: [{ $type: "$yearlyTuitionFee" }, "string"] },
                    then: {
                      $toDouble: {
                        $replaceAll: {
                          input: { $trim: { input: "$yearlyTuitionFee" } },
                          find: ",",
                          replacement: "",
                        },
                      },
                    },
                    else: { $toDouble: "$yearlyTuitionFee" },
                  },
                },
                parseFloat(minTuitionFee),
              ],
            },
          });
        }

        if (maxTuitionFee) {
          conditions.push({
            $expr: {
              $lte: [
                {
                  $cond: {
                    if: { $eq: [{ $type: "$yearlyTuitionFee" }, "string"] },
                    then: {
                      $toDouble: {
                        $replaceAll: {
                          input: { $trim: { input: "$yearlyTuitionFee" } },
                          find: ",",
                          replacement: "",
                        },
                      },
                    },
                    else: { $toDouble: "$yearlyTuitionFee" },
                  },
                },
                parseFloat(maxTuitionFee),
              ],
            },
          });
        }

        query.$and = query.$and || [];
        query.$and.push(...conditions);
      }

      return query;
    };

    const populateFields = [
      {
        path: "university",
        select:
          "instituteName instituteRanking campus country state city profile brochure youtubeLink galleryLink",
        populate: { path: "campus", select: "campus" },
      },
      { path: "studyLevel", select: "name" },
      { path: "requirements", select: "name" },
      { path: "created_by", select: "name" },
      { path: "tags", select: "name color" },
    ];

    const sort = { status: 1, createdAt: -1 };

    const allFilters = [
      "months",
      "year",
      "country",
      "state",
      "programLevel",
      "studyArea",
      "disciplineArea",
      "duration",
      "eslElpAvailable",
      "requirements",
      "scholarshipAvailable",
      "campus",
      "institute",
      "backlog",
      "percentage",
    ];

    // 1. Try with full filters
    let query = await buildQuery([]);
    let result = await paginate(
      Course,
      query,
      page,
      limit,
      sort,
      populateFields,
      searchText
        ? {
            searchText,
            searchFields: [
              "programName",
              "concentration",
              "studyArea",
              "disciplineArea",
            ],
          }
        : {}
    );

    if (result.totalRecords > 0) {
      return {
        status: true,
        message: "Courses fetched successfully",
        ...result,
      };
    }

    // 2. Try relaxing one filter at a time
    for (const filterToExclude of allFilters) {
      query = await buildQuery([filterToExclude]);

      result = await paginate(
        Course,
        query,
        page,
        limit,
        sort,
        populateFields,
        searchText
          ? {
              searchText,
              searchFields: [
                "programName",
                "concentration",
                "studyArea",
                "disciplineArea",
              ],
            }
          : {}
      );

      if (result.totalRecords > 0) {
        return {
          status: true,
          message: `No Exact Match. Suggestions Based On Relaxed '${filterToExclude}'.`,
          ...result,
        };
      }
    }

    // 3. Relax all filters except searchText and tuition fees
    query = {};

    // Still apply tuition fee filters even when all other filters are relaxed
    if (minTuitionFee || maxTuitionFee) {
      const tuitionQuery = {};

      if (minTuitionFee) {
        tuitionQuery.$gte = parseFloat(minTuitionFee);
      }

      if (maxTuitionFee) {
        tuitionQuery.$lte = parseFloat(maxTuitionFee);
      }

      query.yearlyTuitionFee = tuitionQuery;
    }

    result = await paginate(
      Course,
      query,
      page,
      limit,
      sort,
      populateFields,
      searchText
        ? {
            searchText,
            searchFields: [
              "programName",
              "concentration",
              "studyArea",
              "disciplineArea",
            ],
          }
        : {}
    );

    return {
      status: true,
      message:
        result.totalRecords === 0
          ? "No matching courses found."
          : "Showing results with relaxed filters.",
      ...result,
    };
  },

  exportDataToExcel: async (courseIds = [], currentUser) => {
    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (!courseIds.length)
      return { status: false, message: "No Course IDS provided" };

    const courses = await Course.find({
      _id: { $in: courseIds },
      status: "Active",
    })
      .populate({
        path: "university",
        select: "instituteName instituteRanking country state city campus",
        populate: {
          path: "campus",
          select: "campus",
        },
      })
      .populate("studyLevel", "name")
      .populate("requirements.name", "name")
      .sort({ createdAt: -1 });

    if (!courses.length)
      return { success: false, message: "No matching courses found" };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Courses", {
      properties: { defaultRowHeight: 20 },
      pageSetup: { fitToPage: true, fitToHeight: 5, orientation: "landscape" },
    });

    const requirementSet = new Set();
    courses.forEach((course) => {
      course.requirements?.forEach((req) => {
        if (req.name?.name) {
          requirementSet.add(req.name.name);
        }
      });
    });
    const requirementColumns = Array.from(requirementSet);

    // Define all columns (full list)
    const allColumns = [
      { header: "instituteName", key: "instituteName", width: 30 },
      { header: "country", key: "country", width: 20 },
      { header: "state", key: "state", width: 20 },
      { header: "city", key: "city", width: 20 },
      { header: "instituteRanking", key: "instituteRanking", width: 15 },
      { header: "offerLetterEmail", key: "offerLetterEmail", width: 25 },
      { header: "offerLetterEmailCC", key: "offerLetterEmailCC", width: 25 },
      { header: "refundEmail", key: "refundEmail", width: 25 },
      { header: "refundEmailCC", key: "refundEmailCC", width: 25 },
      { header: "ttEmail", key: "ttEmail", width: 25 },
      { header: "ttEmailCC", key: "ttEmailCC", width: 25 },
      { header: "contact1", key: "contact1", width: 20 },
      { header: "contact2", key: "contact2", width: 20 },
      { header: "contactPerson", key: "contactPerson", width: 25 },
      { header: "admissionType", key: "admissionType", width: 20 },
      { header: "portal", key: "portal", width: 25 },
      { header: "webAddress", key: "webAddress", width: 25 },
      { header: "postalAddress", key: "postalAddress", width: 30 },
      { header: "fax", key: "fax", width: 20 },
      { header: "commissionPeriod", key: "commissionPeriod", width: 20 },
      {
        header: "commissionPercentage",
        key: "commissionPercentage",
        width: 20,
      },
      { header: "profile", key: "profile", width: 30 },
      { header: "brochure", key: "brochure", width: 30 },
      { header: "otherInfo", key: "otherInfo", width: 30 },
      { header: "backlog", key: "backlog", width: 20 },
      { header: "olTATPeriodValue", key: "olTATPeriodValue", width: 20 },
      { header: "olTATPeriodUnit", key: "olTATPeriodUnit", width: 20 },

      { header: "campus", key: "campus", width: 20 },
      { header: "programName", key: "programName", width: 30 },
      { header: "concentration", key: "concentration", width: 25 },
      { header: "websiteUrl", key: "websiteUrl", width: 25 },
      { header: "studyLevel", key: "studyLevel", width: 25 },
      { header: "duration", key: "duration", width: 15 },
      { header: "intakes", key: "intakes", width: 30 },
      { header: "intakeYear", key: "intakeYear", width: 30 },
      {
        header: "applicationStartDate",
        key: "applicationStartDate",
        width: 30,
      },
      { header: "applicationEndDate", key: "applicationEndDate", width: 30 },
      { header: "currencyCode", key: "currencyCode", width: 15 },
      { header: "applicationFee", key: "applicationFee", width: 15 },
      { header: "yearlyTuitionFee", key: "yearlyTuitionFee", width: 20 },
      {
        header: "scholarshipAvailable",
        key: "scholarshipAvailable",
        width: 15,
      },
      { header: "scholarshipDetails", key: "scholarshipDetails", width: 30 },
      { header: "remarks", key: "remarks", width: 30 },
      { header: "eslElpAvailable", key: "eslElpAvailable", width: 15 },
      { header: "eslElpDetails", key: "eslElpDetails", width: 30 },
      { header: "applicationMode", key: "applicationMode", width: 20 },
      {
        header: "englishProficiencyExamWaiver",
        key: "englishProficiencyExamWaiver",
        width: 30,
      },
      { header: "requirements", key: "requirements", width: 30 },
      { header: "entryRequirements", key: "entryRequirements", width: 30 },
      { header: "tags", key: "tags", width: 30 },
      { header: "criteria", key: "criteria", width: 30 },
      { header: "status", key: "status", width: 15 },
      { header: "studyArea", key: "studyArea", width: 20 },
      { header: "disciplineArea", key: "disciplineArea", width: 25 },
    ];

    const limitedColumns = [
      { header: "instituteName", key: "instituteName", width: 30 },
      { header: "country", key: "country", width: 20 },
      { header: "state", key: "state", width: 20 },
      { header: "city", key: "city", width: 20 },
      { header: "instituteRanking", key: "instituteRanking", width: 15 },
      { header: "campus", key: "campus", width: 20 },
      { header: "programName", key: "programName", width: 30 },
      { header: "concentration", key: "concentration", width: 25 },
      { header: "websiteUrl", key: "websiteUrl", width: 25 },
      { header: "studyLevel", key: "studyLevel", width: 25 },
      { header: "duration", key: "duration", width: 15 },
      { header: "intakes", key: "intakes", width: 30 },
      { header: "intakeYear", key: "intakeYear", width: 30 },
      {
        header: "applicationStartDate",
        key: "applicationStartDate",
        width: 30,
      },
      { header: "applicationEndDate", key: "applicationEndDate", width: 30 },
      { header: "currencyCode", key: "currencyCode", width: 15 },
      { header: "applicationFee", key: "applicationFee", width: 15 },
      { header: "yearlyTuitionFee", key: "yearlyTuitionFee", width: 20 },
      {
        header: "scholarshipAvailable",
        key: "scholarshipAvailable",
        width: 15,
      },
      { header: "scholarshipDetails", key: "scholarshipDetails", width: 30 },
      { header: "remarks", key: "remarks", width: 30 },
      { header: "eslElpAvailable", key: "eslElpAvailable", width: 15 },
      { header: "eslElpDetails", key: "eslElpDetails", width: 30 },
      { header: "applicationMode", key: "applicationMode", width: 20 },
      {
        header: "englishProficiencyExamWaiver",
        key: "englishProficiencyExamWaiver",
        width: 30,
      },
      { header: "requirements", key: "requirements", width: 30 },
      { header: "entryRequirements", key: "entryRequirements", width: 30 },
      { header: "tags", key: "tags", width: 30 },
      { header: "criteria", key: "criteria", width: 30 },
      { header: "status", key: "status", width: 15 },
      { header: "studyArea", key: "studyArea", width: 20 },
      { header: "disciplineArea", key: "disciplineArea", width: 25 },
    ];

    // worksheet.columns =
    //   roleName === "Super Admin" ? allColumns : limitedColumns;

    worksheet.columns = limitedColumns;
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF974807" },
      };
      cell.font = {
        name: "Arial",
        color: { argb: "FFFFFF" },
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    courses.forEach((course) => {
      const rowData = {
        instituteName: course.university?.instituteName || "",
        country: course.university?.country || "",
        state: course.university?.state || "",
        city: course.university?.city || "",
        instituteRanking: course.university?.instituteRanking || "",
        campus: course.university?.campus?.campus || "",
        programName: course.programName || "",
        concentration: course.concentration || "",
        websiteUrl: course.websiteUrl || "",
        studyLevel: Array.isArray(course.studyLevel)
          ? course.studyLevel.map((s) => s.name).join(", ")
          : "",
        duration: course.duration || "",
        intakes:
          course.intakes?.map((i) => `${i.month} (${i.status})`).join(", ") ||
          "",
        intakeYear: course.intakeYear?.join(", ") || "",
        applicationStartDate: course.applicationStartDate?.join(", ") || "",
        applicationEndDate: course.applicationEndDate?.join(", ") || "",
        currencyCode: course.currencyCode || "",
        applicationFee: course.applicationFee || "",
        yearlyTuitionFee: course.yearlyTuitionFee || "",
        scholarshipAvailable: course.scholarshipAvailable || "",
        scholarshipDetails: course.scholarshipDetails || "",
        remarks: course.remarks || "",
        eslElpAvailable: course.eslElpAvailable || "",
        eslElpDetails: course.eslElpDetails || "",
        applicationMode: course.applicationMode || "",
        englishProficiencyExamWaiver: course.englishProficiencyExamWaiver || "",
        requirements:
          course.requirements?.map((r) => r.name?.name).join(", ") || "",
        entryRequirements: course.entryRequirements || "",
        tags: course.tags?.map((t) => t.name).join(", ") || "",
        criteria: course.criteria || "",
        status: course.status || "",
        studyArea: course.studyArea || "",
        disciplineArea: course.disciplineArea?.join(", ") || "",
      };

      if (roleName === "Super Admin") {
        rowData.offerLetterEmail = course.offerLetterEmail || "";
        rowData.offerLetterEmailCC = course.offerLetterEmailCC || "";
        rowData.refundEmail = course.refundEmail || "";
        rowData.refundEmailCC = course.refundEmailCC || "";
        rowData.ttEmail = course.ttEmail || "";
        rowData.ttEmailCC = course.ttEmailCC || "";
        rowData.contact1 = course.contact1 || "";
        rowData.contact2 = course.contact2 || "";
        rowData.contactPerson = course.contactPerson || "";
        rowData.admissionType = course.admissionType || "";
        rowData.portal = course.portal || "";
        rowData.webAddress = course.webAddress || "";
        rowData.postalAddress = course.postalAddress || "";
        rowData.fax = course.fax || "";
        rowData.commissionPeriod = course.commissionPeriod || "";
        rowData.commissionPercentage = course.commissionPercentage || "";
        rowData.profile = course.profile || "";
      }

      requirementColumns.forEach((reqName) => {
        const matched = course.requirements?.find(
          (r) => r.name?.name === reqName
        );
        rowData[reqName.toLowerCase()] = matched?.value || "";
      });

      const row = worksheet.addRow(rowData);
      row.height = 45;
      row.eachCell((cell) => {
        cell.font = {
          name: "Arial",
          size: 11,
        };
        cell.alignment = {
          vertical: "top",
          horizontal: "left",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const folderPath = path.join(__dirname, "../../../uploads/excel");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `course_list.xlsx`;
    const filePath = path.join(folderPath, fileName);

    await workbook.xlsx.writeFile(filePath);
    const publicUrl = `/uploads/excel/${fileName}`;

    return publicUrl;
  },

  getCurrenctCode: async () => {
    const currencies = currencyCodes.data.map((code) => ({
      code: code.code,
      currency: code.currency,
    }));
    return currencies;
  },

  getAllCountriesFromCourses: async () => {
    const countryList = (await Course.distinct("country")).filter(
      (name) => name && name.trim() !== ""
    );
    const allCountries = Country.getAllCountries();
    const result = countryList.map((name) => {
      const match = allCountries.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );

      return {
        name,
        isoCode: match ? match.isoCode : null,
      };
    });

    return result;
  },
  getAllStatesFromCourses: async (country) => {
    if (!country) {
      throw { status: false, message: "Country is required" };
    }
    const countryList = country
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const stateResults = await Course.aggregate([
      {
        $match: {
          country: { $in: countryList },
          state: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$country",
          states: { $addToSet: "$state" },
        },
      },
    ]);

    return stateResults;
  },
  getAllDurationFromCourses: async () => {
    const durationList = await Course.distinct("duration");
    return durationList;
  },
};

module.exports = courseServices;
