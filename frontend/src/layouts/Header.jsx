import { Fragment, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { ThemeChanger } from "../common/redux/Action";
import Store from "../common/redux/Store";
import { HeaderCart, cartData } from "../common/Comondata";
import { Link } from "react-router-dom";
import ALLImages from "../common/Imagedata";
import {
  Badge,
  Button,
  Dropdown,
  DropdownDivider,
  Form,
  InputGroup,
  ListGroup,
  Offcanvas,
} from "react-bootstrap";
import Select from "react-select";
import { HeaderSearchData } from "../common/Select2data";
import Rightside from "./Rightside";
import { MENUITEMS } from "../common/Sidemenu";
import Switcher from "./Switcher";
import { adminGetOne } from "../redux/actions/Admin.action";
import { getOneB2BAdmin } from "../redux/actions/B2BAdmin.action";
import { decryptData } from "../utils/encryptionUtils";
import { getOneBranch } from "../redux/actions/Branch.action";
import { getB2BMemberById } from "../redux/actions/B2BMember.action";
import { getBranchMemberById } from "../redux/actions/BranchMember.action";
import Axios from "../api";
import { BASEURL } from "../baseUrl";
import ChatComponent from "../components/student/studentDetails/chat/ChatComponent";
import { getOneStudentApplication } from "../redux/actions/Student/StudentApplication.action";
import { toast } from "react-toastify";

// import {
//   disconnectSocket,
//   initializeSocket,
//   markNotificationsAsRead,
// } from "../socket";
import { useNotification } from "../context/NotificationContext";
import { useSocket } from "../context/SocketContext";
import {
  getAllCoachingFaculty,
  getOneCoachingFaculty,
} from "../redux/actions/Master/CoachingFaculty.action";

import { io } from "socket.io-client";
import { CHAT_MESSAGE_URL } from "../baseUrl";
import { getAllSetting } from "../redux/actions/Setting.action";
import eventEmitter from "../utils/eventEmitter";
const userId = decryptData(localStorage.getItem("userId"));

const Header = ({ local_varaiable, ThemeChanger }) => {
  const [dashboardLogo, setDashboardLogo] = useState(ALLImages("logo1"));

  const getValidLogoUrl = (logoPath) => {
    if (!logoPath) return "";

    // agar already full URL hai (Cloudinary etc.)
    if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }

    // agar relative path hai
    return `${BASEURL}/${logoPath}`;
  };
  const fetchSettings = async () => {
    try {
      const storedLogo = localStorage.getItem("companyLogo");
      if (storedLogo) {
        setDashboardLogo(getValidLogoUrl(storedLogo));
      } else {
        const res = await dispatch(getAllSetting());
        if (res?.status === 200 && res.data.data[0]?.dashboardLogo) {
          // setDashboardLogo(
          //   `${REACT_APP_API_URL}/${res.data.data[0].dashboardLogo.replace(/\\/g, "/")}`
          // );
          setDashboardLogo(getValidLogoUrl(res.data.data[0].dashboardLogo));
        }
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
    eventEmitter.on("settingsUpdated", fetchSettings);
    return () => {
      eventEmitter.events["settingsUpdated"] = [];
    };
  }, []);
  // lead notification socket start
  // Connect with query params (userId)
  const socketRef = useRef(null);
  const fetchNotification = async () => {
    if (!userId) {
      console.warn("[HEADER] No userId, skipping fetchNotification");
      return;
    }
    try {
      setIsLoadingNotifications(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("[HEADER] No auth token found");
        toast.error("Please log in to view notifications");
        return;
      }
      const res = await Axios.get(`${BASEURL}/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status && res.data.data) {
        setLeadNotifications(res.data.data);
        setLeadNotificationCount(res.data.data.filter((n) => !n.read).length);
      } else {
        console.warn("[HEADER] No notifications found:", res.data);
        setLeadNotifications([]);
        setLeadNotificationCount(0);
      }
    } catch (error) {
      console.error("[HEADER] Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setIsLoadingNotifications(false);
    }
  };
  // Socket connection
  useEffect(() => {
    if (!userId) {
      console.warn("[HEADER] No userId, skipping socket connection");
      return;
    }

    const socket = io(`${CHAT_MESSAGE_URL}/notification-namespace`, {
      query: { userId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[HEADER] Connected to notification namespace:", socket.id);
    });

    socket.on("user_status", (data) => {
      console.log("[HEADER] User Status:", data);
    });

    socket.on("receive_notification", (notification) => {
      // console.log("[HEADER] Received Notification:", notification);
      fetchNotification();
    });

    socket.on("fetch_notifications", () => {
      // console.log("[HEADER] Fetching notifications on server request");
      fetchNotification();
    });

    socket.on("error", (err) => {
      console.error("[HEADER] Socket error:", err);
      // toast.error(err.message || "Notification socket error");
    });

    socket.on("disconnect", () => {
      console.log("[HEADER] Disconnected from notification namespace");
    });

    socketRef.current = socket;

    // Fetch notifications on mount
    fetchNotification();

    return () => {
      socket.disconnect();
    };
  }, [userId]); // lead notification socket end

  const { socket } = useSocket();

  // FullScreen
  const {
    notificationCount,
    notificationMessageCount,
    // setNotificationCount,
    notifications,
    // setNotifications,
    // markAsRead, // New added 16
    fetchNotifications,
  } = useNotification();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatStudent, setChatStudent] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [leadNotifications, setLeadNotifications] = useState([]);
  const [leadNotificationCount, setLeadNotificationCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // const [socket, setSocket] = useState(null);

  const userRole = decryptData(localStorage.getItem("role"));

  const elem = document.documentElement;

  const openFullscreen = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      requestFullscreen();
    } else {
      exitFullscreen();
    }
  };

  const requestFullscreen = () => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullScreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  };

  const handleFullscreenChange = () => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const fetchStudentData = async (studentId) => {
    try {
      setIsLoading(true);
      const res = await dispatch(getOneStudentApplication(studentId));
      setStudentData(res?.data?.data || {});
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatOpen = async (notification) => {
    // 🔥 FIX: Force remount ChatComponent by resetting it first
    setShowChat(false);
    setChatStudent(null);

    setTimeout(() => {
      const student = {
        _id: notification.studentId,
        name: notification.name,
      };
      setChatStudent(student);
      setShowChat(true);
    }, 50);

    fetchStudentData(notification.studentId);
    await fetchNotifications();
  };
  // const handleChatOpen = async (notification) => {
  //   const student = {
  //     _id: notification.studentId,
  //     name: notification.name,
  //   };
  //   setChatStudent(student);
  //   setShowChat(true);
  //   fetchStudentData(student._id);
  //   await fetchNotifications();
  // };

  // Handle chat close
  const handleChatClose = () => {
    setShowChat(false);
    setChatStudent(null);
    setStudentData({});
  };

  // Manage body overflow for chat modal
  useEffect(() => {
    if (showChat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showChat]);

  //search visibility function
  const [isSearchDropVisible, setSearchDropVisible] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [customshow, _setCustomshow] = useState(true);
  const [NavData, setNavData] = useState([]);
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const searchRef = useRef(null);

  const linkData = [
    {
      path: `${import.meta.env.BASE_URL}AdvanceUI/Calendar/`,
      icon: "bx-calendar",
      text: "Calendar",
    },
    {
      path: `${import.meta.env.BASE_URL}Apps/Mail/Mailinbox/`,
      icon: "bx-envelope",
      text: "Mail",
    },
    {
      path: `${import.meta.env.BASE_URL}Elements/Buttons/`,
      icon: "bx-dice-1",
      text: "Buttons",
    },
  ];

  const toggleSearchDropdown = (e) => {
    e.stopPropagation();
    setSearchDropVisible(!isSearchDropVisible);
  };

  const handleDocumentClick = (e) => {
    // Check if the clicked element is outside the "header-search" div
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearchDropVisible(false);
    }
  };

  useEffect(() => {
    // Add click event listener when component mounts
    document.addEventListener("click", handleDocumentClick);

    // Remove click event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  //rightsidebar

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Switcher functionality

  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleSwitcherClick = () => {
    setShowSwitcher(true);
  };

  //Dark mode

  const ToggleDark = () => {
    const theme = Store.getState();
    const isDarkMode = theme.dataThemeMode === "dark";

    const updatedTheme = {
      ...theme,
      dataThemeMode: isDarkMode ? "light" : "dark",
      dataHeaderStyles: isDarkMode ? "light" : "dark",
      dataMenuStyles:
        theme.dataNavLayout === "horizontal" && !isDarkMode
          ? "dark"
          : isDarkMode
          ? "dark"
          : "dark",
    };

    ThemeChanger(updatedTheme);

    if (theme.dataThemeMode === "light") {
      localStorage.setItem("spruhadarktheme", "dark");
      localStorage.removeItem("spruhalighttheme");
    } else {
      localStorage.setItem("spruhalighttheme", "light");
      localStorage.removeItem("spruhadarktheme");
      localStorage.removeItem("darkBgRGB1");
      localStorage.removeItem("darkBgRGB2");
      localStorage.removeItem("darkBgRGB3");
      localStorage.removeItem("darkBgRGB4");
      localStorage.removeItem("spruhaHeader");
      localStorage.removeItem("spruhaMenu");
    }
  };

  function menuClose() {
    const theme = Store.getState();
    ThemeChanger({ ...theme, toggled: "close" });
    if (window.innerWidth < 992) {
      ThemeChanger({ ...theme, toggled: "close" });
    }
  }

  const toggleSidebar = () => {
    const theme = Store.getState();
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "close-menu-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, datanavstyle: "" });
            if (theme.toggled === "icon-overlay-close") {
              ThemeChanger({
                ...theme,
                toggled: "",
                iconOverlay: "",
                dataVerticalStyle: "default",
              });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({
                  ...theme,
                  toggled: "icon-overlay-close",
                  iconOverlay: "",
                });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "icon-text-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "double-menu-open") {
              ThemeChanger({ ...theme, toggled: "double-menu-close" });
            } else {
              const sidemenu = document.querySelector(
                ".side-menu__item.active"
              );
              if (sidemenu) {
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add(
                    "double-menu-active"
                  );
                  ThemeChanger({ ...theme, toggled: "double-menu-open" });
                } else {
                  ThemeChanger({ ...theme, toggled: "double-menu-close" });
                }
              }
            }

            break;
          // detached
          case "detached":
            if (theme.toggled === "detached-close") {
              ThemeChanger({ ...theme, toggled: "", iconOverlay: "" });
            } else {
              ThemeChanger({
                ...theme,
                toggled: "detached-close",
                iconOverlay: "",
              });
            }

            break;

          // default
          case "default":
            ThemeChanger({
              ...theme,
              toggled: "icon-overlay-close",
              dataVerticalStyle: "overlay",
            });
        }
        switch (navStyle) {
          case "menu-click":
            if (theme.toggled === "menu-click-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "menu-click-closed" });
            }
            break;
          // menu-hover
          case "menu-hover":
            if (theme.toggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "menu-hover-closed" });
            }
            break;
          case "icon-click":
            if (theme.toggled === "icon-click-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-click-closed" });
            }
            break;
          case "icon-hover":
            if (theme.toggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-hover-closed" });
            }
            break;
        }
      }
    } else {
      if (theme.toggled === "close") {
        ThemeChanger({ ...theme, toggled: "open" });

        setTimeout(() => {
          if (theme.toggled == "open") {
            const overlay = document.querySelector("#responsive-overlay");

            if (overlay) {
              overlay.classList.add("active");
              overlay.addEventListener("click", () => {
                const overlay = document.querySelector("#responsive-overlay");

                if (overlay) {
                  overlay.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              const overlay = document.querySelector("#responsive-overlay");

              if (overlay) {
                overlay.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, toggled: "close" });
      }
    }
  };

  //cart remove function

  const [data1, setData1] = useState([]);
  const [remainingCount1, setRemainingCount1] = useState(HeaderCart.length);

  const Remove1 = (id) => {
    if (!data1.includes(id)) {
      setData1((i) => [...i, id]);
      setRemainingCount1((prevCount) => prevCount - 1);
    }
  };

  //notification remove function

  const [data, setData] = useState([]);
  const [remainingCount, setRemainingCount] = useState(cartData.length);

  const Remove = (id) => {
    if (!data.includes(id)) {
      setData((i) => [...i, id]);
      setRemainingCount((prevCount) => prevCount - 1);
    }
  };

  //Search functionality

  document.addEventListener("click", function () {
    document.querySelector(".search-result")?.classList.add("d-none");
  });
  const myfunction = (inputValue) => {
    const matchingElements = [];

    const findMatchingElements = (menuItems) => {
      menuItems.forEach((menuItem) => {
        if (menuItem.title) {
          if (menuItem.children) {
            findMatchingElements(menuItem.children);
          }

          if (
            menuItem.title.toLowerCase().includes(inputValue.toLowerCase()) &&
            menuItem.title.toLowerCase().startsWith(inputValue.toLowerCase())
          ) {
            matchingElements.push(menuItem);
          }
        }
      });
    };

    findMatchingElements(MENUITEMS);

    if (!matchingElements.length || inputValue === "") {
      if (inputValue === "") {
        // Handle case when inputValue is empty
        setShow1(false);
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor("text-dark");
      } else {
        // Handle case when no matching elements are found
        setShow1(true);
        setShow2(false);
        setsearchcolor("text-danger");
        setsearchval("There is no component with this name");
      }
    } else {
      setShow1(true);
      setShow2(true);
      setsearchcolor("text-dark");
      setsearchval("");
    }

    setNavData(matchingElements);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("roleId");
    localStorage.removeItem("rolePermissions");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    localStorage.removeItem("branchId");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("companyLogo");
    localStorage.removeItem("offerLetterType");
    localStorage.removeItem("paymentType");
    localStorage.removeItem("scholarshipAvailable");
    localStorage.removeItem("showInterviewSection");
    localStorage.removeItem("crmCurrency");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("showUserAllocationSection");
    window.location.href = `${import.meta.env.BASE_URL}`;
  };

  const role = decryptData(localStorage.getItem("role"));

  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState();
  useEffect(() => {
    const isB2BAdmin = userRole === "b2bAdmin" || userRole === "B2B Admin";
    const isB2BMember = userRole === "b2bMember" || userRole === "B2B Member";

    if (!isB2BAdmin && !isB2BMember) {
      dispatch(adminGetOne(userId))
        .then((res) => {
          setLoginData(res.data);
        })
        .catch((err) => {
          console.log("Error fetching admin data:", err);
        });
    }
  }, [userRole]);

  const [b2BAdminLoginData, setB2BAdminLoginData] = useState();
  const [b2BMemberLoginData, setB2BMemberLoginData] = useState();
  const [branchLoginData, setbranchLoginData] = useState();
  const [branchMemberLoginData, setbranchMemberLoginData] = useState();
  const [coachingFacultyLoginData, setCoachingFacultyLoginData] = useState();
  const [oneStudent, setOneStudent] = useState();

  useEffect(() => {
    if (userRole === "b2bAdmin" || userRole === "B2B Admin") {
      dispatch(getOneB2BAdmin(userId))
        .then((res) => {
          setB2BAdminLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }
  }, [userId, userRole]);

  useEffect(() => {
    if (userRole === "b2bMember" || userRole === "B2B Member") {
      dispatch(getB2BMemberById(userId))
        .then((res) => {
          setB2BMemberLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }
  }, [userId, userRole]);

  useEffect(() => {
    if (userRole === "Branch") {
      dispatch(getOneBranch(userId))
        .then((res) => {
          setbranchLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }
  }, [userId, userRole]);

  useEffect(() => {
    if (userRole === "Branch Member") {
      dispatch(getBranchMemberById(userId))
        .then((res) => {
          setbranchMemberLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }
  }, [userId, userRole]);

  useEffect(() => {
    if (userRole === "Coaching Faculty") {
      dispatch(getOneCoachingFaculty(userId))
        .then((res) => {
          setCoachingFacultyLoginData(res?.data?.data);
        })
        .catch((err) => {
          console.log("Error fetching coaching faculty data:", err);
        });
    }
  }, [userId, userRole]);

  useEffect(() => {
    if (userRole === "Student" || userRole === "LeadStudent") {
      dispatch(getOneStudentApplication(userId))
        .then((res) => {
          setOneStudent(res?.data?.data);
        })
        .catch((err) => {
          console.log("Error fetching student data:", err);
        });
    }
  }, [userId, userRole]);

  return (
    <Fragment>
      <header className="app-header">
        <div className="main-header-container container-fluid">
          <div className="header-content-left">
            <div className="header-element">
              <div className="horizontal-logo">
                <Link
                  to={`${import.meta.env.BASE_URL}dashboard`}
                  className="header-logo"
                >
                  <img
                    src={ALLImages("logo2")}
                    alt="logo"
                    className="desktop-logo"
                  />
                  <img
                    src={dashboardLogo} // logo5 => logo1
                    alt="logo"
                    className="toggle-logo"
                  />
                  <img
                    src={ALLImages("logo1")}
                    alt="logo"
                    className="desktop-dark"
                  />
                  <img
                    src={ALLImages("logo4")}
                    alt="logo"
                    className="toggle-dark"
                  />
                  <img
                    src={ALLImages("logo3")}
                    alt="logo"
                    className="desktop-white"
                  />
                  <img
                    src={ALLImages("logo6")}
                    alt="logo"
                    className="toggle-white"
                  />
                </Link>
              </div>
            </div>

            <div className="header-element">
              <Link
                aria-label="Hide Sidebar"
                className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
                data-bs-toggle="sidebar"
                to="#"
                onClick={() => toggleSidebar()}
              >
                <span></span>
              </Link>
            </div>

            {/* {userRole === "Super Admin" && (
              <div className="main-header-center  d-none d-lg-block  header-link">
                <InputGroup className="search-results">
                  <Select
                    options={HeaderSearchData}
                    placeholder="Choose one"
                    classNamePrefix="Select2"
                    className="input-group-btn search-panel"
                  />
                  <Form.Control
                    defaultValue={InputValue}
                    onChange={(ele) => {
                      myfunction(ele.target.value);
                      setInputValue(ele.target.value);
                      setSearchDropVisible(true);
                    }}
                    placeholder="Search for results..."
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onClick={toggleSearchDropdown}
                  />
                  <Button variant="primary" id="basic-addon1">
                    <i className="fe fe-search" aria-hidden="true"></i>
                  </Button>
                </InputGroup>
                <div
                  className={`header-search ${
                    isSearchDropVisible ? "searchdrop" : ""
                  }`}
                  ref={searchRef}
                >
                  <div className="p-3">
                    {show1 ? (
                      <>
                        {" "}
                        <ListGroup className="my-2 border-0">
                          {" "}
                          {show2 ? (
                            NavData.map((e) => (
                              <ListGroup.Item key={Math.random()} className="">
                                {" "}
                                <Link
                                  to={`${e.path}/`}
                                  onClick={() => {
                                    setShow1(false), setInputValue("");
                                    setSearchDropVisible(false);
                                  }}
                                >
                                  <i className="fe fe-chevron-right me-2"></i>
                                  {e.title}
                                </Link>
                              </ListGroup.Item>
                            ))
                          ) : (
                            <b className={`${searchcolor} `}>{searchval}</b>
                          )}{" "}
                        </ListGroup>{" "}
                      </>
                    ) : (
                      ""
                    )}

                    <div className="">
                      <p className="fw-semibold text-muted mb-2 fs-13">
                        Recent Searches
                      </p>
                      <div className="ps-2">
                        <Link to="#" className="search-tags  me-3">
                          <i className="fe fe-search me-2"></i>People
                          <span></span>
                        </Link>
                        <Link to="#" className="search-tags  me-3">
                          <i className="fe fe-search me-2"></i>Pages
                          <span></span>
                        </Link>
                        <Link to="#" className="search-tags">
                          <i className="fe fe-search me-2"></i>Articles
                          <span></span>
                        </Link>
                      </div>
                    </div>
                    {customshow && !show2 && (
                      <div className="mt-3">
                        <p className="fw-semibold text-muted mb-2 fs-13">
                          Apps and pages
                        </p>
                        <ul className="ps-2">
                          {linkData.map((link) => (
                            <li
                              key={link.path}
                              className="p-1 d-flex align-items-center text-muted mb-2 search-app"
                            >
                              <Link
                                to={link.path}
                                onClick={() => {
                                  setSearchDropVisible(false);
                                }}
                              >
                                <span>
                                  <i
                                    className={`bx ${link.icon} me-2 fs-14 bg-primary-transparent p-2 rounded-circle`}
                                  ></i>
                                  {link.text}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {customshow && !show2 && (
                      <div className="mt-3">
                        <p className="fw-semibold text-muted mb-2 fs-13">
                          Links
                        </p>
                        <ul className="ps-2">
                          <li className="p-1 align-items-center text-muted mb-1 search-app">
                            <Link to="#" className="text-primary">
                              <u>http://spruko/html/spruko.com</u>
                            </Link>
                          </li>
                          <li className="p-1 align-items-center text-muted mb-1 search-app">
                            <Link to="#" className="text-primary">
                              <u>http://spruko/demo/spruko.com</u>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="py-3 border-top px-0">
                    <div className="text-center">
                      <Link
                        to="#"
                        className="text-primary text-decoration-underline fs-15"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>

          <div className="header-content-right">
            <Dropdown
              className="header-element notifications-dropdown"
              autoClose="outside"
            >
              <Dropdown.Toggle
                as="a"
                className="header-link"
                variant=""
                id="dropdown-notifications"
              >
                <i className="fe fe-message-square header-link-icon"></i>
                {notificationCount > 0 && (
                  <Badge
                    bg="secondary"
                    className="rounded-pill header-icon-badge pulse pulse-secondary"
                    id="notification-icon-badge"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="main-header-dropdown"
                align="end"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-17 fw-semibold">Notifications</p>
                    <Badge bg="secondary" className="rounded-pill">
                      {notificationMessageCount} Unread
                    </Badge>
                  </div>
                </div>
                <DropdownDivider />
                {isLoading ? (
                  <div className="p-3 text-center">
                    <p>Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-5 empty-item1">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                        <i className="ri-notification-off-line fs-2"></i>
                      </span>
                      <h6 className="fw-semibold mt-3">No New Notifications</h6>
                    </div>
                  </div>
                ) : (
                  notifications?.map((notification, index) => (
                    <Dropdown.Item
                      key={index}
                      className="d-flex align-items-start py-2"
                      onClick={() => handleChatOpen(notification)}
                    >
                      <div className="pe-2">
                        <span className="avatar avatar-md bg-primary-transparent br-5">
                          <i className="ri-user-3-line fs-18"></i>
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-semibold fs-14">
                          {notification?.name || "Student"}
                        </p>
                        <span className="text-muted fs-12">
                          {notification?.message || "New notification"}
                        </span>
                        {/* <span className="text-muted fs-11 d-block">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span> */}
                      </div>
                      <div className="pe-2 fw-bold text-primary">
                        {notification?.unreadMessageCount}
                      </div>
                    </Dropdown.Item>
                  ))
                )}
                {/* {notifications.length > 0 && (
                  <div className="p-3 empty-header-item1">
                    <div className="d-grid">
                      <Link to="#" className="btn btn-primary">
                        View All
                      </Link>
                    </div>
                  </div>
                )} */}
              </Dropdown.Menu>
            </Dropdown>
            {/* Lead Notifications Dropdown */}
            <Dropdown
              className="header-element notifications-dropdown"
              autoClose="outside"
            >
              <Dropdown.Toggle
                as="a"
                className="header-link"
                variant=""
                id="dropdown-lead-notifications"
              >
                <i className="fe fe-bell header-link-icon"></i>
                {leadNotificationCount > 0 && (
                  <Badge
                    bg="primary"
                    className="rounded-pill header-icon-badge pulse pulse-primary"
                    id="lead-notification-icon-badge"
                  >
                    {leadNotificationCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="main-header-dropdown" align="end">
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-17 fw-semibold">Notifications</p>
                    <Badge bg="primary" className="rounded-pill">
                      {leadNotificationCount} Unread
                    </Badge>
                  </div>
                </div>
                <DropdownDivider />
                {isLoadingNotifications ? (
                  <div className="p-3 text-center">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Loading notifications...</p>
                  </div>
                ) : leadNotifications.length === 0 ? (
                  <div className="p-5 empty-item1">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                        <i className="ri-notification-off-line fs-2"></i>
                      </span>
                      <h6 className="fw-semibold mt-3">No New Notifications</h6>
                      <p className="text-muted fs-12">You're all caught up!</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {leadNotifications.map((notification) => (
                      <Dropdown.Item
                        key={notification.id || notification._id}
                        className="d-flex align-items-start notification-item"
                        // as={Link}
                        // to={`${import.meta.env.BASE_URL}leads/${notification.leadId}`}
                        // onClick={() => {
                        //   const notificationId = notification.id || notification._id;
                        //   // Mark as read and delete after a short delay to allow navigation
                        //   setTimeout(() => {
                        //     deleteNotification(notificationId);
                        //   }, 100);
                        // }}
                        style={{
                          backgroundColor: notification.read
                            ? "transparent"
                            : "rgba(13, 110, 253, 0.1)",
                          borderLeft: notification.read
                            ? "none"
                            : "3px solid #0d6efd",
                        }}
                      >
                        <div className="pe-2">
                          <span className="avatar avatar-md bg-primary-transparent br-5">
                            <i className="ri-notification-3-line fs-18"></i>
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <p
                            className="mb-0 fw-semibold"
                            style={{ fontSize: "14px" }}
                          >
                            {notification.message}
                          </p>
                          <span className="text-muted fs-12">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          {!notification.read && (
                            <span
                              className="badge bg-primary ms-2"
                              style={{ fontSize: "10px" }}
                            >
                              New
                            </span>
                          )}
                        </div>
                      </Dropdown.Item>
                    ))}
                  </div>
                )}
                {leadNotifications.length > 0 && (
                  <div className="p-3 empty-header-item1 border-top">
                    <div className="d-grid">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            await Axios.delete(
                              `${BASEURL}/notification/delete`,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            setLeadNotifications([]);
                            setLeadNotificationCount(0);
                            toast.success("All notifications cleared");
                          } catch (error) {
                            console.error(
                              "Error clearing notifications:",
                              error
                            );
                            toast.error("Failed to clear notifications");
                          }
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <div className="studentApplicationChat">
              {showChat && chatStudent && (
                <div className="chat-card">
                  <ChatComponent
                    studentId={chatStudent._id}
                    senderId={userId}
                    role={userRole}
                    studentData={studentData}
                    handleChatClose={handleChatClose}
                  />
                </div>
              )}
            </div>

            {/* <div className="header-element header-theme-mode">
              <Link
                to="#"
                className="header-link layout-setting"
                onClick={() => ToggleDark()}
              >
                <span className="light-layout">
                  {" "}
                  <i className="fe fe-moon header-link-icon lh-2"></i>{" "}
                </span>
                <span className="dark-layout">
                  {" "}
                  <i className="fe fe-sun header-link-icon lh-2"></i>{" "}
                </span>
              </Link>
            </div> */}
            {/* {userRole === "Super Admin" && (
              <Dropdown className="header-element country-selector">
                <Dropdown.Toggle
                  as="a"
                  variant=""
                  className="header-link country-Flag"
                  id="dropdown-basic"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
                      <g fill="#0052b4">
                        <path d="M52.92 100.142c-20.109 26.163-35.272 56.318-44.101 89.077h133.178L52.92 100.142zM503.181 189.219c-8.829-32.758-23.993-62.913-44.101-89.076l-89.075 89.076h133.176zM8.819 322.784c8.83 32.758 23.993 62.913 44.101 89.075l89.074-89.075H8.819zM411.858 52.921c-26.163-20.109-56.317-35.272-89.076-44.102v133.177l89.076-89.075zM100.142 459.079c26.163 20.109 56.318 35.272 89.076 44.102V370.005l-89.076 89.074zM189.217 8.819c-32.758 8.83-62.913 23.993-89.075 44.101l89.075 89.075V8.819zM322.783 503.181c32.758-8.83 62.913-23.993 89.075-44.101l-89.075-89.075v133.176zM370.005 322.784l89.075 89.076c20.108-26.162 35.272-56.318 44.101-89.076H370.005z" />
                      </g>
                      <g fill="#d80027">
                        <path d="M509.833 222.609H289.392V2.167A258.556 258.556 0 00256 0c-11.319 0-22.461.744-33.391 2.167v220.441H2.167A258.556 258.556 0 000 256c0 11.319.744 22.461 2.167 33.391h220.441v220.442a258.35 258.35 0 0066.783 0V289.392h220.442A258.533 258.533 0 00512 256c0-11.317-.744-22.461-2.167-33.391z" />
                        <path d="M322.783 322.784L437.019 437.02a256.636 256.636 0 0015.048-16.435l-97.802-97.802h-31.482v.001zM189.217 322.784h-.002L74.98 437.019a256.636 256.636 0 0016.435 15.048l97.802-97.804v-31.479zM189.217 189.219v-.002L74.981 74.98a256.636 256.636 0 00-15.048 16.435l97.803 97.803h31.481zM322.783 189.219L437.02 74.981a256.328 256.328 0 00-16.435-15.047l-97.802 97.803v31.482z" />
                      </g>
                    </svg>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="main-header-dropdown" align="end">
                  <li>
                    <Dropdown.Item className="d-flex align-items-center">
                      {" "}
                      <span className="avatar avatar-xs lh-1 me-2">
                        <img src={ALLImages("flag6")} alt="img" />
                      </span>
                      English
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item className="d-flex align-items-center">
                      {" "}
                      <span className="avatar avatar-xs lh-1 me-2">
                        <img src={ALLImages("flag5")} alt="img" />
                      </span>
                      Spanish
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item className="d-flex align-items-center">
                      {" "}
                      <span className="avatar avatar-xs lh-1 me-2">
                        <img src={ALLImages("flag1")} alt="img" />
                      </span>
                      French
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item className="d-flex align-items-center">
                      {" "}
                      <span className="avatar avatar-xs lh-1 me-2">
                        <img src={ALLImages("flag2")} alt="img" />
                      </span>
                      German
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item className="d-flex align-items-center">
                      {" "}
                      <span className="avatar avatar-xs lh-1 me-2">
                        <img src={ALLImages("flag3")} alt="img" />
                      </span>
                      Italian
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item className="d-flex align-items-center">
                      {" "}
                      <span className="avatar avatar-xs lh-1 me-2">
                        <img src={ALLImages("flag4")} alt="img" />
                      </span>
                      Russian
                    </Dropdown.Item>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            )} */}

            <div className="header-element header-fullscreen  d-xl-flex d-none">
              <Link
                to="#"
                className="header-link d-xl-block d-none"
                onClick={openFullscreen}
              >
                <i
                  className={`fe ${
                    isFullScreen
                      ? "fe-minimize full-screen-close "
                      : "fe-maximize full-screen-open"
                  } header-link-icon`}
                ></i>
              </Link>
            </div>
            {/* {userRole === "Super Admin" && (
              <Dropdown
                className="header-element cart-dropdown"
                autoClose="outside"
              >
                <Dropdown.Toggle
                  as="a"
                  className="header-link"
                  variant=""
                  id="dropdown-basic"
                >
                  <i className="fe fe-shopping-cart header-link-icon d-xl-block d-none"></i>
                  <Badge
                    bg="primary"
                    className="rounded-pill header-icon-badge d-xl-block d-none"
                    id="cart-icon-badge"
                  >
                    {remainingCount1}
                  </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu className="main-header-dropdown" align="end">
                  <div className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 fs-17 fw-semibold">Cart Items</p>
                      <Badge
                        bg="primary"
                        className="rounded-pill"
                        id="cart-data"
                      >
                        {remainingCount1} Items
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <DropdownDivider />
                  </div>
                  {remainingCount1 === 0 && (
                    <div className="p-5 empty-item">
                      <div className="text-center">
                        <span className="avatar avatar-xl avatar-rounded bg-warning-transparent">
                          <i className="ri-shopping-cart-2-line fs-2"></i>
                        </span>
                        <h6 className="fw-bold mb-1 mt-3">
                          Your Cart is Empty
                        </h6>
                        <span className="mb-3 fw-normal fs-13 d-block">
                          Add some items to make me happy :)
                        </span>
                        <Link
                          to={`${import.meta.env.BASE_URL}ecommerce/products`}
                          className="btn btn-primary btn-wave btn-sm m-1 waves-effect waves-light"
                          data-abc="true"
                        >
                          continue shopping{" "}
                          <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    </div>
                  )}

                  {HeaderCart.map((idx) => (
                    <Fragment key={idx.id}>
                      {!data1.includes(idx.id) && (
                        <Link
                          to={`${import.meta.env.BASE_URL}ecommerce/ecart`}
                          className="dropdown-item d-flex align-items-center cart-dropdown-item"
                        >
                          <img
                            src={idx.preview}
                            alt="img"
                            className="avatar avatar-sm br-5 me-3"
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-start justify-content-between mb-0">
                              <div className="mb-0 fs-13 text-dark fw-medium">
                                <span className="text-dark">
                                  {idx.itemName}
                                </span>
                              </div>
                              <div>
                                <span className="text-black mb-1 fw-medium">
                                  {idx.price}
                                </span>
                              </div>
                            </div>
                            <div className="min-w-fit-content d-flex align-items-start justify-content-between">
                              {idx.ulElement}
                              <div className="ms-auto">
                                <span
                                  to="#"
                                  onClick={() => Remove1(idx.id)}
                                  className="header-cart-remove float-end dropdown-item-close border-0 custom_cruser"
                                >
                                  <i className="ri-delete-bin-2-line"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}
                    </Fragment>
                  ))}
                  {remainingCount1 > 0 && (
                    <div className="p-3 empty-header-item">
                      <div className="d-grid">
                        <Link
                          to={`${import.meta.env.BASE_URL}ecommerce/checkout`}
                          className="btn btn-primary"
                        >
                          Proceed to checkout
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="p-5 empty-item d-none">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-warning-transparent">
                        <i className="ri-shopping-cart-2-line fs-2"></i>
                      </span>
                      <h6 className="fw-bold mb-1 mt-3">Your Cart is Empty</h6>
                      <span className="mb-3 fw-normal fs-13 d-block">
                        Add some items to make me happy :)
                      </span>
                      <Link
                        to={`${import.meta.env.BASE_URL}ecommerce/products`}
                        className="btn btn-primary btn-wave btn-sm m-1"
                        data-abc="true"
                      >
                        continue shopping{" "}
                        <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            )} */}

            {/* {userRole === "Super Admin" && (
              <Dropdown
                className="header-element notifications-dropdown"
                align="start"
                autoClose="outside"
              >
                <Dropdown.Toggle
                  as="a"
                  className="header-link"
                  variant=""
                  id="dropdown-basic"
                >
                  <i className="fe fe-bell header-link-icon"></i>
                  <Badge
                    bg="secondary"
                    className="rounded-pill header-icon-badge pulse pulse-secondary"
                    id="notification-icon-badge"
                  >
                    {remainingCount}
                  </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu className="main-header-dropdown" align="end">
                  <div className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 fs-17 fw-semibold">Notifications</p>
                      <Badge
                        bg="secondary"
                        className="rounded-pill"
                        id="notifiation-data"
                      >
                        {remainingCount} Unread{" "}
                      </Badge>
                    </div>
                  </div>
                  <DropdownDivider />
                  {remainingCount === 0 && (
                    <div className="p-5 empty-item1">
                      <div className="text-center">
                        <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                          <i className="ri-notification-off-line fs-2"></i>
                        </span>
                        <h6 className="fw-semibold mt-3">
                          No New Notifications
                        </h6>
                      </div>
                    </div>
                  )}
                  {cartData.map((idx) => (
                    <Fragment key={idx.id}>
                      {!data.includes(idx.id) && (
                        <Link
                          to={`${
                            import.meta.env.BASE_URL
                          }advanceui/notifications`}
                          className="dropdown-item d-flex align-items-start"
                          key={idx.id}
                        >
                          <div className="pe-2">
                            <span
                              className={`avatar avatar-md ${idx.status} br-5`}
                            >
                              <img alt="avatar" src={idx.preview} />
                            </span>
                          </div>
                          <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                            <div className="flex-grow-1">
                              <p className="mb-0">{idx.element}</p>
                              {idx.spanElement}
                            </div>
                            <div>
                              <span
                                onClick={() => Remove(idx.id)}
                                className="min-w-fit-content text-muted me-1 dropdown-item-close1 border-0 custom_cruser"
                              >
                                <i className="ti ti-x fs-16"></i>
                              </span>
                            </div>
                          </div>
                        </Link>
                      )}
                    </Fragment>
                  ))}
                  {remainingCount > 0 && (
                    <div className="p-3 empty-header-item1">
                      <div className="d-grid">
                        <Link
                          to={`${
                            import.meta.env.BASE_URL
                          }advanceui/notifications`}
                          className="btn btn-primary"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="p-5 empty-item1 d-none">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                        <i className="ri-notification-off-line fs-2"></i>
                      </span>
                      <h6 className="fw-semibold mt-3">No New Notifications</h6>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            )} */}

            {/* {userRole === "Super Admin" && (
              <Dropdown className="header-element header-shortcuts-dropdown  d-xl-flex d-none">
                <Dropdown.Toggle
                  as="a"
                  className="header-link"
                  variant=""
                  id="dropdown-basic"
                >
                  <i className="fe fe-grid header-link-icon d-xl-block d-none"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="main-header-dropdown header-shortcuts-dropdown pb-0 dropdown-menu-end">
                  <div className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 fs-17 fw-semibold">Related Apps</p>
                    </div>
                  </div>
                  <DropdownDivider />

                  <div
                    className="main-header-shortcuts p-2"
                    id="header-shortcut-scroll"
                  >
                    <div className="row g-2">
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng2")} alt="" />
                            </span>
                            <span className="d-block fs-12">Figma</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng6")} alt="" />
                            </span>
                            <span className="d-block fs-12">Power Point</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng7")} alt="" />
                            </span>
                            <span className="d-block fs-12">MS Word</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng1")} alt="" />
                            </span>
                            <span className="d-block fs-12">Calendar</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng8")} alt="" />
                            </span>
                            <span className="d-block fs-12">Sketch</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng3")} alt="" />
                            </span>
                            <span className="d-block fs-12">Docs</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng5")} alt="" />
                            </span>
                            <span className="d-block fs-12">Google</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng9")} alt="" />
                            </span>
                            <span className="d-block fs-12">Translate</span>
                          </div>
                        </Link>
                      </div>
                      <div className="col-4">
                        <Link to="#" className="text-dark">
                          <div className="text-center p-3 related-app">
                            <span className="avatar avatar-sm rounded-2 p-1 bg-primary-transparent">
                              <img src={ALLImages("apppng4")} alt="" />
                            </span>
                            <span className="d-block fs-12">Sheets</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-top">
                    <div className="d-grid">
                      <Link to="#" className="btn btn-primary">
                        View All
                      </Link>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            )} */}

            <Dropdown className="header-element header-profile">
              <Dropdown.Toggle
                as="a"
                className="header-link"
                variant=""
                id="dropdown-basic"
              >
                <div className="d-flex align-items-center">
                  <div className="header-link-icon">
                    <img
                      src="https://img.freepik.com/premium-vector/cartoon-illustration-manager_272293-4622.jpg?semt=ais_hybrid&w=740"
                      alt="img"
                      width="32"
                      height="32"
                      className="rounded-circle"
                    />
                  </div>
                  <div className="d-none">
                    <p className="fw-semibold mb-0">Angelica</p>
                    <span className="op-7 fw-normal d-block fs-11">
                      Web Designer
                    </span>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="main-header-dropdown pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end">
                <div className="header-navheading border-bottom">
                  <h6 className="main-notification-title">
                    {loginData?.data?.name ||
                      b2BAdminLoginData?.data?.companyName ||
                      branchLoginData?.data?.name ||
                      (branchMemberLoginData?.data?.firstName ||
                      branchMemberLoginData?.data?.lastName
                        ? `${branchMemberLoginData?.data?.firstName || ""} ${
                            branchMemberLoginData?.data?.lastName || ""
                          }`.trim()
                        : "") ||
                      (b2BMemberLoginData?.data?.firstName ||
                      b2BMemberLoginData?.data?.lastName
                        ? `${b2BMemberLoginData?.data?.firstName || ""} ${
                            b2BMemberLoginData?.data?.lastName || ""
                          }`.trim()
                        : "") ||
                      oneStudent?.name ||
                      coachingFacultyLoginData?.name ||
                      "User logout"}
                  </h6>
                  <p className="main-notification-text mb-0">
                    {role ? role : ""}
                  </p>
                </div>
                <Dropdown.Item
                  as={Link}
                  to={`${import.meta.env.BASE_URL}pages/profile`}
                  className="d-flex"
                >
                  <i className="fe fe-user fs-16 align-middle me-2"></i>
                  Profile
                </Dropdown.Item>
                {userRole === "Super Admin" && (
                  <>
                    {/* <Dropdown.Item
                      as={Link}
                      to={`${import.meta.env.BASE_URL}apps/mail/mailinbox`}
                      className="d-flex"
                    >
                      <i className="fe fe-inbox fs-16 align-middle me-2"></i>
                      Inbox <span className="badge bg-success ms-auto">25</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to={`${import.meta.env.BASE_URL}advanceui/notifications`}
                      className=" d-flex border-block-end"
                    >
                      <i className="fe fe-compass fs-16 align-middle me-2"></i>
                      Activity
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to={`${import.meta.env.BASE_URL}pages/settings`}
                      className="d-flex"
                    >
                      <i className="fe fe-settings fs-16 align-middle me-2"></i>
                      Settings
                    </Dropdown.Item> */}
                    <Dropdown.Item
                      as={Link}
                      to={`${import.meta.env.BASE_URL}advanceui/chat`}
                      className="d-flex"
                    >
                      <i className="fe fe-headphones fs-16 align-middle me-2"></i>
                      Support
                    </Dropdown.Item>
                  </>
                )}
                <Dropdown.Item
                  as={Link}
                  className="d-flex"
                  onClick={handleLogOut}
                >
                  <i className="fe fe-power fs-16 align-middle me-2"></i>Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <div className="sidebar sidebar-right sidebar-animate  d-xl-flex d-none">
              <Offcanvas
                placement="end"
                show={show}
                onHide={handleClose}
                id="right-sidebar-canvas"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Todo</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                  <Rightside />
                </Offcanvas.Body>
              </Offcanvas>
            </div>
            {/* {userRole === "Super Admin" && (
              <div className="header-element right-sidebar">
                <Link
                  to="#"
                  className="header-link right-sidebar"
                  onClick={handleShow}
                >
                  <i className="fe fe-align-right header-icons header-link-icon d-xl-block d-none"></i>
                </Link>
              </div>
            )} */}

            {/* {userRole === "Super Admin" && (
              <div className="header-element">
                <Link
                  to="#"
                  className="header-link switcher-icon"
                  onClick={handleSwitcherClick}
                >
                  {" "}
                  <i className="fe fe-settings header-link-icon"></i>{" "}
                </Link>
                <Switcher
                  show={showSwitcher}
                  onClose={() => setShowSwitcher(false)}
                />
              </div>
            )} */}
          </div>
        </div>
      </header>
    </Fragment>
  );
};
const mapStateToProps = (state) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, { ThemeChanger })(Header);
