import { useState } from 'react';
import Store from './redux/Store';



export function Dark(actionfunction) {
    const theme = Store.getState();

    actionfunction({
        ...theme,
        "dataThemeMode": "dark",
        "dataHeaderStyles": "dark",
        "dataMenuStyles": "dark",
        "darkBg": "",
        "bodybg": "",
        "inputBorder": ""
    });
    localStorage.setItem("spruhadarktheme", "dark");
    localStorage.removeItem("spruhalighttheme");
    localStorage.removeItem("darkBgRGB1");
    localStorage.removeItem("spruhaHeader");
    localStorage.removeItem("spruhaMenu");
}

export function Light(actionfunction) {
    const theme = Store.getState();

    document.documentElement.removeAttribute('style');


    actionfunction({
        ...theme,
        "dataThemeMode": "light",
        "dataHeaderStyles": "light",
        "dataMenuStyles": 'dark',
        "darkBg": "",
        "bodybg": "",
        "inputBorder": ""

    });
    localStorage.setItem("spruhalighttheme", "light");
    localStorage.removeItem("spruhadarktheme");
    localStorage.removeItem("darkBgRGB1");
}

export function Ltr(actionfunction) {
    const theme = Store.getState();
    actionfunction({ ...theme, dir: "ltr" });
    localStorage.setItem("spruhaltr", "ltr");
    localStorage.removeItem("spruhartl");
}
export function Rtl(actionfunction) {
    const theme = Store.getState();
    actionfunction({ ...theme, dir: "rtl" });
    localStorage.setItem("spruhartl", "rtl");
    localStorage.removeItem("spruhaltr");
}

export const HorizontalClick = (actionfunction) => {
    const theme = Store.getState();

    const updatedTheme = {
        ...theme,
        "dataNavLayout": "horizontal",
        "datamenustyles": localStorage.spruhadarktheme ? "dark" : localStorage.darkBgRGB1 ? localStorage.spruhaMenu : localStorage.spruhaMenu ? localStorage.spruhaMenu : "light",
        "dataVerticalStyle": "",
        "dataNavStyle": localStorage.spruhanavstyles ? localStorage.spruhanavstyles : "menu-click"
    };

    actionfunction(updatedTheme);
    localStorage.setItem("spruhalayout", "horizontal");
};

export const Vertical = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "datamenustyles": localStorage.spruhadarktheme ? "dark" : localStorage.darkBgRGB1 ? localStorage.spruhaMenu : localStorage.spruhaMenu ? localStorage.spruhaMenu : "light",
        "dataVerticalStyle": "default",
        "toggled": ""
    });

    localStorage.setItem("spruhalayout", "vertical");

};

export const Menuclick = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataNavStyle": "menu-click",
        "dataVerticalStyle": "",
        "toggled": "menu-click-closed",
    });
    localStorage.setItem("spruhanavstyles", "menu-click");
    localStorage.removeItem("spruhaverticalstyles");
};

export const MenuHover = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataNavStyle": "menu-hover",
        "dataVerticalStyle": "",
        "toggled": "menu-hover-closed",
        "horStyle": ""
    });
    localStorage.setItem("spruhanavstyles", "menu-hover");
    localStorage.removeItem("spruhaverticalstyles");
};

export const IconClick = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataNavStyle": "icon-click",
        "dataVerticalStyle": "",
        "toggled": "icon-click-closed",
    });
    localStorage.setItem("spruhanavstyles", "icon-click");
    localStorage.removeItem("spruhaverticalstyles");
};

export const IconHover = (actionfunction) => {
    const theme = Store.getState();

    actionfunction({
        ...theme,
        "dataNavStyle": "icon-hover",
        "dataVerticalStyle": "",
        "toggled": "icon-hover-closed"
    });
    localStorage.setItem("spruhanavstyles", "icon-hover");
    localStorage.removeItem("spruhaverticalstyles");
};

