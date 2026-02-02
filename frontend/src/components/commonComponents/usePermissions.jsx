import { decryptData } from "../../utils/encryptionUtils";

const usePermissions = (tabName, sectionName = null, documentType = null) => {
  const rolePermissions =
    decryptData(localStorage.getItem("rolePermissions")) || [];
  const userRole = decryptData(localStorage.getItem("role"));

  const findPermissions = (
    tabs,
    targetTabName,
    targetSectionName = null,
    targetDocumentType = null
  ) => {
    for (const tab of tabs) {
      if (tab.tabName === targetTabName) {
        if (targetSectionName && tab.sections && tab.sections.length > 0) {
          const section = tab.sections.find(
            (sec) => sec.tabName === targetSectionName
          );
          if (section) {
            if (
              targetDocumentType &&
              section.subsections &&
              section.subsections.length > 0
            ) {
              const docType = section.subsections.find(
                (child) => child.tabName === targetDocumentType
              );
              if (docType) {
                return {
                  permissions: docType.permissions,
                  show: docType.show,
                };
              }
              return null; 
            }
            return {
              permissions: section.permissions,
              show: section.show,
            };
          }
          return null;
        }
        return {
          permissions: tab.permissions,
          show: tab.show,
        };
      }
      if (tab.children && tab.children.length > 0) {
        const childPermissions = findPermissions(
          tab.children,
          targetTabName,
          targetSectionName,
          targetDocumentType
        );
        if (childPermissions) return childPermissions;
      }
    }
    return null; // Tab not found
  };

  let result = findPermissions(
    rolePermissions,
    tabName,
    sectionName,
    documentType
  ) || {
    permissions: {
      create: false,
      read: false,
      edit: false,
      delete: false,
      call: false,
      download: false,
      upload: false,
    },
    show: false,
  };

  let permissions = result.permissions;
  let show = result.show;

  if (userRole === "Super Admin") {
    permissions = {
      create: true,
      read: true,
      edit: true,
      delete: true,
      call: true,
      download: true,
      upload: true,
    };
    show = true;
  }

  // Student role
  if ( (userRole === "Student" || userRole === "LeadStudent") && (tabName === "Student Applications" || tabName === "Course Finder")) {
  permissions = {
    create: false,
    read: true,
    edit: false,
    delete: false,
    call: false,
    download: false,
    upload: false,
  };
  show = true;
}

  return {
    canCreate: permissions.create,
    canRead: permissions.read,
    canUpdate: permissions.edit,
    canDelete: permissions.delete,
    canCall: permissions.call,
    canDownload: permissions.download || false,
    canUpload: permissions.upload || false,
    canShow: show,
  };
};

export default usePermissions;
