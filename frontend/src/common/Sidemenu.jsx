import { decryptData } from "../utils/encryptionUtils";

// const rolePermissions = JSON.parse(
//   localStorage.getItem("rolePermissions") || "[]"
// );
const rolePermissions =
  decryptData(localStorage.getItem("rolePermissions")) || [];

const allAllowedTabs = [];

const getTabs = (tabs) => {
  tabs?.forEach((perm) => {
    if (perm.show) {
      allAllowedTabs.push(perm.tabName);
    }

    if (perm.children?.length) {
      perm.children.forEach((child) => {
        if (child.show) {
          allAllowedTabs.push(child.tabName);
        }

        if (child.children?.length) {
          getTabs(child.children);
        }
      });
    }
  });
};
getTabs(rolePermissions);

export const rawMenuItems = [
  {
    path: `${import.meta.env.BASE_URL}dashboard`,
    title: "Dashboard",
    icon: "ti-home",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  {
    path: `${import.meta.env.BASE_URL}coursefinder`,
    title: "Course Finder",
    icon: "ti-search",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  {
    title: "Leads",
    icon: "ti-id-badge",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}lead/allleads?openModal=true`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Add Leads",
      },
      {
        path: `${import.meta.env.BASE_URL}lead/allleads`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "All Leads",
      },
      // {
      //   path: `${import.meta.env.BASE_URL}lead/aiCallLead`,
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   dirchange: false,
      //   title: "AI Call Leads",
      // },
      {
        path: `${import.meta.env.BASE_URL}lead/allocatedleads`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Allocated Leads",
      },
      {
        path: `${import.meta.env.BASE_URL}lead/todayfollowup`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Today Followup",
      },
      {
        path: `${import.meta.env.BASE_URL}lead/allfollowup`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "All Followup",
      },
      {
        path: `${import.meta.env.BASE_URL}lead/overduefollowup`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Over Due Followup",
      },
      {
        path: `${import.meta.env.BASE_URL}lead/todaysbirthday`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Today's Birthday",
      },
      {
        path: `${import.meta.env.BASE_URL}lead/b2bleads`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "B2B Leads",
      },
    ],
  },
  {
    title: "Applications",
    icon: "ti-book",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}student/studentapplication`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Student Applications",
      },
      {
        title: "Coaching Applications",
        icon: "ti-receipt",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}student/coachingstudents`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Coaching Students",
          },
          // {
          //   path: `${import.meta.env.BASE_URL}student/followupstudents`,
          //   type: "link",
          //   active: false,
          //   selected: false,
          //   dirchange: false,
          //   title: "Followup Students",
          // },
          {
            path: `${import.meta.env.BASE_URL}student/attendance`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Attendance",
          },
          {
            path: `${import.meta.env.BASE_URL}student/pastattendance`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Past Attendance",
          },
        ],
      },
      {
        path: `${import.meta.env.BASE_URL}student/visitorapplication`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Visitor Applications",
      },
    ],
  },
  {
    title: "Accountants",
    icon: "ti-receipt",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}accountant/eligiblestudents`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Eligible Students",
      },
      {
        path: `${import.meta.env.BASE_URL}accountant/universitycommission`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "University Commissions",
      },
      {
        path: `${import.meta.env.BASE_URL}accountant/b2bcommission`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "B2B Commission",
      },
      {
        path: `${import.meta.env.BASE_URL}accountant/applicationfeesinvoices`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Application Fees Invoice",
      },
      {
        path: `${import.meta.env.BASE_URL}accountant/expenses`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Expenses",
      },
      {
        path: `${import.meta.env.BASE_URL}accountant/paymentinvoice`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Payments Invoice",
      },
      {
        path: `${import.meta.env.BASE_URL}accountant/totalbalance`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Total Balance",
      },
    ],
  },
  {
    title: "Task Management",
    icon: "ti-receipt",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}taskmanagement/taskdetails`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Task Details",
      },
      // {
      //   path: `${import.meta.env.BASE_URL}taskmanagement/assignmentdetails`,
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   dirchange: false,
      //   title: "Assignment Details",
      // },
    ],
  },
  {
    path: `${import.meta.env.BASE_URL}educationloaninquiry`,
    title: "Education Loan Inquiry",
    icon: "bi bi-question-circle",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  {
    title: "Reports",
    icon: "bi bi-clipboard-data",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        title: "Accountant",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          // {
          //   path: `${import.meta.env.BASE_URL}reports/accountant`,
          //   type: "link",
          //   active: false,
          //   selected: false,
          //   dirchange: false,
          //   title: "Accountant",
          // },
          {
            path: `${import.meta.env.BASE_URL}accountant/finalstudent`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Final Student",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/partnercommission`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Partner Commission",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/pendingb2binvoice`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Pending B2B Invoice",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/partnerconversion`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Partner Conversion",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/feespayment`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Fee Payment",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/financesummary`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Finance Summary",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/universitypayment`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "University Payment",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/applicationfees`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Application Fees",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/expenses`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Accountant Expenses",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/payments`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Payment Invoice",
          },
        ],
      },
      {
        title: "Overall Reports",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}reports/overallreports/overall`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Overall",
          },
          {
            path: `${import.meta.env.BASE_URL}reports/overallreports/leadfrom`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Lead From",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/visanumbercounselor`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Visa Number Counselor",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/counselorperformance`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Counselor Performance",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/branchwiseadmissions`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Branch Wise Admissions",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/branchperformance`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Branch Performance",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/collectionpayment`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Collection Payment",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/expensesreport`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Expenses ",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/admissionreport`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Day wise Admission",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/visaCollection`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Visa Collection",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/visitorVisaReport`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Visitor Visa",
          },
          {
            path: `${
              import.meta.env.BASE_URL
            }reports/overallreports/coachingreport`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Coaching Report",
          },
        ],
      },
      {
        path: `${import.meta.env.BASE_URL}reports/leadreports`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Lead",
      },
      {
        path: `${import.meta.env.BASE_URL}reports/studentapplicationreports`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Student Application",
      },
      {
        path: `${import.meta.env.BASE_URL}reports/MostPreferredCourses`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Most Preferred Courses",
      },
      {
        path: `${import.meta.env.BASE_URL}reports/pendingagreement`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Pending Agreement",
      },
      {
        path: `${import.meta.env.BASE_URL}reports/universitycommission`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "University Commission",
      },
      {
        path: `${import.meta.env.BASE_URL}reports/visaprocess`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Visa Process",
      },
    ],
  },
  {
    path: `${import.meta.env.BASE_URL}announcements`,
    title: "Announcements",
    icon: "ti-announcement",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  {
    title: "WA Daddy",
    icon: "ti-id-badge",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}contacts`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Contacts",
      },
      {
        path: `${import.meta.env.BASE_URL}campaigns`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Campaigns",
      },
      {
        path: `${import.meta.env.BASE_URL}templates`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Templates",
      },
      {
        path: `${import.meta.env.BASE_URL}chatmessage`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Chat",
      },
    ],
  },
  {
    path: `${import.meta.env.BASE_URL}promotionalmeterials`,
    title: "Promotional Materials",
    icon: "bi bi-file-earmark-text",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  {
    // path: `${import.meta.env.BASE_URL}promotionaltutorial`,
    title: "Promotional Tutorials",
    icon: "bi bi-play-btn",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}promotionaltutorial/webinar`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Webinar",
      },
      {
        path: `${import.meta.env.BASE_URL}promotionaltutorial/ppt`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "PPT",
      },
    ],
  },
  {
    path: `${import.meta.env.BASE_URL}socialmediapromotion`,
    title: "Social Media Promotions",
    icon: "bi bi-megaphone",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  {
    path: `${import.meta.env.BASE_URL}tutorial`,
    title: "CRM Tutorials",
    icon: "bi bi-play-btn-fill",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  // {
  //   path: `${import.meta.env.BASE_URL}applicationtracker`,
  //   title: "Application Tracker",
  //   icon: "ti-announcement",
  //   type: "link",
  //   active: false,
  //   selected: false,
  //   dirchange: false,
  // },
  {
    path: `${import.meta.env.BASE_URL}usermanagement`,
    title: "User Management",
    icon: "bi bi-person",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },
  {
    title: "Branches",
    icon: "bi bi-diagram-3",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}branches/addbranch`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Add Branches",
      },
      {
        path: `${import.meta.env.BASE_URL}branches/branchmember`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Branch Member",
      },
    ],
  },
  {
    title: "B2B Users",
    icon: "ti-user",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}b2busers/b2badmin`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "B2B Admin",
      },
      {
        path: `${import.meta.env.BASE_URL}b2busers/member`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "B2B Team Member",
      },
    ],
  },
  {
    title: "Master",
    icon: "bi bi-list",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      // { path: `${import.meta.env.BASE_URL}master/configureemail`, type: "link", active: false, selected: false, dirchange: false, title: "Configure Email" },
      // { path: `${import.meta.env.BASE_URL}master/smstemplates`, type: "link", active: false, selected: false, dirchange: false, title: "Sms Templates" },
      // { path: `${import.meta.env.BASE_URL}master/emailtemplates`, type: "link", active: false, selected: false, dirchange: false, title: "Email Templates" },
      // { path: `${import.meta.env.BASE_URL}master/whatsapptemplates`, type: "link", active: false, selected: false, dirchange: false, title: "Whatsapp Templates" },
      // { path: `${import.meta.env.BASE_URL}master/campaigns`, type: "link", active: false, selected: false, dirchange: false, title: "Campaigns" },
      // { path: `${import.meta.env.BASE_URL}master/collegeagent`, type: "link", active: false, selected: false, dirchange: false, title: "College Agent" },
      // { path: `${import.meta.env.BASE_URL}master/country`, type: "link", active: false, selected: false, dirchange: false, title: "Country" },
      // { path: `${import.meta.env.BASE_URL}master/addcountryprocess`, type: "link", active: false, selected: false, dirchange: false, title: "Add Country Process" },
      // { path: `${import.meta.env.BASE_URL}master/intake`, type: "link", active: false, selected: false, dirchange: false, title: "Intake" },
      // { path: `${import.meta.env.BASE_URL}master/state`, type: "link", active: false, selected: false, dirchange: false, title: "State" },
      // { path: `${import.meta.env.BASE_URL}master/city`, type: "link", active: false, selected: false, dirchange: false, title: "City" },
      {
        title: "Course",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}master/campus`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Campus",
          },
          {
            path: `${import.meta.env.BASE_URL}master/qualification`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Qualification",
          },
          {
            path: `${import.meta.env.BASE_URL}master/stream`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Stream",
          },
          {
            path: `${import.meta.env.BASE_URL}master/institute`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Institute",
          },
          {
            path: `${import.meta.env.BASE_URL}master/directinstitute`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Direct Institute",
          },
          // { path: `${import.meta.env.BASE_URL}master/course`, type: "link", active: false, selected: false, dirchange: false, title: "Course" },
          {
            path: `${import.meta.env.BASE_URL}master/programlevel`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Program Level",
          },
          // { path: `${import.meta.env.BASE_URL}master/studyarea`, type: "link", active: false, selected: false, dirchange: false, title: "Study Area" },
          {
            path: `${import.meta.env.BASE_URL}master/requirements`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Requirements",
          },
          {
            path: `${import.meta.env.BASE_URL}master/tag`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Tag",
          },
        ],
      },
      {
        title: "Lead Management",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}master/inquiry`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Inquiry",
          },
          {
            path: `${import.meta.env.BASE_URL}master/leadexam`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Exam",
          },
          {
            path: `${import.meta.env.BASE_URL}master/leaddegree`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Degree",
          },
          {
            path: `${import.meta.env.BASE_URL}master/leadfollowuptype`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Follow-Up Type",
          },
        ],
      },
      {
        title: "Visitor",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}master/visitortype`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Visitor Type",
          },
          // {
          //   path: `${import.meta.env.BASE_URL}master/documentlist`,
          //   type: "link",
          //   active: false,
          //   selected: false,
          //   dirchange: false,
          //   title: "Assign Document List",
          // },
          // {
          //   path: `${import.meta.env.BASE_URL}master/assigndocument`,
          //   type: "link",
          //   active: false,
          //   selected: false,
          //   dirchange: false,
          //   title: "Assign Document",
          // },
        ],
      },
      {
        title: "Document",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            title: "Assign",
            icon: "bi bi-list",
            type: "sub",
            active: false,
            selected: false,
            dirchange: false,
            children: [
              {
                path: `${import.meta.env.BASE_URL}master/documentType`,
                type: "link",
                active: false,
                selected: false,
                dirchange: false,
                title: "Assign Document Type",
              },
              {
                path: `${import.meta.env.BASE_URL}master/documentlist`,
                type: "link",
                active: false,
                selected: false,
                dirchange: false,
                title: "Assign Document List",
              },
              {
                path: `${import.meta.env.BASE_URL}master/assigndocument`,
                type: "link",
                active: false,
                selected: false,
                dirchange: false,
                title: "Assign Document",
              },
            ],
          },
          {
            title: "Visitor",
            icon: "bi bi-list",
            type: "sub",
            active: false,
            selected: false,
            dirchange: false,
            children: [
              {
                path: `${import.meta.env.BASE_URL}master/visitordocumenttype`,
                type: "link",
                active: false,
                selected: false,
                dirchange: false,
                title: "Visitor Document Type",
              },
              {
                path: `${import.meta.env.BASE_URL}master/visitordocumentlist`,
                type: "link",
                active: false,
                selected: false,
                dirchange: false,
                title: "Visitor Document List",
              },
              {
                path: `${import.meta.env.BASE_URL}master/visitordocument`,
                type: "link",
                active: false,
                selected: false,
                dirchange: false,
                title: "Visitor Document",
              },
            ],
          },
          {
            path: `${import.meta.env.BASE_URL}master/workpermitdocument`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Work Document",
          },
        ],
      },
      {
        title: "Plans",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}master/mainplan`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Main Plan",
          },
          {
            path: `${import.meta.env.BASE_URL}master/subplan`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Sub Plan",
          },
        ],
      },
      {
        title: "Coaching",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}master/coachingrequirement`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Requirement",
          },
          {
            path: `${import.meta.env.BASE_URL}master/studentregisterfor`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Student Register For",
          },
          {
            path: `${import.meta.env.BASE_URL}master/coachingfaculty`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Coaching Faculty",
          },
          {
            path: `${import.meta.env.BASE_URL}master/subject`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Subject",
          },
          {
            path: `${import.meta.env.BASE_URL}master/level`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Level",
          },
        ],
      },
      {
        title: "Client Mail",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}master/clientmail`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Add Client Mail",
          },
          {
            path: `${import.meta.env.BASE_URL}master/clientmailcategory`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Add Category",
          },
        ],
      },
      {
        title: "Task",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}task/taskcategory`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Task Category",
          },
          {
            path: `${import.meta.env.BASE_URL}task/tasktype`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Task Type",
          },
          {
            path: `${import.meta.env.BASE_URL}task/taskpriority`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Task Priority",
          },
          {
            path: `${import.meta.env.BASE_URL}task/status`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Task Status",
          },
        ],
      },
      // {
      //   path: `${import.meta.env.BASE_URL}master/progressbar`,
      //   title: "Progressbar",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   dirchange: false,
      // },
      {
        path: `${import.meta.env.BASE_URL}master/bankingDetails`,
        title: "Banking details",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/interestedcourse`,
        title: "Interested course",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/visastatus`,
        title: "Visa Status",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/accountantStatus`,
        title: "Accountant Status",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/educationloanstatus`,
        title: "Education Loan Status",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/currencyrate`,
        title: "Currency Rate",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/expensetype`,
        title: "Expense Type",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/applicationtype`,
        title: "Application Type",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/loanprovider`,
        title: "Loan Provider",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}master/OtherService`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Other Service",
      },
    ],
  },
  {
    title: "Settings",
    icon: "bi bi-gear",
    type: "sub",
    active: false,
    selected: false,
    dirchange: false,
    children: [
      {
        title: "Lead Statuses",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}setting/leadstatus`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Lead Status",
          },
          // {
          //   path: `${import.meta.env.BASE_URL}setting/leadsubstatus`,
          //   type: "link",
          //   active: false,
          //   selected: false,
          //   dirchange: false,
          //   title: "Sub Tab Status",
          // },
        ],
      },
      // {
      //   path: `${import.meta.env.BASE_URL}setting/leadstatus`,
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   dirchange: false,
      //   title: "Lead Status",
      // },
      {
        path: `${import.meta.env.BASE_URL}setting/b2bleadstatus`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "B2B Lead Status",
      },
      {
        path: `${import.meta.env.BASE_URL}setting/role`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Role",
      },
      {
        path: `${import.meta.env.BASE_URL}setting/companydetails`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Company Details",
      },
      {
        path: `${import.meta.env.BASE_URL}setting/permissions`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Permissions",
      },
      {
        title: "Application Statuses",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}setting/mainstatus`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Main Status",
          },
          {
            path: `${import.meta.env.BASE_URL}setting/substatus`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Sub Status",
          },
        ],
      },
      {
        title: "Visitor Status",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}setting/visitormainstatus`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Visitor Main Status",
          },
          {
            path: `${import.meta.env.BASE_URL}setting/visitorsubreason`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Visitor Sub Status",
          },
        ],
      },
      {
        title: "Whatsapp",
        icon: "bi bi-list",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}setting/whatsappcategory`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Category",
          },
          {
            path: `${import.meta.env.BASE_URL}setting/whatsapptemplate`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Template",
          },
        ],
      },
      {
        path: `${import.meta.env.BASE_URL}setting/loginhistory`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Login History",
      },
      {
        path: `${import.meta.env.BASE_URL}setting/iprestriction`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "IP Restriction",
      },
      {
        path: `${import.meta.env.BASE_URL}setting/wadaddyCredentials`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "WA Daddy Credentials",
      },
      {
        path: `${import.meta.env.BASE_URL}setting/configuration`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Configuration",
      },
    ],
  },

  // {
  // 	path: `${import.meta.env.BASE_URL}`, title: "Course Finder", icon: 'ti-search', type: "link", active: false, selected: false, dirchange: false
  // },

  // {
  // 	title: "Crypto Currencies", icon: 'ti-wallet', type: "sub", active: false, selected: false, dirchange: false,
  // 	children: [
  // 		{ path: `${import.meta.env.BASE_URL}cryptocurrencies/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
  // 		{ path: `${import.meta.env.BASE_URL}cryptocurrencies/marketcap`, type: "link", active: false, selected: false, dirchange: false, title: "Marketcap" },
  // 		{ path: `${import.meta.env.BASE_URL}cryptocurrencies/currencyexchange`, type: "link", active: false, selected: false, dirchange: false, title: "Currency exchange" },
  // 		{ path: `${import.meta.env.BASE_URL}Cryptocurrencies/Buysell`, type: "link", active: false, selected: false, dirchange: false, title: "Buy & Sell" },
  // 		{ path: `${import.meta.env.BASE_URL}cryptocurrencies/wallet`, type: "link", active: false, selected: false, dirchange: false, title: "Wallet" },
  // 		{ path: `${import.meta.env.BASE_URL}cryptocurrencies/coursefinder`, type: "link", active: false, selected: false, dirchange: false, title: "Transactions" },
  // 	],
  // },
  // {
  // 	title: "ECommerce", icon: 'ti-shopping-cart-full', type: "sub", active: false, selected: false, dirchange: false,
  // 	children: [
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/edashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/products`, type: "link", active: false, selected: false, dirchange: false, title: "Products" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/productdeatils`, type: "link", active: false, selected: false, dirchange: false, title: "Product Details" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/ecart`, type: "link", active: false, selected: false, dirchange: false, title: "Cart" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/wishlist`, type: "link", active: false, selected: false, dirchange: false, title: "Wishlist" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/checkout`, type: "link", active: false, selected: false, dirchange: false, title: "Checkout" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/orders`, type: "link", active: false, selected: false, dirchange: false, title: "Orders" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/addproduct`, type: "link", active: false, selected: false, dirchange: false, title: "Add Product" },
  // 		{ path: `${import.meta.env.BASE_URL}ecommerce/account`, type: "link", active: false, selected: false, dirchange: false, title: "Account" },
  // 	],
  // },
  // {
  // 	menutitle: "LANDING",
  // },
  // {
  // 	path: `${import.meta.env.BASE_URL}landingPage`, title: "Landing Page", icon: 'ti-layout', type: "link", active: false, selected: false, dirchange: false
  // },
  // {
  // 	menutitle: "APPLICATIONS",
  // },
  // {
  // 	title: "Apps", icon: 'ti-write', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: `${import.meta.env.BASE_URL}apps/widgets`, type: "link", active: false, selected: false, dirchange: false, title: "Widgets" },
  // 		{ path: `${import.meta.env.BASE_URL}apps/sweetalert`, type: "link", active: false, selected: false, dirchange: false, title: "Sweet Alerts" },
  // 		{
  // 			title: "Mail", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}apps/mail/mailinbox`, type: "link", active: false, selected: false, dirchange: false, title: "Mail-Inbox" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/mail/Viewmail`, type: "link", active: false, selected: false, dirchange: false, title: "View-Mail" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/mail/mailcomposed`, type: "link", active: false, selected: false, dirchange: false, title: "Mail-Compose" }
  // 			],
  // 		},
  // 		{
  // 			title: "Maps", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}apps/maps/leafletmaps`, type: "link", active: false, selected: false, dirchange: false, title: "Leaflet Maps" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/maps/rsmmaps`, type: "link", active: false, selected: false, dirchange: false, title: "Simple Maps" },
  // 			],
  // 		},
  // 		{
  // 			title: "Tables", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}apps/tables/tables`, type: "link", active: false, selected: false, dirchange: false, title: "Tables" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/tables/gridjstable`, type: "link", active: false, selected: false, dirchange: false, title: "Grid JS Tables" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/tables/datatable`, type: "link", active: false, selected: false, dirchange: false, title: "Data Tables" },
  // 			],
  // 		},
  // 		{
  // 			title: "Blog", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}apps/blog/blog`, type: "link", active: false, selected: false, dirchange: false, title: "Blog Page" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/blog/blogdetails`, type: "link", active: false, selected: false, dirchange: false, title: "Blog-details" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/blog/blogpost`, type: "link", active: false, selected: false, dirchange: false, title: "Blog-post" },
  // 			],
  // 		},
  // 		{
  // 			title: "File Manager", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}apps/file/filemanager`, type: "link", active: false, selected: false, dirchange: false, title: "File Manager" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/file/filemanagerlist`, type: "link", active: false, selected: false, dirchange: false, title: "File-manager-list" },
  // 				{ path: `${import.meta.env.BASE_URL}apps/file/filedetails`, type: "link", active: false, selected: false, dirchange: false, title: "File-details" },
  // 			],
  // 		},
  // 		{ path: `${import.meta.env.BASE_URL}apps/icons`, type: "link", active: false, selected: false, dirchange: false, title: "Icons" },
  // 	],
  // },
  // {
  // 	menutitle: "COMPONENTS",
  // },
  // {
  // 	title: "Elements", icon: 'ti-package', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: `${import.meta.env.BASE_URL}elements/accordions`, type: "link", active: false, selected: false, dirchange: false, title: "Accordions & Collapse" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/alerts`, type: "link", active: false, selected: false, dirchange: false, title: "Alerts" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/avatars`, type: "link", active: false, selected: false, dirchange: false, title: "Avatars" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/breadcrumbs`, type: "link", active: false, selected: false, dirchange: false, title: "Breadcrumbs" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/buttons`, type: "link", active: false, selected: false, dirchange: false, title: "Buttons" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/buttongroup`, type: "link", active: false, selected: false, dirchange: false, title: "Button Groups" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/badges`, type: "link", active: false, selected: false, dirchange: false, title: "Badges" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/dropdowns`, type: "link", active: false, selected: false, dirchange: false, title: "Dropdowns" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/imagesfigures`, type: "link", active: false, selected: false, dirchange: false, title: "Images & Figures" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/listgroups`, type: "link", active: false, selected: false, dirchange: false, title: "List Groups" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/navstabs`, type: "link", active: false, selected: false, dirchange: false, title: "Navs & Tabs" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/objectfit`, type: "link", active: false, selected: false, dirchange: false, title: "Object Fit" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/paginations`, type: "link", active: false, selected: false, dirchange: false, title: "Paginations" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/popovers`, type: "link", active: false, selected: false, dirchange: false, title: "Popovers" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/progress`, type: "link", active: false, selected: false, dirchange: false, title: "Progress" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/spinners`, type: "link", active: false, selected: false, dirchange: false, title: "Spinners" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/typographys`, type: "link", active: false, selected: false, dirchange: false, title: "Typography" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/tooltips`, type: "link", active: false, selected: false, dirchange: false, title: "Tooltips" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/toasts`, type: "link", active: false, selected: false, dirchange: false, title: "Toasts" },
  // 		{ path: `${import.meta.env.BASE_URL}elements/tags`, type: "link", active: false, selected: false, dirchange: false, title: "Tags" },
  // 	],
  // },
  // {
  // 	title: "Advanced UI", icon: 'ti-briefcase', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/carousels`, type: "link", active: false, selected: false, dirchange: false, title: "Carousel" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/calendar`, type: "link", active: false, selected: false, dirchange: false, title: "Full Calendar" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/draggablecards`, type: "link", active: false, selected: false, dirchange: false, title: "Draggable Card" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/chat`, type: "link", active: false, selected: false, dirchange: false, title: "Chat" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/contacts`, type: "link", active: false, selected: false, dirchange: false, title: "Contacts" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/cards`, type: "link", active: false, selected: false, dirchange: false, title: "Cards" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/timeline`, type: "link", active: false, selected: false, dirchange: false, title: "Timeline" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/search`, type: "link", active: false, selected: false, dirchange: false, title: "Search" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/userlist`, type: "link", active: false, selected: false, dirchange: false, title: "Userlist" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/notifications`, type: "link", active: false, selected: false, dirchange: false, title: "Notifications" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/treeview`, type: "link", active: false, selected: false, dirchange: false, title: "Tree-view" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/modals`, type: "link", active: false, selected: false, dirchange: false, title: "Modals & Closes" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/navbar`, type: "link", active: false, selected: false, dirchange: false, title: "Navbar" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/offcanvas`, type: "link", active: false, selected: false, dirchange: false, title: "Offcanvas" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/placeholders`, type: "link", active: false, selected: false, dirchange: false, title: "Placeholders" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/rating`, type: "link", active: false, selected: false, dirchange: false, title: "Ratings" },
  // 		{ path: `${import.meta.env.BASE_URL}advanceui/swiperjs`, type: "link", active: false, selected: false, dirchange: false, title: "Swiper JS" },
  // 	],
  // },
  // {
  // 	menutitle: "OTHER PAGES",
  // },
  // {
  // 	title: "Pages", icon: 'ti-palette', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: `${import.meta.env.BASE_URL}pages/profile`, type: "link", active: false, selected: false, dirchange: false, title: "Profile" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/aboutus`, type: "link", active: false, selected: false, dirchange: false, title: "About Us" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/settings`, type: "link", active: false, selected: false, dirchange: false, title: "Settings" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/invoice`, type: "link", active: false, selected: false, dirchange: false, title: "Invoice" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/pricingtables`, type: "link", active: false, selected: false, dirchange: false, title: "Pricing" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/gallery`, type: "link", active: false, selected: false, dirchange: false, title: "Gallery" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/notificationlist`, type: "link", active: false, selected: false, dirchange: false, title: "Notifications list" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/faq`, type: "link", active: false, selected: false, dirchange: false, title: "Faqs" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/messagesuccess`, type: "link", active: false, selected: false, dirchange: false, title: "Success Message" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/messagedanger`, type: "link", active: false, selected: false, dirchange: false, title: "Danger Message" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/messagewarning`, type: "link", active: false, selected: false, dirchange: false, title: "Warning Message" },
  // 		{ path: `${import.meta.env.BASE_URL}pages/emptypage`, type: "link", active: false, selected: false, dirchange: false, title: "Empty Page" },
  // 	],
  // },
  // {
  // 	title: "Utilities", icon: 'ti-shield', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: `${import.meta.env.BASE_URL}utilities/breakpoints`, type: "link", active: false, selected: false, dirchange: false, title: "Breakpoints" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/display`, type: "link", active: false, selected: false, dirchange: false, title: "Display" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/border`, type: "link", active: false, selected: false, dirchange: false, title: "Borders" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/colors`, type: "link", active: false, selected: false, dirchange: false, title: "Colors" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/flex`, type: "link", active: false, selected: false, dirchange: false, title: "Flex" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/columns`, type: "link", active: false, selected: false, dirchange: false, title: "Columns" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/gutters`, type: "link", active: false, selected: false, dirchange: false, title: "Gutters" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/helpers`, type: "link", active: false, selected: false, dirchange: false, title: "Helpers" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/position`, type: "link", active: false, selected: false, dirchange: false, title: "Position" },
  // 		{ path: `${import.meta.env.BASE_URL}utilities/more`, type: "link", active: false, selected: false, dirchange: false, title: "More" },
  // 	],
  // },
  // {
  // 	title: "Submenu", icon: 'ti-menu', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: '#Submenu-01', type: "link", active: false, selected: false, dirchange: false, title: "Submenu-01" },
  // 		{
  // 			title: "Submenu-02", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: '#Level-01', type: "link", active: false, selected: false, dirchange: false, title: "Level-01" },
  // 				{
  // 					title: "Level-02", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 						{ path: '#Level-11', type: "link", active: false, selected: false, dirchange: false, title: "Level-11" },
  // 						{ path: '#Level-12', type: "link", active: false, selected: false, dirchange: false, title: "Level-12" },
  // 					],
  // 				},
  // 			],
  // 		},
  // 	],
  // },
  // {
  // 	title: "Authentication", icon: 'ti-lock', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: `${import.meta.env.BASE_URL}custompages/signin`, type: "link", active: false, selected: false, dirchange: false, title: "Sign In" },
  // 		{ path: `${import.meta.env.BASE_URL}custompages/signup`, type: "link", active: false, selected: false, dirchange: false, title: "Sign Up" },
  // 		{ path: `${import.meta.env.BASE_URL}custompages/forgetpassword`, type: "link", active: false, selected: false, dirchange: false, title: "Forgot Password" },
  // 		{ path: `${import.meta.env.BASE_URL}custompages/resetpassword`, type: "link", active: false, selected: false, dirchange: false, title: "Reset Password" },
  // 		{ path: `${import.meta.env.BASE_URL}custompages/lockscreen`, type: "link", active: false, selected: false, dirchange: false, title: "Lockscreen" },
  // 		{ path: `${import.meta.env.BASE_URL}custompages/underconstruction`, type: "link", active: false, selected: false, dirchange: false, title: "UnderConstruction" },
  // 		{ path: `${import.meta.env.BASE_URL}custompages/error404`, type: "link", active: false, selected: false, dirchange: false, title: "Error404" },
  // 		{ path: `${import.meta.env.BASE_URL}custompages/error505`, type: "link", active: false, selected: false, dirchange: false, title: "Error505" },
  // 	],
  // },
  // {
  // 	menutitle: "FORMS & CHARTS",
  // },
  // {
  // 	title: "Forms", icon: 'ti-receipt', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{
  // 			title: "Form Elements", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/inputs`, type: "link", active: false, selected: false, dirchange: false, title: "Inputs" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/checksradios`, type: "link", active: false, selected: false, dirchange: false, title: "Checks & Radios" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/inputgroup`, type: "link", active: false, selected: false, dirchange: false, title: "Input Group" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/formselect`, type: "link", active: false, selected: false, dirchange: false, title: "Form Select" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/rangeslider`, type: "link", active: false, selected: false, dirchange: false, title: "Range Slider" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/inputmasks`, type: "link", active: false, selected: false, dirchange: false, title: "Input Masks" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/fileuploads`, type: "link", active: false, selected: false, dirchange: false, title: "File Uploads" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/datetimepicker`, type: "link", active: false, selected: false, dirchange: false, title: "Date,Time Picker" },
  // 				{ path: `${import.meta.env.BASE_URL}forms/formelements/colorpicker`, type: "link", active: false, selected: false, dirchange: false, title: "Color Picker" },
  // 			],
  // 		},
  // 		{ path: `${import.meta.env.BASE_URL}forms/floatinglabels`, type: "link", active: false, selected: false, dirchange: false, title: "Floating Labels" },
  // 		{ path: `${import.meta.env.BASE_URL}forms/formlayouts`, type: "link", active: false, selected: false, dirchange: false, title: "Form Layouts" },
  // 		{
  // 			title: "Form Editor", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}forms/formeditor`, type: "link", active: false, selected: false, dirchange: false, title: "Sun Editor" },
  // 			],
  // 		},
  // 		{ path: `${import.meta.env.BASE_URL}forms/formvalidation`, type: "link", active: false, selected: false, dirchange: false, title: "Validation" },
  // 		{ path: `${import.meta.env.BASE_URL}forms/select2`, type: "link", active: false, selected: false, dirchange: false, title: "Select2" },
  // 	],
  // },
  // {
  // 	title: "Charts", icon: 'ti-bar-chart-alt', type: "sub", active: false, selected: false, dirchange: false, children: [
  // 		{ path: `${import.meta.env.BASE_URL}charts/chartjs`, type: "link", active: false, selected: false, dirchange: false, title: "Chart Js" },
  // 		{ path: `${import.meta.env.BASE_URL}charts/echart`, type: "link", active: false, selected: false, dirchange: false, title: "EChart" },
  // 		{
  // 			title: "Apex Charts", type: "sub", active: false, selected: false, dirchange: false, children: [
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/linechart`, type: "link", active: false, selected: false, dirchange: false, title: "Line Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/areachart`, type: "link", active: false, selected: false, dirchange: false, title: "Area Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/columnchart`, type: "link", active: false, selected: false, dirchange: false, title: "Column Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/barchart`, type: "link", active: false, selected: false, dirchange: false, title: "Bar Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/mixedchart`, type: "link", active: false, selected: false, dirchange: false, title: "Mixed Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/rangeareachart`, type: "link", active: false, selected: false, dirchange: false, title: "Range Area Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/timelinechart`, type: "link", active: false, selected: false, dirchange: false, title: "Timeline Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/candlestickchart`, type: "link", active: false, selected: false, dirchange: false, title: "CandleStick Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/boxplotchart`, type: "link", active: false, selected: false, dirchange: false, title: "Boxplot Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/bubblechart`, type: "link", active: false, selected: false, dirchange: false, title: "Bubble Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/scatterchart`, type: "link", active: false, selected: false, dirchange: false, title: "Scatter Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/heatmapchart`, type: "link", active: false, selected: false, dirchange: false, title: "Heatmap Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/treemapchart`, type: "link", active: false, selected: false, dirchange: false, title: "Treemap Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/piechart`, type: "link", active: false, selected: false, dirchange: false, title: "Pie Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/radialbarchart`, type: "link", active: false, selected: false, dirchange: false, title: "Radialbar Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/radarchart`, type: "link", active: false, selected: false, dirchange: false, title: "Radar Charts" },
  // 				{ path: `${import.meta.env.BASE_URL}charts/apexchart/polarareachart`, type: "link", active: false, selected: false, dirchange: false, title: "Polararea Charts" },
  // 			],
  // 		},
  // 	],
  // },
];

function filterMenuItems(menuItems, allAllowedTabs) {
  const userRole = decryptData(localStorage.getItem("role"));

  if (!userRole) {
    // Sirf Course Finder tab dikhao
    const courseFinderTab = menuItems.find(
      (item) => item.title === "Course Finder"
    );
    return courseFinderTab ? [courseFinderTab] : [];
  }

  if (userRole === "Super Admin") {
    return menuItems;
  }

  // Student role
  // if (userRole === "Student") {
  //   const applicationsMenu = menuItems.find((item) => item.title === "Applications");
  //   if (applicationsMenu) {
  //     const studentAppTab = applicationsMenu.children.find(
  //       (child) => child.title === "Student Applications"
  //     );

  //     return studentAppTab
  //       ? [{ ...applicationsMenu, children: [studentAppTab] }]
  //       : [];
  //   }
  //   return [];
  // }
  if (userRole === "Student" || userRole === "LeadStudent") {
    const applicationsMenu = menuItems.find(
      (item) => item.title === "Applications"
    );
    const studentAppTab = applicationsMenu?.children.find(
      (child) => child.title === "Student Applications"
    );

    const courseFinderTab = menuItems.find(
      (item) => item.title === "Course Finder"
    );

    const result = [];

    // First push Course Finder
    if (courseFinderTab) {
      result.push(courseFinderTab);
    }

    // Then Applications > Student Applications
    if (applicationsMenu && studentAppTab) {
      result.push({ ...applicationsMenu, children: [studentAppTab] });
    }

    return result;
  }

  // if (userRole === "LeadStudent") {
  //   const courseFinderTab = menuItems.find(
  //     (item) => item.title === "Course Finder"
  //   );

  //   const result = [];

  //   // First push Course Finder
  //   if (courseFinderTab) {
  //     result.push(courseFinderTab);
  //   }

  //   return result;
  // }

  // other roles
  const filterItem = (item) => {
    if (item.type === "link") {
      return allAllowedTabs.includes(item.title) ? { ...item } : null;
    }

    if (item.type === "sub" && item.children) {
      const filteredChildren = item.children.map(filterItem).filter(Boolean);

      if (filteredChildren.length > 0 || allAllowedTabs.includes(item.title)) {
        return { ...item, children: filteredChildren };
      }
    }

    return null;
  };

  let filteredItems = menuItems.map(filterItem).filter(Boolean);

  // if (filteredItems.length === 0) {
  //   const courseFinderTab = menuItems.find(
  //     (item) => item.title === "Course Finder"
  //   );
  //   if (courseFinderTab) {
  //     filteredItems.push(courseFinderTab);
  //   }
  // }

  return filteredItems;
}
export const MENUITEMS = filterMenuItems(rawMenuItems, allAllowedTabs);