export const Fullwidth = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataWidth": "fullwidth",
    });
    localStorage.setItem("spruhafullwidth", "Fullwidth");
    localStorage.removeItem("spruhaboxed");

};

export const Boxed = (actionfunction) => {
    const theme = Store.getState();
    const bodyClass = document.body.className;

    let dataWidthValue = "boxed";

    if (bodyClass.includes("login-img")) {
        dataWidthValue = "";
    }

    actionfunction({
        ...theme,
        "dataWidth": dataWidthValue,
        "dataVerticalStyle": "default",
    });

    localStorage.setItem("spruhaboxed", dataWidthValue === "boxed" ? "Boxed" : "");
    localStorage.removeItem("spruhafullwidth");
};

export const FixedMenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataMenuPosition": "fixed",
    });
    localStorage.setItem("spruhamenufixed", "MenuFixed");
    localStorage.removeItem("spruhamenuscrollable");
};

export const scrollMenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataMenuPosition": "scrollable",
    });
    localStorage.setItem("spruhamenuscrollable", "Menuscrolled");
    localStorage.removeItem("spruhamenufixed");
};

export const Headerpostionfixed = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataHeaderPosition": "fixed",
    });
    localStorage.setItem("spruhaheaderfixed", 'FixedHeader');
    localStorage.removeItem("spruhaheaderscrollable");
};

export const Headerpostionscroll = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataHeaderPosition": "scrollable",
    });
    localStorage.setItem("spruhaheaderscrollable", "ScrollableHeader");
    localStorage.removeItem("spruhaheaderfixed");
};

export const Regular = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataPageStyle": "regular"
    });
    localStorage.setItem("spruharegular", "Regular");
    localStorage.removeItem("spruhaclassic");
    localStorage.removeItem("spruhamodern");
};

export const Classic = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataPageStyle": "classic",
    });
    localStorage.setItem("spruhaclassic", "Classic");
    localStorage.removeItem("spruharegular");
    localStorage.removeItem("spruhamodern");
};

export const Modern = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataPageStyle": "modern",
    });
    localStorage.setItem("spruhamodern", "Modern");
    localStorage.removeItem("spruharegular");
    localStorage.removeItem("spruhaclassic");
};


export const Defaultmenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataVerticalStyle": "default",
        "dataNavLayout": "vertical",
        "toggled": "",
        "dataNavStyle": ""
    });
    localStorage.removeItem("spruhanavstyles");
    localStorage.setItem("spruhaverticalstyles", 'default');

    var radiobox = document.getElementById("switcher-default-menu");
    if (radiobox) {
        radiobox.checked = true
    }
};

export const Closedmenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "closed",
        "toggled": "close-menu-close",
        "dataNavStyle": ""
    });
    localStorage.removeItem("spruhanavstyles");
    localStorage.setItem("spruhaverticalstyles", "closed");

};

export const iconText = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "icontext",
        "toggled": "icon-text-close",
        "dataNavStyle": ""
    });
    localStorage.removeItem("spruhanavstyles");
    localStorage.setItem("spruhaverticalstyles", "icontext");
};

export const iconOverayFn = (actionfunction) => {
    const theme = Store.getState()
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "overlay",
        "toggled": "icon-overlay-close",

    })
    localStorage.setItem("spruhaverticalstyles", "overlay");
    localStorage.removeItem("spruhanavstyles");

    var radiobox = document.getElementById("switcher-icon-overlay");
    if (radiobox) {
        radiobox.checked = true
    }
    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');
    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        console.log("detachedclose");
        DetachedCloseFn();
    });
};

function DetachedOpenFn() {
    if (window.innerWidth > 992) {
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.setAttribute('data-icon-overlay', 'open');
        }
    }
}

function DetachedCloseFn() {
    if (window.innerWidth > 992) {
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.removeAttribute('data-icon-overlay');
        }
    }
}

