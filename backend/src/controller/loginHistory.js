const { mongoose } = require("mongoose");
const LoginHistory = require("../../model/loginHistory");
const paginate = require("../../utils/pagination");

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, user, search } = req.query;
    const searchText = search;
    const matchStage = {};

    if (role) matchStage.role = role;
    if (user) matchStage.user = new mongoose.Types.ObjectId(user);

    const pipeline = [
      // Multiple lookups to different user collections
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userFromUsers",
        },
      },
      {
        $lookup: {
          from: "b2badmins", 
          localField: "user",
          foreignField: "_id",
          as: "userFromB2BAdmin",
        },
      },
      {
        $lookup: {
          from: "b2bmembers", 
          localField: "user",
          foreignField: "_id",
          as: "userFromB2BMember",
        },
      },
      {
        $lookup: {
          from: "branchs", 
          localField: "user",
          foreignField: "_id",
          as: "userFromBranch",
        },
      },
      {
        $lookup: {
          from: "branchmembers",
          localField: "user",
          foreignField: "_id",
          as: "userFromBranchMember",
        },
      },
      
      {
        $addFields: {
          originalUserId: "$user"
        }
      },
      
      // Add computed field to get the first non-empty user result with userType
      {
        $addFields: {
          user: {
            $switch: {
              branches: [
                {
                  case: { $gt: [{ $size: "$userFromUsers" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$userFromUsers", 0] },
                      { userType: "user" }
                    ]
                  }
                },
                {
                  case: { $gt: [{ $size: "$userFromB2BAdmin" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$userFromB2BAdmin", 0] },
                      { userType: "b2badmin" }
                    ]
                  }
                },
                {
                  case: { $gt: [{ $size: "$userFromB2BMember" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$userFromB2BMember", 0] },
                      { userType: "b2bmember" }
                    ]
                  }
                },
                {
                  case: { $gt: [{ $size: "$userFromBranch" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$userFromBranch", 0] },
                      { userType: "branch" }
                    ]
                  }
                },
                {
                  case: { $gt: [{ $size: "$userFromBranchMember" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$userFromBranchMember", 0] },
                      { userType: "branchmember" }
                    ]
                  }
                }
              ],
              default: null
            }
          },
          role: "$role"
        }
      },
      
      // Remove the temporary lookup fields but keep originalUserId for filtering
      {
        $project: {
          userFromUsers: 0,
          userFromB2BAdmin: 0,
          userFromB2BMember: 0,
          userFromBranch: 0,
          userFromBranchMember: 0
        }
      },
      
      // Filter out documents where no user was found
      {
        $match: {
          user: { $ne: null }
        }
      }
    ];

    // Apply the original match stage but use originalUserId for user filtering
    const finalMatchStage = {};
    if (role) {
      // Handle role filtering - check both the role name and the role object
      finalMatchStage.$or = [
        { role: role },
        { "role.name": role }
      ];
    }
    if (user) finalMatchStage.originalUserId = new mongoose.Types.ObjectId(user);
    
    if (Object.keys(finalMatchStage).length > 0) {
      pipeline.push({ $match: finalMatchStage });
    }

    // Remove originalUserId from final output
    pipeline.push({
      $project: {
        originalUserId: 0
      }
    });

    // Apply search filter on user.name (case-insensitive)
    if (searchText) {
      pipeline.push({
        $match: {
          "user.name": { $regex: searchText, $options: "i" },
        },
      });
    }

    // Count total documents
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await LoginHistory.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Apply sorting, pagination
    pipeline.push(
      { $sort: { loginTime: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const data = await LoginHistory.aggregate(pipeline);

    // Process the role field to extract name from stringified objects
    const processedData = data.map(item => {
      if (item.role && typeof item.role === 'string' && item.role.includes('name:')) {
        // Extract name from stringified object like "{ _id: new ObjectId('...'), name: 'Super Admin' }"
        const nameMatch = item.role.match(/name:\s*'([^']+)'/);
        if (nameMatch) {
          item.role = nameMatch[1];
        }
      }
      return item;
    });

    res.status(200).json({
      status: true,
      code: 200,
      data: {
        docs: processedData,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        totalDocs: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  getAll,
};