require("dotenv").config();

const mongoose = require("mongoose");
const Role = require("./model/masters/roles");
const User = require("./model/user");
const StudentApplication = require("./model/masters/studentApplication/studentApplication");

// 1. Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

async function fixSuperAdminIsSubmit() {
  try {
    // 2. Find Super Admin role
    const superAdminRole = await Role.findOne({ name: "Super Admin" });

    if (!superAdminRole) {
      console.log("Super Admin role not found");
      return process.exit();
    }

    // 3. Find all users with Super Admin role
    const superAdmins = await User.find({ role: superAdminRole._id }, { _id: 1 });

    const superAdminIds = superAdmins.map((u) => u._id);

    if (superAdminIds.length === 0) {
      console.log("No Super Admin users found");
      return process.exit();
    }

    console.log("Super Admin Users:", superAdminIds);

    // 4. Update student applications
    const result = await StudentApplication.updateMany(
      {
        created_by: { $in: superAdminIds },
        $or: [{ isSubmit: { $exists: false } }, { isSubmit: false }],
      },
      {
        $set: { isSubmit: true },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} student applications`);

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Start Script
(async () => {
  await connectDB();
  await fixSuperAdminIsSubmit();
})();