export const DetachedFn = (actionfunction) => {
    const theme = Store.getState()
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "detached",
        "toggled": "detached-close",
        "dataNavStyle": "",

    })
    localStorage.setItem("spruhaverticalstyles", "detached");
    localStorage.removeItem("spruhanavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        console.log("detachedclose");
        DetachedCloseFn();
    });
};

export const DoubletFn = (actionfunction) => {
    const theme = Store.getState();

    // Update theme with desired values
    const updatedTheme = {
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "doublemenu",
        "toggled": "double-menu-open",
        "dataNavStyle": "",
    };

    // Update state and local storage
    actionfunction(updatedTheme);
    localStorage.setItem("spruhaverticalstyles", "doublemenu");
    localStorage.removeItem("spruhanavstyles");

    // Check if the required elements exist after a short delay
    setTimeout(() => {
        const activeSlides = document.querySelectorAll(".main-menu .slide.active");
        if (activeSlides.length >= 4 && !activeSlides[3].querySelector("ul")) {
            // If required elements not found, update theme and state
            const theme = Store.getState();
            actionfunction({
                ...theme,
                "toggled": "double-menu-close",
            });
        }
    }, 100);
};

export const bgImage1 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bgImg": "bgimg1"
    });
    localStorage.setItem("bgimage", "bgimg1");

};

export const bgImage2 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bgImg": "bgimg2"
    });
    localStorage.setItem("bgimage", "bgimg2");

};

export const bgImage3 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bgImg": "bgimg3"
    });
    localStorage.setItem("bgimage", "bgimg3");

};

export const bgImage4 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bgImg": "bgimg4"
    });
    localStorage.setItem("bgimage", "bgimg4");

};

export const bgImage5 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bgImg": "bgimg5"
    });
    localStorage.setItem("bgimage", "bgimg5");

};

export const lightMenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataMenuStyles": "light",
    });
    localStorage.setItem("spruhaMenu", "light");
};

export const colorMenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataMenuStyles": "color",
    });
    localStorage.setItem("spruhaMenu", "color");
};

export const darkMenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataMenuStyles": "dark",
    });
    localStorage.setItem("spruhaMenu", "dark");
};

export const gradientMenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataMenuStyles": "gradient",
    });
    localStorage.setItem("spruhaMenu", "gradient");
};

export const transparentMenu = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataMenuStyles": "transparent",
    });
    localStorage.setItem("spruhaMenu", "transparent");
};

export const lightHeader = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataHeaderStyles": "light",
    });
    localStorage.setItem("spruhaHeader", "light");
};

export const darkHeader = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataHeaderStyles": "dark",
    });
    localStorage.setItem("spruhaHeader", "dark");
};

export const colorHeader = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataHeaderStyles": "color",
    });
    localStorage.setItem("spruhaHeader", "color");
};

export const gradientHeader = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataHeaderStyles": "gradient",

    });
    localStorage.setItem("spruhaHeader", "gradient");
};

export const transparentHeader = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "dataHeaderStyles": "transparent",
    });
    localStorage.setItem("spruhaHeader", "transparent");
};

export const primaryColor1 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "58, 88, 146",
    });
    localStorage.setItem("primaryRGB", "58, 88, 146");

};
export const primaryColor2 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "92, 144, 163",
    });
    localStorage.setItem("primaryRGB", "92, 144, 163");
};

export const primaryColor3 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "161, 90, 223",
    });
    localStorage.setItem("primaryRGB", "161, 90, 223");
};

export const primaryColor4 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "78, 172, 76",
    });
    localStorage.setItem("primaryRGB", "78, 172, 76");
};

export const primaryColor5 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "223, 90, 90",
    });
    localStorage.setItem("primaryRGB", "223, 90, 90");
};

