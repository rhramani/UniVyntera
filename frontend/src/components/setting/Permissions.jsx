import { useEffect, useState } from "react";
import { Accordion, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import {
  createRolePermission,
  getOneRolePermission,
  updateRolePermission,
} from "../../redux/actions/RolePermission.action";
import { getAllDocumentType } from "../../redux/actions/Document/DocumentType.action";
import { MENUITEMS } from "../../common/Sidemenu";
import { toast } from "react-toastify";
import Pageheader from "../../layouts/Pageheader";
import { decryptData, encryptData } from "../../utils/encryptionUtils";
import usePermissions from "../commonComponents/usePermissions";
import Select from "react-select";
import { getAllBranch } from "../../redux/actions/Branch.action";

const STUDENT_APPLICATION_SECTIONS = [
  { tabName: "Personal Details", show: false },
  { tabName: "Document", show: false },
  { tabName: "Course Selection", show: false },
  { tabName: "Visa Application", show: false },
  { tabName: "Accountant", show: false },
];

const VISITOR_APPLICATION_SECTIONS = [
  { tabName: "Personal Details", show: false },
  { tabName: "Document", show: false },
  { tabName: "Visa Application", show: false },
  { tabName: "Accountant", show: false },
];

const ADDITIONAL_DOCUMENT_SUBSECTIONS = [
  { tabName: "Other Documents", show: false },
  { tabName: "ZOKEP Documents", show: false },
  { tabName: "Visa Documents", show: false },
];

// Mapping of pages to their additional permissions (Download/Upload)
const PAGE_ADDITIONAL_PERMISSIONS = {
  "Course Finder": { download: true, upload: true },
  "All Leads": { download: true, upload: true },
  "Eligible Students": { download: true, upload: false },
  "University Commissions": { download: true, upload: false },
  "B2B Commission": { download: true, upload: false },
  "Application Fees Invoice": { download: true, upload: false },
  "Payments Invoice": { download: true, upload: false },
  "Contacts": { download: true, upload: true },
  "Add Client Mail": { download: false, upload: true },
  "Currency Rate": { download: false, upload: true },
  "Student Applications": { download: true, upload: false },
  "Document": { download: true, upload: true },
};

// Helper function to check if a page is under Reports
const isReportsPage = (fullPath) => {
  return fullPath.includes("Reports");
};

const getDirectChildren = (fullPath, state) => {
  return Object.keys(state).filter((key) => {
    if (!key.startsWith(`${fullPath}-`)) return false;
    const remaining = key.slice(fullPath.length + 1);
    return !remaining.includes("-");
  });
};

const Permissions = () => {
  const [roles, setRoles] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [checkState, setCheckState] = useState({});
  const [toggleState, setToggleState] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [openMainTab, setOpenMainTab] = useState(null);
  const [openSubTabs, setOpenSubTabs] = useState({});
  const [rolePermissionId, setRolePermissionId] = useState(null);
  const [existingTabs, setExistingTabs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const dispatch = useDispatch();
  const branchId = decryptData(localStorage.getItem("userId"));
  const userRole = decryptData(localStorage.getItem("role"));

  const fetchDocumentTypes = async () => {
    try {
      const response = await dispatch(getAllDocumentType(1, 100, ""));
      setDocumentTypes(response.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast.error("Error fetching document types");
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    const newToggleState = {};
    const newCheckState = {};

    const updateStates = (tabs, parentTitle = "") => {
      tabs.forEach((tab) => {
        const fullPath = parentTitle
          ? `${parentTitle}-${tab.tabName || tab.title}`
          : tab.tabName || tab.title;
        const tabName = tab.tabName || tab.title;
        newToggleState[fullPath] = checked;
        
        const basePermissions = {
          create: checked,
          read: checked,
          edit: checked,
          delete: checked,
        };
        
        // Add download/upload permissions based on page mapping or Reports
        if (PAGE_ADDITIONAL_PERMISSIONS[tabName]) {
          basePermissions.download = PAGE_ADDITIONAL_PERMISSIONS[tabName].download ? checked : false;
          basePermissions.upload = PAGE_ADDITIONAL_PERMISSIONS[tabName].upload ? checked : false;
        } else if (isReportsPage(fullPath) && !tab.children?.length) {
          basePermissions.download = checked;
          basePermissions.upload = false;
        } else {
          basePermissions.download = false;
          basePermissions.upload = false;
        }
        
        newCheckState[fullPath] = basePermissions;

        if (tab.children?.length) {
          updateStates(tab.children, fullPath);
        }

        if (
          tab.title === "Student Applications" ||
          tab.title === "Visitor Applications"
        ) {
          const sections =
            tab.title === "Student Applications"
              ? STUDENT_APPLICATION_SECTIONS
              : VISITOR_APPLICATION_SECTIONS;
          sections.forEach((section) => {
            const sectionPath = `${fullPath}-${section.tabName}`;
            newToggleState[sectionPath] = checked;
            newCheckState[sectionPath] = {
              create: checked,
              read: checked,
              edit: checked,
              delete: checked,
            };

            if (section.tabName === "Document") {
              [...documentTypes, ...ADDITIONAL_DOCUMENT_SUBSECTIONS].forEach(
                (docType) => {
                  const docTypePath = `${sectionPath}-${
                    docType.name || docType.tabName
                  }`;
                  newToggleState[docTypePath] = checked;
                  newCheckState[docTypePath] = {
                    create: checked,
                    read: checked,
                    edit: checked,
                    delete: checked,
                    download: false,
                    upload: false,
                  };
                }
              );
            }
          });
        }
      });
    };

    updateStates(MENUITEMS);
    setToggleState(newToggleState);
    setCheckState(newCheckState);
  };

const fetchRoles = async () => {
  try {
    const isAll = selectedBranch === "all";

    const resolvedBranchId =
      userRole === "Branch"
        ? branchId
        : isAll
        ? ""
        : selectedBranch;

    const showAll =
      userRole === "Branch" ? false : isAll;

    const response = await dispatch(
      getAllRoleList(resolvedBranchId, showAll)
    );

    setRoles(response?.data?.data || []);
  } catch (error) {
    console.error("Error fetching roles:", error);
    toast.error("Error fetching roles");
  }
};


  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  // const initializePermissionStates = (tabs, existingTabs = []) => {
  //   const checkStateUpdate = {};
  //   const toggleStateUpdate = {};

  //   const findExistingTab = (tabName, tabs) => {
  //     return (
  //       tabs.find((t) => t.tabName === tabName) || {
  //         show: false,
  //         permissions: {
  //           create: false,
  //           read: false,
  //           edit: false,
  //           delete: false,
  //         },
  //         children: [],
  //         sections: [],
  //       }
  //     );
  //   };

  //   const traverseTabs = (menuTabs, existingTabs, parent = "", depth = 0) => {
  //     menuTabs.forEach((tab) => {
  //       const tabName = tab.tabName || tab.title;
  //       const tabId = parent ? `${parent}-${tabName}` : tabName;
  //       const existingTab = findExistingTab(tabName, existingTabs);

  //       checkStateUpdate[tabId] = {
  //         create: existingTab.permissions?.create || false,
  //         read: existingTab.permissions?.read || false,
  //         edit: existingTab.permissions?.edit || false,
  //         delete: existingTab.permissions?.delete || false,
  //       };
  //       toggleStateUpdate[tabId] = existingTab.show || false;

  //       if (tab.title === "Student Applications") {
  //         STUDENT_APPLICATION_SECTIONS.forEach((section) => {
  //           const sectionId = `${tabId}-${section.tabName}`;
  //           const existingSection = existingTab.sections?.find(
  //             (s) => s.tabName === section.tabName
  //           ) || {
  //             show: false,
  //             permissions: {
  //               create: false,
  //               read: false,
  //               edit: false,
  //               delete: false,
  //             },
  //             subsections: [],
  //           };

  //           checkStateUpdate[sectionId] = {
  //             create: existingSection.permissions?.create || false,
  //             read: existingSection.permissions?.read || false,
  //             edit: existingSection.permissions?.edit || false,
  //             delete: existingSection.permissions?.delete || false,
  //           };
  //           toggleStateUpdate[sectionId] = existingSection.show || false;

  //           if (section.tabName === "Document") {
  //             [...documentTypes, ...ADDITIONAL_DOCUMENT_SUBSECTIONS].forEach(
  //               (docType) => {
  //                 const docTypeId = `${sectionId}-${
  //                   docType.name || docType.tabName
  //                 }`;
  //                 const existingDocType = existingSection.subsections?.find(
  //                   (s) => s.tabName === (docType.name || docType.tabName)
  //                 ) || {
  //                   show: false,
  //                   permissions: {
  //                     create: false,
  //                     read: false,
  //                     edit: false,
  //                     delete: false,
  //                   },
  //                 };

  //                 checkStateUpdate[docTypeId] = {
  //                   create: existingDocType.permissions?.create || false,
  //                   read: existingDocType.permissions?.read || false,
  //                   edit: existingDocType.permissions?.edit || false,
  //                   delete: existingDocType.permissions?.delete || false,
  //                 };
  //                 toggleStateUpdate[docTypeId] = existingDocType.show || false;
  //               }
  //             );
  //           }
  //         });
  //       }

  //       if (tab.children?.length) {
  //         traverseTabs(
  //           tab.children,
  //           existingTab.children || [],
  //           tabId,
  //           depth + 1
  //         );
  //       }
  //     });
  //   };

  //   traverseTabs(tabs, existingTabs);
  //   setCheckState(checkStateUpdate);
  //   setToggleState(toggleStateUpdate);
  // };

  const initializePermissionStates = (tabs, existingTabs = []) => {
    const checkStateUpdate = {};
    const toggleStateUpdate = {};

    const findExistingTab = (tabName, tabs) => {
      return (
        tabs.find((t) => t.tabName === tabName) || {
          show: false,
          permissions: {
            create: false,
            read: false,
            edit: false,
            delete: false,
          },
          children: [],
          sections: [],
        }
      );
    };

    const traverseTabs = (menuTabs, existingTabs, parent = "", depth = 0) => {
      menuTabs.forEach((tab) => {
        const tabName = tab.tabName || tab.title;
        const tabId = parent ? `${parent}-${tabName}` : tabName;
        const existingTab = findExistingTab(tabName, existingTabs);

        const basePermissions = {
          create: existingTab.permissions?.create || false,
          read: existingTab.permissions?.read || false,
          edit: existingTab.permissions?.edit || false,
          delete: existingTab.permissions?.delete || false,
        };
        
        // Add download/upload permissions based on page mapping or Reports
        if (PAGE_ADDITIONAL_PERMISSIONS[tabName]) {
          basePermissions.download = existingTab.permissions?.download || false;
          basePermissions.upload = existingTab.permissions?.upload || false;
        } else if (isReportsPage(tabId) && !tab.children?.length) {
          basePermissions.download = existingTab.permissions?.download || false;
          basePermissions.upload = false;
        } else {
          basePermissions.download = existingTab.permissions?.download || false;
          basePermissions.upload = existingTab.permissions?.upload || false;
        }
        
        checkStateUpdate[tabId] = basePermissions;
        toggleStateUpdate[tabId] = existingTab.show || false;

        if (
          tab.title === "Student Applications" ||
          tab.title === "Visitor Applications"
        ) {
          const sections =
            tab.title === "Student Applications"
              ? STUDENT_APPLICATION_SECTIONS
              : VISITOR_APPLICATION_SECTIONS;
          sections.forEach((section) => {
            const sectionId = `${tabId}-${section.tabName}`;
            const existingSection = existingTab.sections?.find(
              (s) => s.tabName === section.tabName
            ) || {
              show: false,
              permissions: {
                create: false,
                read: false,
                edit: false,
                delete: false,
              },
              subsections: [],
            };

            checkStateUpdate[sectionId] = {
              create: existingSection.permissions?.create || false,
              read: existingSection.permissions?.read || false,
              edit: existingSection.permissions?.edit || false,
              delete: existingSection.permissions?.delete || false,
              download: existingSection.permissions?.download || false,
              upload: existingSection.permissions?.upload || false,
            };
            toggleStateUpdate[sectionId] = existingSection.show || false;

            // Handle Document subsections
            if (section.tabName === "Document") {
              [...documentTypes, ...ADDITIONAL_DOCUMENT_SUBSECTIONS].forEach(
                (docType) => {
                  const docTypeId = `${sectionId}-${
                    docType.name || docType.tabName
                  }`;
                  const existingDocType = existingSection.subsections?.find(
                    (s) => s.tabName === (docType.name || docType.tabName)
                  ) || {
                    show: false,
                    permissions: {
                      create: false,
                      read: false,
                      edit: false,
                      delete: false,
                    },
                  };

                  checkStateUpdate[docTypeId] = {
                    create: existingDocType.permissions?.create || false,
                    read: existingDocType.permissions?.read || false,
                    edit: existingDocType.permissions?.edit || false,
                    delete: existingDocType.permissions?.delete || false,
                    download: existingDocType.permissions?.download || false,
                    upload: existingDocType.permissions?.upload || false,
                  };
                  toggleStateUpdate[docTypeId] = existingDocType.show || false;
                }
              );
            }
          });
        }

        // Recursively initialize children
        if (tab.children?.length) {
          traverseTabs(
            tab.children,
            existingTab.children || [],
            tabId,
            depth + 1
          );
        }
      });
    };

    traverseTabs(tabs, existingTabs);
    setCheckState(checkStateUpdate);
    setToggleState(toggleStateUpdate);
  };

  useEffect(() => {
    fetchAllBranches();
    fetchDocumentTypes();
    initializePermissionStates(MENUITEMS);
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [selectedBranch]);

  useEffect(() => {
    initializePermissionStates(MENUITEMS, existingTabs);
  }, [documentTypes, existingTabs]);

  const fetchRolePermissions = async (roleId) => {
    try {
      const response = await dispatch(
        getOneRolePermission(roleId, userRole === "Branch" ? branchId : "")
      );
      if (response?.data?.data) {
        const rolePermission = response.data.data;
        setRolePermissionId(rolePermission._id);
        setExistingTabs(rolePermission.tabs || []);
        initializePermissionStates(MENUITEMS, rolePermission.tabs);
      } else {
        setRolePermissionId(null);
        setExistingTabs([]);
        initializePermissionStates(MENUITEMS);
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      if (error?.response?.status === 404) {
        setRolePermissionId(null);
        setExistingTabs([]);
        initializePermissionStates(MENUITEMS);
      } else {
        toast.error(
          error?.response?.data?.message || "Error fetching permissions"
        );
      }
    }
  };

  const handlePermissionChange = (menuTitle, permissionType, isChecked) => {
    setCheckState((prevCheck) => {
      const newCheck = {
        ...prevCheck,
        [menuTitle]: {
          ...prevCheck[menuTitle],
          [permissionType]: isChecked,
        },
      };

      const allFalse = ["create", "read", "edit", "delete", "download", "upload"].every(
        (p) => !newCheck[menuTitle][p]
      );

      setToggleState((prevToggle) => {
        const newToggle = { ...prevToggle };

        if (isChecked) {
          newToggle[menuTitle] = true;
          let current = menuTitle;
          while (current) {
            const parts = current.split("-");
            parts.pop();
            current = parts.join("-");
            if (current) {
              newToggle[current] = true;
            }
          }
        } else if (allFalse) {
          newToggle[menuTitle] = false;
          let current = menuTitle;
          while (current) {
            const parts = current.split("-");
            parts.pop();
            const parent = parts.join("-");
            if (parent) {
              const children = getDirectChildren(parent, newToggle);
              const allChildrenOff = children.every((c) => !newToggle[c]);
              if (allChildrenOff) {
                newToggle[parent] = false;
                newCheck[parent] = {
                  create: false,
                  read: false,
                  edit: false,
                  delete: false,
                  download: false,
                  upload: false,
                };
              } else {
                break;
              }
              current = parent;
            } else {
              break;
            }
          }
        }

        return newToggle;
      });

      return newCheck;
    });
  };

  // const handleToggleChange = (menuTitle, isChecked) => {
  //   setToggleState((prev) => {
  //     const newToggleState = { ...prev, [menuTitle]: isChecked };
  //     const newCheckState = { ...checkState };

  //     if (isChecked) {
  //       const parentTitles = menuTitle.split("-").slice(0, -1);
  //       let currentParent = "";
  //       parentTitles.forEach((part) => {
  //         currentParent = currentParent ? `${currentParent}-${part}` : part;
  //         newToggleState[currentParent] = true;
  //       });
  //     }

  //     const updateSpecificToggle = (tabs, parentTitle = "") => {
  //       tabs.forEach((tab) => {
  //         const fullPath = parentTitle
  //           ? `${parentTitle}-${tab.tabName || tab.title}`
  //           : tab.tabName || tab.title;

  //         if (fullPath === menuTitle || fullPath.startsWith(menuTitle + "-")) {
  //           newToggleState[fullPath] = isChecked;

  //           if (
  //             !tab.children?.length ||
  //             fullPath.includes("Student Applications")
  //           ) {
  //             newCheckState[fullPath] = {
  //               create: isChecked,
  //               read: isChecked,
  //               edit: isChecked,
  //               delete: isChecked,
  //             };
  //           }

  //           if (
  //             fullPath === menuTitle &&
  //             tab.title === "Student Applications"
  //           ) {
  //             STUDENT_APPLICATION_SECTIONS.forEach((section) => {
  //               const sectionPath = `${fullPath}-${section.tabName}`;
  //               if (sectionPath === menuTitle) {
  //                 newToggleState[sectionPath] = isChecked;
  //                 newCheckState[sectionPath] = {
  //                   create: isChecked,
  //                   read: isChecked,
  //                   edit: isChecked,
  //                   delete: isChecked,
  //                 };

  //                 if (
  //                   section.tabName === "Document" &&
  //                   sectionPath === menuTitle
  //                 ) {
  //                   [
  //                     ...documentTypes,
  //                     ...ADDITIONAL_DOCUMENT_SUBSECTIONS,
  //                   ].forEach((docType) => {
  //                     const docTypePath = `${sectionPath}-${
  //                       docType.name || docType.tabName
  //                     }`;
  //                     newToggleState[docTypePath] = isChecked;
  //                     newCheckState[docTypePath] = {
  //                       create: isChecked,
  //                       read: isChecked,
  //                       edit: isChecked,
  //                       delete: isChecked,
  //                     };
  //                   });
  //                 }
  //               }
  //             });
  //           }

  //           if (tab.children?.length) {
  //             updateSpecificToggle(tab.children, fullPath);
  //           }
  //         }
  //       });
  //     };

  //     updateSpecificToggle(MENUITEMS);
  //     setCheckState(newCheckState);
  //     return newToggleState;
  //   });
  // };

  const handleToggleChange = (menuTitle, isChecked) => {
    setToggleState((prevToggle) => {
      const newToggleState = { ...prevToggle };
      const newCheckState = { ...checkState };

      const setDescendants = (path, value) => {
        const tabName = path.split("-").pop();
        const basePerms = {
          create: value,
          read: value,
          edit: value,
          delete: value,
        };
        
        // Check if this path has children (not a leaf node)
        const hasChildren = Object.keys(newToggleState).some(key => 
          key.startsWith(`${path}-`) && !key.slice(path.length + 1).includes("-")
        );
        
        // Add download/upload based on page mapping or Reports
        if (PAGE_ADDITIONAL_PERMISSIONS[tabName]) {
          basePerms.download = PAGE_ADDITIONAL_PERMISSIONS[tabName].download ? value : false;
          basePerms.upload = PAGE_ADDITIONAL_PERMISSIONS[tabName].upload ? value : false;
        } else if (isReportsPage(path) && !hasChildren) {
          basePerms.download = value;
          basePerms.upload = false;
        } else {
          basePerms.download = false;
          basePerms.upload = false;
        }
        
        newToggleState[path] = value;
        newCheckState[path] = basePerms;
        
        Object.keys(newToggleState).forEach((key) => {
          if (key.startsWith(`${path}-`)) {
            const childTabName = key.split("-").pop();
            const childHasChildren = Object.keys(newToggleState).some(k => 
              k.startsWith(`${key}-`) && !k.slice(key.length + 1).includes("-")
            );
            const childBasePerms = {
              create: value,
              read: value,
              edit: value,
              delete: value,
            };
            
            if (PAGE_ADDITIONAL_PERMISSIONS[childTabName]) {
              childBasePerms.download = PAGE_ADDITIONAL_PERMISSIONS[childTabName].download ? value : false;
              childBasePerms.upload = PAGE_ADDITIONAL_PERMISSIONS[childTabName].upload ? value : false;
            } else if (isReportsPage(key) && !childHasChildren) {
              childBasePerms.download = value;
              childBasePerms.upload = false;
            } else {
              childBasePerms.download = false;
              childBasePerms.upload = false;
            }
            
            newToggleState[key] = value;
            newCheckState[key] = childBasePerms;
          }
        });
      };

      setDescendants(menuTitle, isChecked);

      if (isChecked) {
        let current = menuTitle;
        while (current) {
          const parts = current.split("-");
          parts.pop();
          current = parts.join("-");
          if (current) {
            newToggleState[current] = true;
          }
        }
      } else {
        let current = menuTitle;
        while (current) {
          const parts = current.split("-");
          parts.pop();
          const parent = parts.join("-");
          if (parent) {
            const children = getDirectChildren(parent, newToggleState);
            const allOff = children.every((child) => !newToggleState[child]);
            if (allOff) {
              newToggleState[parent] = false;
              newCheckState[parent] = {
                create: false,
                read: false,
                edit: false,
                delete: false,
                download: false,
                upload: false,
              };
              current = parent;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }

      setCheckState(newCheckState);
      return newToggleState;
    });
  };

  const resetFormState = () => {
    setCheckState({});
    setToggleState({});
    setSelectedRole("");
    setOpenMainTab(null);
    setOpenSubTabs({});
    setRolePermissionId(null);
    setExistingTabs([]);
    setSelectAll(false);
    initializePermissionStates(MENUITEMS);
  };

  const buildTabsPayload = (
    items,
    existingTabs,
    parentTitle = "",
    parentTabId = null,
    depth = 0
  ) => {
    return items.map((item) => {
      const tabName = item.tabName || item.title;
      const tabId = parentTitle ? `${parentTitle}-${tabName}` : tabName;
      const existingTab =
        existingTabs.find((tab) => tab.tabName === tabName) || null;

      const tabData = {
        tabName,
        show: toggleState[tabId] || false,
      };

      if (depth === 2 || !item.children?.length) {
        const basePerms = checkState[tabId] || {
          create: false,
          read: false,
          edit: false,
          delete: false,
          download: false,
          upload: false,
        };
        
        // Ensure download/upload are included based on page mapping or Reports
        if (PAGE_ADDITIONAL_PERMISSIONS[tabName]) {
          basePerms.download = basePerms.download || false;
          basePerms.upload = basePerms.upload || false;
        } else if (isReportsPage(tabId) && !item.children?.length) {
          basePerms.download = basePerms.download || false;
          basePerms.upload = false;
        }
        
        tabData.permissions = basePerms;
      } else {
        tabData.permissions = {};
      }

      if (existingTab) {
        tabData.tabId = existingTab._id?.toString();
      } else if (parentTabId) {
        tabData.parentTabId = parentTabId;
      }

      if (
        item.title === "Student Applications" ||
        item.title === "Visitor Applications"
      ) {
        const sections =
          item.title === "Student Applications"
            ? STUDENT_APPLICATION_SECTIONS
            : VISITOR_APPLICATION_SECTIONS;
        tabData.sections = sections.map((section) => {
          const sectionId = `${tabId}-${section.tabName}`;
          const existingSection = existingTab?.sections?.find(
            (s) => s.tabName === section.tabName
          ) || {
            show: false,
            permissions: {
              create: false,
              read: false,
              edit: false,
              delete: false,
            },
            subsections: [],
          };

          const sectionData = {
            tabName: section.tabName,
            show: toggleState[sectionId] || false,
            permissions: checkState[sectionId] || {
              create: false,
              read: false,
              edit: false,
              delete: false,
              download: false,
              upload: false,
            },
          };

          if (section.tabName === "Document") {
            sectionData.subsections = [
              ...documentTypes,
              ...ADDITIONAL_DOCUMENT_SUBSECTIONS,
            ]
              .filter((docType) => {
                const docTypeId = `${sectionId}-${
                  docType.name || docType.tabName
                }`;
                return toggleState[docTypeId];
              })
              .map((docType) => {
                const docTypeId = `${sectionId}-${
                  docType.name || docType.tabName
                }`;
                const existingDocType = existingSection.subsections?.find(
                  (s) => s.tabName === (docType.name || docType.tabName)
                ) || {
                  show: false,
                  permissions: {
                    create: false,
                    read: false,
                    edit: false,
                    delete: false,
                  },
                };

                const docTypeData = {
                  tabName: docType.name || docType.tabName,
                  show: toggleState[docTypeId] || false,
                  permissions: checkState[docTypeId] || {
                    create: false,
                    read: false,
                    edit: false,
                    delete: false,
                    download: false,
                    upload: false,
                  },
                };

                if (existingDocType) {
                  docTypeData.tabId = existingDocType._id?.toString();
                }

                return docTypeData;
              });
          }

          if (existingSection) {
            sectionData.tabId = existingSection._id?.toString();
          }

          return sectionData;
        });
      }

      tabData.children = item.children?.length
        ? buildTabsPayload(
            item.children,
            existingTab ? existingTab.children || [] : [],
            tabId,
            existingTab ? existingTab._id?.toString() : parentTabId,
            depth + 1
          )
        : [];

      return tabData;
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) {
      toast.error("Please select role");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        role: selectedRole,
        ...(userRole === "Branch" && { branchId }),
        tabs: buildTabsPayload(MENUITEMS, existingTabs),
      };

      let response;
      if (rolePermissionId) {
        response = await dispatch(
          updateRolePermission(rolePermissionId, payload)
        );
        if (response?.status === 200) {
          toast.success("Permissions updated successfully");
        }
      } else {
        response = await dispatch(createRolePermission(payload));
        if (response?.status === 201) {
          setRolePermissionId(response.data.data._id);
          toast.success("Permissions created successfully");
        }
      }

      await fetchRolePermissions(
        selectedRole,
        userRole === "Branch" ? branchId : ""
      );
      resetFormState();
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error(error?.response?.data?.message || "Error saving permissions");
    } finally {
      setIsSaving(false);
    }
  };

  const renderMenuItems = (
    tabs,
    parentTitle = "",
    isSub = false,
    depth = 0
  ) => {
    return tabs.map((tab, index) => {
      const displayName = tab.tabName || tab.title;
      const fullPath = parentTitle
        ? `${parentTitle}-${displayName}`
        : displayName;
      const itemId = `${fullPath}-${index}`;

      const permissions = usePermissions(
        displayName,
        parentTitle.includes("Student Applications") ||
          parentTitle.includes("Visitor Applications")
          ? displayName !== "Student Applications" &&
            displayName !== "Visitor Applications"
            ? parentTitle.split("-")[parentTitle.split("-").length - 1]
            : null
          : null,
        parentTitle.includes("Student Applications-Document") ||
          parentTitle.includes("Visitor Applications-Document")
          ? displayName
          : null
      );

      const isMainTab = !isSub && !parentTitle;
      const isOpen = isMainTab
        ? openMainTab === displayName
        : openSubTabs[parentTitle] === displayName;

      const isApplicationSection =
        (parentTitle.includes("Student Applications") ||
          parentTitle.includes("Visitor Applications")) &&
        (STUDENT_APPLICATION_SECTIONS.some(
          (section) => section.tabName === displayName
        ) ||
          VISITOR_APPLICATION_SECTIONS.some(
            (section) => section.tabName === displayName
          ));

      const isDocumentType =
        (parentTitle.includes("Student Applications-Document") ||
          parentTitle.includes("Visitor Applications-Document")) &&
        [
          ...documentTypes.map((dt) => dt.name),
          ...ADDITIONAL_DOCUMENT_SUBSECTIONS.map((ds) => ds.tabName),
        ].includes(displayName);

      const handleAccordionToggle = () => {
        if (isMainTab) {
          setOpenMainTab(openMainTab === displayName ? null : displayName);
        } else {
          setOpenSubTabs((prev) => ({
            ...prev,
            [parentTitle]:
              prev[parentTitle] === displayName ? null : displayName,
          }));
        }
      };

      const showCheckboxes =
        (depth === 2 || !tab.children?.length) &&
        // !isApplicationSection &&
        !isDocumentType;
      
      // Check if this page should show Download/Upload checkboxes
      const shouldShowDownload = 
        PAGE_ADDITIONAL_PERMISSIONS[displayName]?.download || 
        (isReportsPage(fullPath) && !tab.children?.length);
      const shouldShowUpload = PAGE_ADDITIONAL_PERMISSIONS[displayName]?.upload;

      if (isDocumentType) {
        const docTypePermissions = usePermissions(
          parentTitle.includes("Student Applications")
            ? "Student Applications"
            : "Visitor Applications",
          "Document",
          displayName
        );
        if (!docTypePermissions.canShow && userRole !== "Super Admin")
          return null;

        return (
          <Card key={itemId} className="mb-2 ms-5">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{displayName}</strong>
                <Form.Check
                  type="switch"
                  id={`switch-${itemId}`}
                  checked={toggleState[fullPath] || false}
                  onChange={(e) =>
                    handleToggleChange(fullPath, e.target.checked)
                  }
                />
              </div>
              {/* <Form>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    {["Create", "Read", "Edit", "Delete"].map((perm) => {
                      const permissionKey = perm === "Edit" ? "canUpdate" : `can${perm}`;
                      return (
                        <Form.Check
                          key={perm}
                          type="checkbox"
                          id={`${fullPath}-${perm}`}
                          label={perm}
                          checked={checkState[fullPath]?.[perm.toLowerCase()] || false}
                          onChange={(e) =>
                            handlePermissionChange(
                              fullPath,
                              perm.toLowerCase(),
                              e.target.checked
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </Form> */}
            </Card.Body>
          </Card>
        );
      }

      if (isApplicationSection) {
        const sectionPermissions = usePermissions(
          parentTitle.includes("Student Applications")
            ? "Student Applications"
            : "Visitor Applications",
          displayName
        );
        if (!sectionPermissions.canShow && userRole !== "Super Admin")
          return null;

        return (
          <Accordion
            key={itemId}
            className="mb-2 ms-4"
            activeKey={isOpen ? "0" : null}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header onClick={handleAccordionToggle}>
                <div className="w-100 d-flex justify-content-between align-items-center">
                  <strong>{displayName}</strong>
                  <Form.Check
                    type="switch"
                    id={`switch-${itemId}`}
                    checked={toggleState[fullPath] || false}
                    onChange={(e) =>
                      handleToggleChange(fullPath, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </Accordion.Header>
              <Accordion.Body>{parentTitle.includes("Student Applications") && (
                <Form>
                    <div className="d-flex flex-wrap gap-3 mt-2">
                      {(
      displayName === "Document"
        ? ["Create", "Read", "Edit", "Delete", "Download"]
        : ["Create", "Read", "Edit", "Delete"]
    ).map((perm) => {
                        const permissionKey = perm === "Edit" ? "canUpdate" : `can${perm}`;
                        return (
                          <Form.Check
                            key={perm}
                            type="checkbox"
                            id={`${fullPath}-${perm}`}
                            label={perm}
                            checked={checkState[fullPath]?.[perm.toLowerCase()] || false}
                            onChange={(e) =>
                              handlePermissionChange(
                                fullPath,
                                perm.toLowerCase(),
                                e.target.checked
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  </Form>)}
                {displayName === "Document" && (
                  <div className="ms-4">
                    {renderMenuItems(
                      [
                        ...documentTypes.map((docType) => ({
                          tabName: docType.name,
                        })),
                        ...ADDITIONAL_DOCUMENT_SUBSECTIONS,
                      ],
                      fullPath,
                      true,
                      depth + 1
                    )}
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        );
      }

      if (!permissions.canShow && userRole !== "Super Admin") return null;

      return (
        <Accordion
          key={itemId}
          className="mb-2"
          activeKey={isOpen ? "0" : null}
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header onClick={handleAccordionToggle}>
              <div className="w-100 d-flex justify-content-between align-items-center">
                <strong>{displayName}</strong>
                <Form.Check
                  type="switch"
                  id={`switch-${itemId}`}
                  checked={toggleState[fullPath] || false}
                  onChange={(e) =>
                    handleToggleChange(fullPath, e.target.checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </Accordion.Header>
            <Accordion.Body>
              {showCheckboxes && (
                <Form>
                  <div className="d-flex flex-wrap gap-3">
                    {["Create", "Read", "Edit", "Delete"]
                      .filter((perm) => {
                        const permissionKey =
                          perm === "Edit" ? "canUpdate" : `can${perm}`;
                        return (
                          permissions[permissionKey] ||
                          userRole === "Super Admin"
                        );
                      })
                      .map((perm) => (
                        <Form.Check
                          key={perm}
                          type="checkbox"
                          // className="custom-checkbox"
                          id={`${fullPath}-${perm}`}
                          label={perm}
                          checked={
                            checkState[fullPath]?.[perm.toLowerCase()] || false
                          }
                          onChange={(e) =>
                            handlePermissionChange(
                              fullPath,
                              perm.toLowerCase(),
                              e.target.checked
                            )
                          }
                        />
                      ))}
                    {shouldShowDownload && (
                      <Form.Check
                        type="checkbox"
                        id={`${fullPath}-download`}
                        label="Download"
                        checked={checkState[fullPath]?.download || false}
                        onChange={(e) =>
                          handlePermissionChange(
                            fullPath,
                            "download",
                            e.target.checked
                          )
                        }
                      />
                    )}
                    {shouldShowUpload && (
                      <Form.Check
                        type="checkbox"
                        id={`${fullPath}-upload`}
                        label="Upload"
                        checked={checkState[fullPath]?.upload || false}
                        onChange={(e) =>
                          handlePermissionChange(
                            fullPath,
                            "upload",
                            e.target.checked
                          )
                        }
                      />
                    )}
                  </div>
                </Form>
              )}
              {(tab.title === "Student Applications" ||
                tab.title === "Visitor Applications") && (
                <div className="ms-4">
                  {renderMenuItems(
                    tab.title === "Student Applications"
                      ? STUDENT_APPLICATION_SECTIONS
                      : VISITOR_APPLICATION_SECTIONS,
                    fullPath,
                    true,
                    depth + 1
                  )}
                </div>
              )}
              {tab.children?.length > 0 && (
                <div className="ms-4">
                  {renderMenuItems(
                    tab.children.map((child) => ({
                      ...child,
                      tabName: child.tabName || child.title,
                    })),
                    fullPath,
                    true,
                    depth + 1
                  )}
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
    });
  };

  const handleRoleChange = async (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);

    if (!roleId) {
      resetFormState();
      return;
    }

    resetFormState();
    setSelectedRole(roleId);

    await fetchRolePermissions(roleId);
  };

  const handleBranchChange = async (selectedOption) => {
    const branchId = selectedOption?.value || "";
    setSelectedBranch(branchId);
    setSelectedRole("");
    resetFormState();
  };

  return (
    <>
      <Pageheader
        mainheading="Permissions"
        parentfolder="Settings"
        activepage="Permissions"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 mt-2 d-flex justify-content-between align-items-center">
                <div className="card-title"></div>
                <div className="d-flex gap-3">
                  <div>
                    {selectedRole &&
                      roles.find((role) => role._id === selectedRole)?.name ===
                        "Super Admin" && (
                        <Form.Check
                          className="custom-checkbox"
                          type="checkbox"
                          id="select-all-permissions"
                          label="Select All"
                          checked={selectAll}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      )}
                  </div>
                  {userRole === "Super Admin" && (
                    <div className="d-flex gap-3">
                      <Select
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                            width: "200px",
                          }),
                        }}
                        placeholder="Select Branch"
                        classNamePrefix="custom-select"
  options={[
    { value: "all", label: "All" },          // ✅ ADDED
    { value: "", label: "Head Office" },
    ...(Array.isArray(branchList)
      ? branchList
          .filter(
            (branch) => branch.name && branch.name.trim() !== ""
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((branch) => ({
            value: branch._id,
            label: branch.name,
          }))
      : []),
  ]}
  value={
    selectedBranch !== null && selectedBranch !== undefined
      ? {
          value: selectedBranch,
          label:
            selectedBranch === "all"
              ? "All"
              : selectedBranch === ""
              ? "Head Office"
              : branchList.find(
                  (branch) => branch._id === selectedBranch
                )?.name || "Select Branch",
        }
      : null
  }
                        onChange={handleBranchChange}
                      />
                      <Select
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                            width: "200px",
                          }),
                        }}
                        placeholder="Select Role"
                        classNamePrefix="custom-select"
                        isClearable
                        options={[
                          ...roles
                            .sort((a, b) => a.name?.localeCompare(b.name))
                            .map((role) => ({
                              value: role._id,
                              label: role.name,
                            })),
                        ]}
                        value={
                          selectedRole
                            ? {
                                value: selectedRole,
                                label:
                                  roles.find(
                                    (role) => role._id === selectedRole
                                  )?.name || "Select Role",
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const roleId = selectedOption?.value || "";
                          handleRoleChange({ target: { value: roleId } });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {userRole !== "Super Admin" && (
                <Form.Group className="mb-4">
                  <Form.Label>Select Role</Form.Label>
                  <Form.Select value={selectedRole} onChange={handleRoleChange}>
                    <option value="">-- Select Role --</option>
                    {roles
                      ?.sort((a, b) => a.name?.localeCompare(b.name))
                      ?.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              )}

              {renderMenuItems(
                MENUITEMS.map((item) => ({
                  ...item,
                  tabName: item.title,
                  show: false,
                  permissions: {},
                  children: item.children || [],
                }))
              )}

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="primary"
                  className="custom-select-height"
                  onClick={handleSavePermissions}
                  disabled={!selectedRole || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Permissions"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Permissions;
