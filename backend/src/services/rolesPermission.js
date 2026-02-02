const RolePermission = require("../../model/rolesPermission");

// const updateTabPermissionRecursive = (tabs, update) => {

//     for(const tab of tabs){
//         if(tab._id.toString() === update.tabId) {
//             const existingPermissions = tab.permissions?.toObject() || {};
//             const updatedPermissions = {
//                 ...existingPermissions,
//                 ...update.permissions,
//             };

//             tab.permissions = updatedPermissions;
//             tab.show = update.show || false;
//             return true;
//         }

//         if(tab.children && tab.children.length > 0){
//             const updated = updateTabPermissionRecursive(tab.children, update);
//             if(updated) return true;
//         }
//     }
//     return false;
// }
const updateTabPermissionRecursive = (existingTabs, updateTabs) => {
  updateTabs.forEach((update) => {
    let existingTab = existingTabs.find(
      (tab) => tab.tabName === update.tabName
    );

    if (existingTab) {
      if (update.tabId && existingTab._id.toString() === update.tabId) {
        existingTab.show = update.show !== undefined ? update.show : existingTab.show;
        if (update.permissions) {
          existingTab.permissions = {
            ...existingTab.permissions?.toObject(),
            ...update.permissions,
          };
        }
        // Handle sections
        if (update.sections && update.sections.length > 0) {
          existingTab.sections = existingTab.sections || [];
          update.sections.forEach((updateSection) => {
            let existingSection = existingTab.sections.find(
              (section) => section.tabName === updateSection.tabName
            );
            if (existingSection) {
              existingSection.show = updateSection.show !== undefined ? updateSection.show : true;
              existingSection.permissions = {
                ...existingSection.permissions?.toObject(),
                ...updateSection.permissions,
              };
              // Handle subsections (e.g., document types)
              if (
                updateSection.subsections &&
                updateSection.subsections.length > 0
              ) {
                existingSection.subsections = existingSection.subsections || [];
                updateSection.subsections.forEach((updateSubsection) => {
                  let existingSubsection = existingSection.subsections.find(
                    (subsection) =>
                      subsection.tabName === updateSubsection.tabName
                  );
                  if (existingSubsection) {
                    existingSubsection.show =
                      updateSubsection.show !== undefined
                        ? updateSubsection.show
                        : false;
                    existingSubsection.permissions = {
                      ...existingSubsection.permissions?.toObject(),
                      ...updateSubsection.permissions,
                    };
                  } else {
                    existingSection.subsections.push({
                      tabName: updateSubsection.tabName,
                      show:
                        updateSubsection.show !== undefined
                          ? updateSubsection.show
                          : false,
                      permissions: updateSubsection.permissions || {},
                      // _id: updateSubsection.tabId || new mongoose.Types.ObjectId(),
                    });
                  }
                });
                // Remove subsections not in the update payload
                existingSection.subsections =
                  existingSection.subsections.filter((subsection) =>
                    updateSection.subsections.some(
                      (updateSubsection) =>
                        updateSubsection.tabName === subsection.tabName
                    )
                  );
              } else {
                existingSection.subsections = existingSection.subsections || [];
                existingSection.subsections.forEach((subsection) => {
                  subsection.show = false;
                });
              }
            } else {
              existingTab.sections.push({
                tabName: updateSection.tabName,
                show: updateSection.show !== undefined ? updateSection.show : true,
                permissions: updateSection.permissions || {},
                subsections: updateSection.subsections
                  ? updateSection.subsections.map((subsection) => ({
                    tabName: subsection.tabName,
                    show:
                      subsection.show !== undefined ? subsection.show : false,
                    permissions: subsection.permissions || {},
                    // _id: subsection.tabId || new mongoose.Types.ObjectId(),
                  }))
                  : [],
                // _id: updateSection.tabId || new mongoose.Types.ObjectId(),
              });
            }
          });
          // Remove sections not in the update payload
          existingTab.sections = existingTab.sections.filter((section) =>
            update.sections.some((updateSection) => updateSection.tabName === section.tabName
            )
          );
        } else {
          existingTab.sections = existingTab.sections || [];
          existingTab.sections.forEach((section) => {
            section.show = true;
          });
        }
        if (update.children && update.children.length > 0) {
          updateTabPermissionRecursive(existingTab.children, update.children);
        }
      }
    } else {
      const newTab = {
        tabName: update.tabName,
        show: update.show !== undefined ? update.show : false,
        permissions: update.permissions || {},
        children: [],
        sections: update.sections
          ? update.sections.map((section) => ({
            tabName: section.tabName,
            show: section.show !== undefined ? section.show : true,
            permissions: section.permissions || {},
            subsections: section.subsections
              ? section.subsections.map((subsection) => ({
                tabName: subsection.tabName,
                show:
                  subsection.show !== undefined ? subsection.show : false,
                permissions: subsection.permissions || {},
                // _id: subsection.tabId || new mongoose.Types.ObjectId(),
              }))
              : [],
            // _id: section.tabId || new mongoose.Types.ObjectId(),
          }))
          : [],
        // _id: update.tabId || new mongoose.Types.ObjectId(),
      };
      existingTabs.push(newTab);
      if (update.children && update.children.length > 0) {
        updateTabPermissionRecursive(newTab.children, update.children);
      }
    }
  });

  // Remove tabs not in the update payload
  for (let i = existingTabs.length - 1; i >= 0; i--) {
    if (
      !updateTabs.some((update) => update.tabName === existingTabs[i].tabName)
    ) {
      existingTabs.splice(i, 1);
    }
  }
};

const rolePermissionServices = {
  create: async (data) => {
    return await RolePermission.create(data);
  },
  update: async (rolePermissionId, updateData) => {
    const { role, tabs, branchId } = updateData;

    const query = { _id: rolePermissionId };
    if (branchId) query.branchId = branchId;

    const rolePermission = await RolePermission.findOne(query);

    if (!rolePermission)
      throw { status: false, message: "Role Permission not found" };


    if (role) {
      rolePermission.role = role;
    }
    if (branchId) {
      rolePermission.branchId = branchId;
    }
    // Update tabs hierarchically
    updateTabPermissionRecursive(rolePermission.tabs, tabs || []);
    await rolePermission.save();

    return rolePermission;
  },
  getOne: async (id , branchId = null) => {
    const query = { role: id };
  if (branchId) {
    query.branchId = branchId;
  }
  const rolePermission = await RolePermission.findOne(query).populate([
    { path: "role", select: "name" },
    { path: "branchId", select: "name" }
  ]);

  if (!rolePermission)
    throw { status: false, message: "Role Permission not found" };

  return rolePermission;
},
 getAll: async (branchId = null) => {
  const query = {};

  if (branchId) {
    query.branchId = branchId;
  }

  const getAll = await RolePermission.find(query).populate([
    { path: "role", select: "name" },
    { path: "branchId", select: "name" },
  ]);

  if (!getAll || getAll.length === 0)
    throw { status: false, message: "Role Permission not found" };

  return getAll;
}

};

module.exports = rolePermissionServices;
