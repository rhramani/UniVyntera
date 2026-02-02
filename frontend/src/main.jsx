import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Loader from "./layouts/Loader";
import App from "./components/App";
import { Customlayout } from "./components/Customlayout";
import Messagesuccess from "./components/pages/Messagesuccess";
import MessageWarning from "./components/pages/Messagewarning";
import MessageDanger from "./components/pages/Messagedanger";
import Underconstruction from "./components/custompages/Underconstruction";
import { Routedata } from "./common/Routingdata";
import Firebaselayout from "./components/Firebaselayout";
import Firebaseforgetpassword from "./layouts/firebase/Firebaseforgetpassword";
import Firebaseregistration from "./layouts/firebase/Firebaseregistration";
import Firebasesignin from "./layouts/firebase/Firebasesignin";
import Forgetpassword from "./components/custompages/Forgetpassword";
import Lockscreen from "./components/custompages/Lockscreen";
import Error404 from "./components/custompages/Error404";
import Error505 from "./components/custompages/Error505";
import Resetpassword from "./components/custompages/Resetpassword";
import Signup from "./components/custompages/Signup";
import Signin from "./components/custompages/Signin";

import Landingpageapp from "./components/Landingpageapp";
import Landingpage from "./components/landingpage/Landingpage";
import { ToastContainer } from "react-toastify";
import LeadForm from "./components/LeadForm/LeadForm";
import { Provider } from "react-redux";
import Store from "./common/redux/Store";
import StudentDetails from "./components/student/StudentDetails";
import B2BAdminForm from "./components/b2b_users/B2BAdminForm";
import CourseFinderView from "./components/crm/course_finder/courseFinder_Components/CourseFinderView";
import PromotionalDocDetails from "./components/setting/Components/PromotionalDocDetails";
import PromotionalTutorialDetails from "./components/setting/Components/PromotionalTutorialDetails";
import InterestedApplicationInitiation from "./components/student/studentDetails/Components/InterestedApplicationInitiation";
import SocialMediaPromoDetails from "./components/setting/Components/SocialMediaPromoDetails";
import PromotionalPPTDetails from "./components/setting/Components/PromotionalPPTDetails";
import PromotionalDocFolder from "./components/setting/Components/PromotionalDocFolder";
import StudentChat from "./components/student/studentDetails/chat/StudentChat";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";
import { disconnectSocket } from "./socket";
import CoachingDetails from "./components/student/CoachingDetails";
import PublicLeadForm from "./components/crm/commonLeadForm/PublicLeadForm";
import VisitorDetails from "./components/student/VisitorDetails";
import { decryptData } from "./utils/encryptionUtils";
import LeadTracking from "./components/commonComponents/LeadTracking";
import PublicCourseFinder from "./components/crm/course_finder/PublicCourseFinder";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// ------------------------ 🔐 MAXIMUM SCREENSHOT + SNIPPING TOOL BLOCKER ------------------------

// Create blackout overlay
// const overlay = document.createElement("div");
// overlay.className = "secure-overlay";
// overlay.style.position = "fixed";
// overlay.style.top = 0;
// overlay.style.left = 0;
// overlay.style.width = "100vw";
// overlay.style.height = "100vh";
// overlay.style.background = "black";
// overlay.style.opacity = "0";
// overlay.style.transition = "opacity 0.0s ease";
// overlay.style.zIndex = "999999999999";
// overlay.style.pointerEvents = "none";
// document.body.appendChild(overlay);

// universal blackout trigger
// const blackout = () => {
//   overlay.style.opacity = "1";
//   setTimeout(() => {
//     overlay.style.opacity = "0";
//   }, 800);
// };

// ----------------------
// 1) Block PrintScreen
// ----------------------
// document.addEventListener("keyup", async (e) => {
//   if (e.key === "PrintScreen") {
//     e.preventDefault();
//     await blackout();
//     navigator.clipboard.writeText("");
//   }
// });

