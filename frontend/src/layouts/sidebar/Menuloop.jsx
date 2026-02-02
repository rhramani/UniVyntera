import { Fragment } from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "../../assets/css/styles.css";

const Menuloop = ({ MENUITEMS, toggleSidemenu, level }) => {
  return (
    <Fragment>
      <Link
        to="#!"
        className={`side-menu__item ${
          MENUITEMS?.selected ? "active" : "active"
        }`}
        onClick={(event) => {
          event.preventDefault();
          toggleSidemenu(event, MENUITEMS);
        }}
      >
        {/* In case of doublemenu style the icon contains tooltip here is the style for sub menu items */}

        {level <= 1 &&
          MENUITEMS.icon &&
          (localStorage.spruhaverticalstyles === "doublemenu" &&
          localStorage.spruhalayout !== "horizontal" ? (
            <>
              <span className="shape1"></span>
              <span className="shape2"></span>
              <div className="custom-tooltip">
                <OverlayTrigger
                  placement={localStorage.spruhartl ? "left" : "right"}
                  overlay={<Tooltip>{MENUITEMS.title}</Tooltip>}
                >
                  <i className={`${MENUITEMS.icon} side-menu__icon`}></i>
                </OverlayTrigger>
              </div>
            </>
          ) : (
            <>
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className={`${MENUITEMS.icon} side-menu__icon`}></i>
            </>
          ))}

        <span className={`${level === 1 ? "side-menu__label" : ""}`}>
          {MENUITEMS.title}
        </span>

        <i className="fe fe-chevron-right side-menu__angle"></i>
      </Link>

      <ul
        className={`slide-menu child${level}  
                          ${MENUITEMS.active ? "double-menu-active" : ""} 
                          ${MENUITEMS?.dirchange ? "force-left" : ""}  `}
        style={MENUITEMS.active ? { display: "block" } : { display: "none" }}
      >
        {level <= 1 ? (
          <li className="slide side-menu__label1">
            {" "}
            <Link to="#!">{MENUITEMS.title}</Link>{" "}
          </li>
        ) : (
          ""
        )}

        {MENUITEMS.children?.map((firstlevel) => (
          <li
            className={`${firstlevel.menutitle ? "slide__category" : ""}
                                             ${
                                               firstlevel?.type === "empty"
                                                 ? "slide"
                                                 : ""
                                             } 
                                            ${
                                              firstlevel?.type === "link"
                                                ? "slide"
                                                : ""
                                            } 
                                            ${
                                              firstlevel?.type === "sb"
                                                ? "slide has-sub"
                                                : ""
                                            } 
                                            ${firstlevel?.active ? "open" : ""} 
                                            ${
                                              firstlevel?.selected
                                                ? "active"
                                                : ""
                                            }`}
            key={Math.random()}
          >
            {/* if it is a single link like Dashboard or Widgets or landingpage */}

            {firstlevel.type === "link" ? (
              <Link
                to={firstlevel.path || "#!"}
                className={`side-menu__item ${
                  firstlevel.selected ? "active" : "active"
                }`}
              >
                {firstlevel.icon} <span className="">{firstlevel.title}</span>
              </Link>
            ) : (
              ""
            )}

            {/* if empty type  */}

            {firstlevel.type === "empty" ? (
              <Link to="#!" className="side-menu__item">
                {firstlevel.icon} <span className=""> {firstlevel.title} </span>
              </Link>
            ) : (
              ""
            )}

            {/* //for sub level refer the Menuloop.jsx component */}

            {firstlevel.type === "sub" ? (
              <Menuloop
                MENUITEMS={firstlevel}
                toggleSidemenu={toggleSidemenu}
                level={level + 1}
              />
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default Menuloop;
