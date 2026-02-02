// const paginate = async (model, query = {}, page = 1, limit = 10, sort = {}, populate = [], searchOptions = {}) => {
//     try {
//         const skip = (page - 1) * limit;

//         const searchQuery = {};

//         if (searchOptions.searchText && searchOptions.searchFields) {
//             const regex = new RegExp(searchOptions.searchText, "i");
//             searchQuery.$or = searchOptions.searchFields.map((field) => ({
//                 [field]: { $regex: regex },
//             }));
//         }

//         // const finalQuery = { ...query, ...searchQuery };
//         let finalQuery = {};

//         if (query.$or && searchQuery.$or) {
//             // Both have $or: wrap in $and
//             finalQuery = {
//                 $and: [
//                     { $or: query.$or },
//                     { $or: searchQuery.$or },
//                 ],
//             };
//         } else if (query.$or) {
//             finalQuery = { $or: query.$or, ...searchQuery };
//         } else if (searchQuery.$or) {
//             finalQuery = { ...query, $or: searchQuery.$or };
//         } else {
//             finalQuery = { ...query };
//         }


//         let queryExec = model.find(finalQuery).sort(sort).skip(skip).limit(limit).lean();
//         // Handle multiple populate fields
//         if (Array.isArray(populate)) {
//             populate.forEach((field) => {
//                 queryExec = queryExec.populate(field);
//             });
//         } else if (typeof populate === "string") {
//             queryExec = queryExec.populate(populate);
//         }

//         const data = await queryExec;
//         const totalRecords = await model.countDocuments(finalQuery);
//         return {
//             totalRecords,
//             currentPage: page,
//             totalPages: Math.ceil(totalRecords / limit),
//             pageSize: limit,
//             data
//         };
//     } catch (error) {
//         throw { status: false, message: "Error in pagination", error };
//     }
// };

// module.exports = paginate;



const paginate = async (
  model,
  query = {},
  page = 1,
  limit = 10,
  sort = {},
  populate = [],
  searchOptions = {}
) => {
  try {
    const skip = (page - 1) * limit;
    let finalQuery = { ...query };

    // if (
    //   searchOptions.searchText &&
    //   searchOptions.searchText.trim() !== "" &&
    //   searchOptions.searchFields?.length
    // ) {
    //   const regex = new RegExp(searchOptions.searchText.trim(), "i");
    //   const searchConditions = searchOptions.searchFields.map((field) => ({
    //     [field]: { $regex: regex },
    //   }));

    //   // merge search with existing filters
    //   finalQuery = {
    //     $and: [{ ...query }, { $or: searchConditions }],
    //   };
    // }   

     const { searchText, searchFields = [], searchOnField } = searchOptions;

    // ---------------------------
    // ⭐ Enhanced Dynamic Search
    // ---------------------------
    if (searchText && searchText.trim() !== "") {
      const regex = new RegExp(searchText.trim(), "i");

      // 🔹 If searchOnField exists → search only on that field
      if (searchOnField) {
        // Validate searchOnField
        if (!searchFields.includes(searchOnField)) {
          throw {   
            status: false,
            message: `Invalid searchOnField parameter: ${searchOnField}`,
          };
        }

        finalQuery = {
          $and: [{ ...query }, { [searchOnField]: { $regex: regex } }],
        };

      } else if (searchFields.length) {
        // 🔹 Old behavior: search on all fields (unchanged)
        const searchConditions = searchFields.map((field) => ({
          [field]: { $regex: regex },
        }));

        finalQuery = {
          $and: [{ ...query }, { $or: searchConditions }],
        };
      }
    }
    
    let queryExec = model
      .find(finalQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    if (Array.isArray(populate)) {
      populate.forEach((field) => {
        queryExec = queryExec.populate(field);
      });
    } else if (typeof populate === "string") {
      queryExec = queryExec.populate(populate);
    }

    const [data, totalRecords] = await Promise.all([
      queryExec,
      model.countDocuments(finalQuery),
    ]);

    return {
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      pageSize: limit,
      data,
    };
  } catch (error) {
    throw { status: false, message: "Error in pagination", error };
  }
};

module.exports = paginate;
