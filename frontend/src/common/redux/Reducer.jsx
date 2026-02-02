
let initialState = {
    lang: "en",
    dir: "ltr",
    dataThemeMode: "light",
    dataMenuStyles: "dark",
    dataNavLayout: "vertical",
    dataHeaderStyles: "light",
    dataVerticalStyle: "default",
    StylebodyBg: "107 64 64",
    StyleDarkBg: "93 50 50",
    toggled: "",
    dataNavStyle: "",
    horStyle: "",
    dataPageStyle: "regular",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    // loader:"disable",
    iconOverlay: "",
    colorPrimaryRgb: "",
    bodyBg1: "",
    bodyBg2: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
};

const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ThemeChanger":
            return { ...state, ...action.payload };
        default:
            return state;
    }
};



export default themeReducer;