// ----------------------
// 2) Block Ctrl + P
// ----------------------
// document.addEventListener("keydown", (e) => {
//   if (e.ctrlKey && e.key.toLowerCase() === "p") {
//     e.preventDefault();
//     blackout();
//   }
// });

// ----------------------
// 3) Window BLUR = Snipping tool opened
// ----------------------
// window.addEventListener("blur", () => {
//   blackout();
// });

// ----------------------
// 5) Block text selection
// ----------------------
// document.addEventListener("selectstart", (e) => e.preventDefault());

// ----------------------
// 6) Block context menu (optional)
// ----------------------
// document.addEventListener("contextmenu", (e) => e.preventDefault());

// ------------------------ END SECURITY PATCH ------------------------

let logoutTimer = null;

const scheduleLogoutAtExpiry = () => {
  const token = localStorage.getItem("token");
  const encryptedExpiry = localStorage.getItem("tokenExpiry");

  if (!token || !encryptedExpiry) return;

  const tokenExpiry = decryptData(encryptedExpiry);
  // console.log("Scheduling logout at:", tokenExpiry);

  const expiryTime = new Date(tokenExpiry).getTime();
  const now = Date.now();
  const timeLeft = expiryTime - now;

  if (timeLeft <= 0) {
    // Already expired
    handleLogout();
  } else {
    // Schedule logout
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(handleLogout, timeLeft);
    // console.log(`⏳ Logout scheduled in ${Math.round(timeLeft / 1000)} seconds`);
  }
};

const handleLogout = () => {
  // console.log("⏰ Token expired. Logging out...");
  try {
    if (typeof disconnectSocket === "function") disconnectSocket();
  } catch (err) {
    console.error("Error disconnecting socket:", err);
  }
  localStorage.clear();
  window.location.href = `${import.meta.env.BASE_URL}`;
};