export const backgroundColor1 = (actionfunction) => {
    const theme = Store.getState();

    actionfunction({
        ...theme,
        "bodyBg1": "20, 30, 96",
        "bodyBg2": "43, 52, 111",
        "darkBg": "43, 52, 111",
        "inputBorder": "255, 255, 255, 0.1",
        "dataThemeMode": "dark",
        "dataMenuStyles": 'dark',
        "dataHeaderStyles": 'dark',
    });

    localStorage.setItem('darkBgRGB1', "20, 30, 96");
    localStorage.setItem('darkBgRGB2', "43, 52, 111");
    localStorage.setItem('darkBgRGB3', "43, 52, 111");
    localStorage.setItem('darkBgRGB4', "255, 255, 255, 0.1");
    
};


export const backgroundColor2 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bodyBg1": "8, 78, 115",
        "bodyBg2": "32, 95, 128",
        "darkBg": "32, 95, 128",
        "inputBorder": "255, 255, 255, 0.1",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB1', "8, 78, 115");
    localStorage.setItem('darkBgRGB2', "32, 95, 128");
    localStorage.setItem('darkBgRGB3', "32, 95, 128",);
    localStorage.setItem('darkBgRGB4', "255, 255, 255, 0.1");

};

export const backgroundColor3 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bodyBg1": "90, 37, 135",
        "bodyBg2": "106, 58, 146",
        "darkBg": "106, 58, 146",
        "inputBorder": "255, 255, 255, 0.1",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB1', "90, 37, 135");
    localStorage.setItem('darkBgRGB2', "106, 58, 146");
    localStorage.setItem('darkBgRGB3', "106, 58, 146",);
    localStorage.setItem('darkBgRGB4', "255, 255, 255, 0.1");

};

export const backgroundColor4 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bodyBg1": "24, 101, 51",
        "bodyBg2": "46, 116, 71",
        "darkBg": "46, 116, 71",
        "inputBorder": "255, 255, 255, 0.1",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB1', "24, 101, 51");
    localStorage.setItem('darkBgRGB2', "46, 116, 71");
    localStorage.setItem('darkBgRGB3', "46, 116, 71");
    localStorage.setItem('darkBgRGB4', "255, 255, 255, 0.1");

};