// Run immediately on load
scheduleLogoutAtExpiry();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Fragment>
    <HelmetProvider>
      {/* <GoogleOAuthProvider clientId={googleClientId}> */}
      <BrowserRouter>
        <NotificationProvider>
          <SocketProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            <React.Suspense fallback={<Loader />}>
              <Routes>
                <Route
                  path={`${import.meta.env.BASE_URL}`}
                  element={<Firebaselayout />}
                >
                  {/* <Route index element={<Firebasesignin />} /> */}
                  <Route index element={<Signin />} />
                  <Route
                    path={`${import.meta.env.BASE_URL}firebase/firebasesignin`}
                    element={<Firebasesignin />}
                  />
                  <Route
                    path={`${
                      import.meta.env.BASE_URL
                    }firebase/firebaseregistration`}
                    element={<Firebaseregistration />}
                  />
                  <Route
                    path={`${
                      import.meta.env.BASE_URL
                    }firebase/firebaseforgetpassword`}
                    element={<Firebaseforgetpassword />}
                  />
                </Route>

                <Route path={`${import.meta.env.BASE_URL}`} element={<App />}>
                  {Routedata.map((idx) => (
                    <Route
                      key={idx.id}
                      path={idx.path}
                      element={idx.elementName}
                    />
                  ))}
                </Route>

                <Route
                  path={`${import.meta.env.BASE_URL}`}
                  element={<Customlayout />}
                >
                  <Route path="*" element={<Error505 />} />
                  <Route
                    path={`${import.meta.env.BASE_URL}pages/messagesuccess`}
                    element={<Messagesuccess />}
                  />
                  <Route
                    path={`${import.meta.env.BASE_URL}pages/messagewarning`}
                    element={<MessageWarning />}
                  />
                  <Route
                    path={`${import.meta.env.BASE_URL}pages/messagedanger`}
                    element={<MessageDanger />}
                  />
                  <Route
                    path={`${
                      import.meta.env.BASE_URL
                    }custompages/underconstruction`}
                    element={<Underconstruction />}
                  />
                  <Route
                    path={`${
                      import.meta.env.BASE_URL
                    }custompages/forgetpassword`}
                    element={<Forgetpassword />}
                  />
                  <Route
                    path={`${import.meta.env.BASE_URL}custompages/lockscreen`}
                    element={<Lockscreen />}
                  />
                  <Route
                    path={`${import.meta.env.BASE_URL}custompages/error404`}
                    element={<Error404 />}
                  />
                  <Route
                    path={`${import.meta.env.BASE_URL}custompages/error505`}
                    element={<Error505 />}
                  />
                  <Route
                    path={`${
                      import.meta.env.BASE_URL
                    }custompages/resetpassword`}
                    element={<Resetpassword />}
                  />
                  <Route
                    path={`${import.meta.env.BASE_URL}signup`}
                    element={<Signup />}
                  />
                  <Route
                    path={`${import.meta.env.BASE_URL}custompages/signin`}
                    element={<Signin />}
                  />
                </Route>

                <Route
                  path={`${import.meta.env.BASE_URL}`}
                  element={<Landingpageapp />}
                >
                  <Route
                    path={`${import.meta.env.BASE_URL}landingPage`}
                    element={<Landingpage />}
                  />
                </Route>

                <Route
                  path={`${import.meta.env.BASE_URL}newlead`}
                  element={
                    <Provider store={Store}>
                      <LeadForm />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/student-details/:id`}
                  element={
                    <Provider store={Store}>
                      <StudentDetails />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/coachingdetails/:id`}
                  element={
                    <Provider store={Store}>
                      <CoachingDetails />
                    </Provider>
                  }
                />
                <Route
                  path={`${import.meta.env.BASE_URL}/visitordetails/:id`}
                  element={
                    <Provider store={Store}>
                      <VisitorDetails />
                    </Provider>
                  }
                />

                <Route
                  path={`${
                    import.meta.env.BASE_URL
                  }/interested-application/:id`}
                  element={
                    <Provider store={Store}>
                      <InterestedApplicationInitiation />
                    </Provider>
                  }
                />

                {/* course finder view modal */}
                <Route
                  path={`${import.meta.env.BASE_URL}/course-finder/view/:id`}
                  element={
                    <Provider store={Store}>
                      <CourseFinderView />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/b2badminform`}
                  element={
                    <Provider store={Store}>
                      <B2BAdminForm />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/publiccoursefinder`}
                  element={
                    <Provider store={Store}>
                      <PublicCourseFinder />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/publicleadform`}
                  element={
                    <Provider store={Store}>
                      <PublicLeadForm />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/document-details/:id`}
                  element={
                    <Provider store={Store}>
                      <PromotionalDocDetails />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/promotional-folder/:id`}
                  element={
                    <Provider store={Store}>
                      <PromotionalDocFolder />
                    </Provider>
                  }
                />

                <Route
                  path={`${
                    import.meta.env.BASE_URL
                  }/promotionaltutorial-details/:id`}
                  element={
                    <Provider store={Store}>
                      <PromotionalTutorialDetails />
                    </Provider>
                  }
                />
                <Route
                  path={`${
                    import.meta.env.BASE_URL
                  }/socialmediapromotion-details/:id`}
                  element={
                    <Provider store={Store}>
                      <SocialMediaPromoDetails />
                    </Provider>
                  }
                />
                <Route
                  path={`${
                    import.meta.env.BASE_URL
                  }/promotionaltutorialppt-details/:id`}
                  element={
                    <Provider store={Store}>
                      <PromotionalPPTDetails />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/clientmailfolder/:id`}
                  element={
                    <Provider store={Store}>
                      <PromotionalDocFolder />
                    </Provider>
                  }
                />

                <Route
                  path="/student-chat/:studentId"
                  element={
                    <Provider store={Store}>
                      <StudentChat />
                    </Provider>
                  }
                />

                <Route
                  path={`${import.meta.env.BASE_URL}/lead-track/:id`}
                  element={
                    <Provider store={Store}>
                      <LeadTracking />
                    </Provider>
                  }
                />
              </Routes>
            </React.Suspense>
          </SocketProvider>
        </NotificationProvider>
      </BrowserRouter>
      {/* </GoogleOAuthProvider> */}
    </HelmetProvider>
  </Fragment>
);