export const backgroundColor5 = (actionfunction) => {
    const theme = Store.getState();
    actionfunction({
        ...theme,
        "bodyBg1": "120, 66, 20",
        "bodyBg2": "133, 84, 43",
        "darkBg": "133, 84, 43",
        "inputBorder": "255, 255, 255, 0.1",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB1', "120, 66, 20");
    localStorage.setItem('darkBgRGB2', "133, 84, 43");
    localStorage.setItem('darkBgRGB3', "133, 84, 43");
    localStorage.setItem('darkBgRGB4', "255, 255, 255, 0.1");
   
};

const ColorPicker = (props) => {
    return (
        <div className="color-picker-input">
            <input type="color" {...props} />
        </div>
    );
};

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
const Themeprimarycolor = ({ actionfunction }) => {
    const theme = Store.getState();
    const [state, updateState] = useState("#845adf");

    const handleInput = (e) => {
        const rgb = hexToRgb(e.target.value);

        if (rgb !== null) {
            const { r, g, b } = rgb;
            updateState(e.target.value);
            actionfunction({
                ...theme,
                "colorPrimaryRgb": `${r}, ${g}, ${b}`,
                "colorPrimary": `${r}, ${g}, ${b}`
            });
            localStorage.setItem("primaryRGB", `${r}, ${g}, ${b}`);
        }
    };

    return (
        <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export default Themeprimarycolor;

//themeBackground
export const Themebackgroundcolor = ({ actionfunction }) => {
    const theme = Store.getState();
    const [state, updateState] = useState("#845adf");
    const handleInput = (e) => {
        const { r, g, b } = hexToRgb(e.target.value);
        updateState(e.target.value);
        actionfunction({
            ...theme,
            "bodyBg1": `${r}, ${g}, ${b}`,
            "bodyBg2": `${r + 19} ${g + 19} ${b + 19}`,
            "darkBg": `${r + 19} ${g + 19} ${b + 19}`,
            "inputBorder": "255, 255, 255, 0.1",
            "sidemenuactive": `${r + 19} ${g + 19} ${b + 19}`,
            "dataThemeMode": "dark",
            "dataHeaderStyles": "dark",
            "dataMenuStyles": "dark",
        });
        localStorage.setItem("darkBgRGB1", `${r}, ${g}, ${b}`);
        localStorage.setItem("darkBgRGB2", `${r + 19} ${g + 19} ${b + 19}`);
        localStorage.setItem("darkBgRGB3", `${r + 19} ${g + 19} ${b + 19}`);
        localStorage.setItem("darkBgRGB4", "255, 255, 255, 0.1");

    };
    return (
        <div className="Themebackgroundcolor">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export const Reset = (actionfunction) => {
    const theme = Store.getState();
    Vertical(actionfunction);
    actionfunction({
        ...theme,
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
        iconOverlay: "",
        colorPrimaryRgb: "",
        colorPrimary: "",
        bodyBg1: "",
        bodyBg2: "",
        darkBg: "",
        inputBorder: "",
        bgImg: "",
        iconText: "",
        body: {
            class: ""
        }
    });
    localStorage.clear();
};

export const Resetlandingswitcher = (actionfunction) => {
    const theme = Store.getState();
    Vertical(actionfunction);
    actionfunction({
        ...theme,
        lang: "en",
        dir: "ltr",
        dataThemeMode: "light",
        dataMenuStyles: "dark",
        dataNavLayout: "horizontal",
        dataHeaderStyles: "light",
        dataVerticalStyle: "overlay",
        StylebodyBg: "107 64 64",
        StyleDarkBg: "93 50 50",
        toggled: "",
        dataNavStyle: "",
        dataMenuPosition: "",
        iconOverlay: "",
        colorPrimaryRgb: "",
        bgImg: "",
        iconText: "",
        body: {
            class: ""
        }
    });
    localStorage.clear();
};

export const LocalStorageBackup = (actionfunction) => {

    (localStorage.spruhaltr) ? Ltr(actionfunction) : "";
    (localStorage.spruhartl) ? Rtl(actionfunction) : "";
    (localStorage.spruhadarktheme) ? Dark(actionfunction) : "";
    (localStorage.spruhalighttheme) ? Light(actionfunction) : "";
    (localStorage.spruharegular) ? Regular(actionfunction) : "";
    (localStorage.spruhaclassic) ? Classic(actionfunction) : "";
    (localStorage.spruhamodern) ? Modern(actionfunction) : "";
    (localStorage.spruhafullwidth) ? Fullwidth(actionfunction) : "";
    (localStorage.spruhaboxed) ? Boxed(actionfunction) : "";
    (localStorage.spruhamenufixed) ? FixedMenu(actionfunction) : "";
    (localStorage.spruhamenuscrollable) ? scrollMenu(actionfunction) : "";
    (localStorage.spruhaheaderfixed) ? Headerpostionfixed(actionfunction) : "";
    (localStorage.spruhaheaderscrollable) ? Headerpostionscroll(actionfunction) : "";

    (localStorage.spruhanavstyles === "menu-click") ? Menuclick(actionfunction) : '';
    (localStorage.spruhanavstyles === "menu-hover") ? MenuHover(actionfunction) : '';
    (localStorage.spruhanavstyles === "icon-click") ? IconClick(actionfunction) : '';
    (localStorage.spruhanavstyles === "icon-hover") ? IconHover(actionfunction) : '';

    (localStorage.bgimage === 'bgimg1') ? bgImage1(actionfunction) : '';
    (localStorage.bgimage === 'bgimg2') ? bgImage2(actionfunction) : '';
    (localStorage.bgimage === 'bgimg3') ? bgImage3(actionfunction) : '';
    (localStorage.bgimage === 'bgimg4') ? bgImage4(actionfunction) : '';
    (localStorage.bgimage === 'bgimg5') ? bgImage5(actionfunction) : '';
    (localStorage.spruhalayout == 'horizontal') && HorizontalClick(actionfunction);
    (localStorage.spruhalayout == 'vertical') && Vertical(actionfunction);

    //primitive 
    if (
        localStorage.getItem("spruhaltr") == null ||
        localStorage.getItem("spruhaltr") == "ltr"
    ) {
        // addOrRemoveCss(ltr);
    }
    if (localStorage.getItem("spruhartl") == "rtl") {
        document.querySelector("body")?.classList.add("rtl");
        document.querySelector("html[lang=en]")?.setAttribute("dir", "rtl");
        // addOrRemoveCss(rtl);
    }

    // Theme Primary: Colors: Start
    switch (localStorage.primaryRGB) {
        case '20, 30, 96':
            primaryColor1(actionfunction);

            break;
        case '8, 78, 115':
            primaryColor2(actionfunction);

            break;
        case '90, 37, 135':
            primaryColor3(actionfunction);

            break;
        case '24, 101, 51':
            primaryColor4(actionfunction);

            break;
        case '120, 66, 20':
            primaryColor5(actionfunction);

            break;
        default:
            break;
    }
    // Theme Primary: Colors: End

    switch (localStorage.darkBgRGB1) {
        case '20, 30, 96':
            backgroundColor1(actionfunction);

            break;
        case '8, 78, 115':
            backgroundColor2(actionfunction);

            break;
        case '90, 37, 135':
            backgroundColor3(actionfunction);

            break;
        case '24, 101, 51':
            backgroundColor4(actionfunction);

            break;
        case '120, 66, 20':
            backgroundColor5(actionfunction);

            break;
        default:
            break;

    }

    //layout
    if (localStorage.spruhaverticalstyles) {
        const verticalStyles = localStorage.getItem("spruhaverticalstyles");

        switch (verticalStyles) {
            case "default":
                Defaultmenu(actionfunction);
                break;
            case "closed":
                Closedmenu(actionfunction);
                break;
            case "icontext":
                iconText(actionfunction);
                break;
            case "overlay":
                iconOverayFn(actionfunction);
                break;
            case "detached":
                DetachedFn(actionfunction);
                break;
            case "doublemenu":
                DoubletFn(actionfunction);
                break;
        }
    }

    //Theme Primary:
    if (localStorage.primaryRGB) {
        const theme = Store.getState();
        actionfunction({
            ...theme,
            "colorPrimaryRgb": localStorage.primaryRGB,
            "colorPrimary": localStorage.primaryRGB
        });
    }

    //Theme BAckground:
    if (localStorage.darkBgRGB1) {
        const theme = Store.getState();
        actionfunction({
            ...theme,
            "bodyBg1": localStorage.darkBgRGB1,
            "bodyBg2": localStorage.darkBgRGB2,
            "darkBg": localStorage.darkBgRGB3,
            "inputBorder": localStorage.darkBgRGB4,
            "sidemenuactive": localStorage.darkBgRGB2,
            "dataThemeMode": "dark",
            "dataHeaderStyles": "dark",
            "dataMenuStyles": "dark",
        });
        // Dark(actionfunction);
    }

    // ThemeColor MenuColor Start
    switch (localStorage.spruhaMenu) {
        case 'light':
            lightMenu(actionfunction);

            break;
        case 'dark':
            darkMenu(actionfunction);

            break;
        case 'color':
            colorMenu(actionfunction);

            break;
        case 'gradient':
            gradientMenu(actionfunction);

            break;
        case 'transparent':
            transparentMenu(actionfunction);

            break;
        default:
            break;
    }

    // ThemeColor Header Colors: start
    switch (localStorage.spruhaHeader) {
        case 'light':
            lightHeader(actionfunction);

            break;
        case 'dark':
            darkHeader(actionfunction);

            break;
        case 'color':
            colorHeader(actionfunction);

            break;
        case 'gradient':
            gradientHeader(actionfunction);

            break;
        case 'transparent':
            transparentHeader(actionfunction);

            break;
        default:
            break;
    }

};
