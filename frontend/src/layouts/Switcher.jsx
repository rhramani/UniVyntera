import React, { Fragment, useEffect } from 'react'
import Themeprimarycolor, * as switcherdata from '../common/Switcherdata';
import { connect } from 'react-redux';
import { ThemeChanger } from '../common/redux/Action';
import { Helmet } from 'react-helmet-async';
import { Button, Nav, Offcanvas, OverlayTrigger, Tab, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Switcher = ({ local_varaiable, ThemeChanger, show, onClose }) => {
  useEffect(() => {
    switcherdata.LocalStorageBackup(ThemeChanger)
  }, [])

  const generateCustomStyles = () => {
    let styles = '';

    if (localStorage.getItem("darkBgRGB1") && localStorage.getItem("darkBgRGB2")) {
        styles += `--body-bg-rgb:${local_varaiable.bodyBg1};`;
        styles += `--body-bg-rgb2:${local_varaiable.bodyBg2};`;
        styles += `--light-rgb:${local_varaiable.bodyBg1};`;
        styles += `--form-control-bg:rgb(${local_varaiable.darkBg});`;
        styles += `--input-border:rgba(${local_varaiable.inputBorder});`;
        styles += `--sidemenu-active-bgcolor:rgb(${local_varaiable.sidemenuactive});`;
    }

    if (localStorage.getItem("primaryRGB")) {
        styles += `--primary-rgb:${local_varaiable.colorPrimaryRgb};`;
    }

    return styles;
};

const customStyles = generateCustomStyles();

  return (
    <Fragment>
      <Helmet>
        <html dir={local_varaiable.dir}
          data-theme-mode={local_varaiable.dataThemeMode}
          data-header-styles={local_varaiable.dataHeaderStyles}
          data-vertical-style={local_varaiable.dataVerticalStyle}
          data-nav-layout={local_varaiable.dataNavLayout}
          data-menu-styles={local_varaiable.dataMenuStyles}
          data-toggled={local_varaiable.toggled}
          data-nav-style={local_varaiable.dataNavStyle}
          hor-style={local_varaiable.horStyle}
          data-page-style={local_varaiable.dataPageStyle}
          data-width={local_varaiable.dataWidth}
          data-menu-position={local_varaiable.dataMenuPosition}
          data-header-position={local_varaiable.dataHeaderPosition}
          data-icon-overlay={local_varaiable.iconOverlay}
          data-bg-img={local_varaiable.bgImg}
          data-icon-text={local_varaiable.iconText}
          style={customStyles}
        >
        </html>
      </Helmet>
      <Offcanvas show={show} onHide={onClose} tabIndex={-1} id="switcher-canvas"  placement='end'>
        <Offcanvas.Header className="border-bottom">
          <h5 className="offcanvas-title text-default" id="offcanvasRightLabel">Switcher</h5>
          <Button variant='' onClick={onClose} className="btn-close" aria-label={show}></Button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Nav variant="pills" className="nav-justified border-bottom border-block-end-dashed" id='switcher-main-tab'>
              <Nav.Item><Nav.Link className="btn" eventKey="first">Theme Styles</Nav.Link></Nav.Item>

              <Nav.Item><Nav.Link className="btn" eventKey="second">Theme Colors</Nav.Link></Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="first" className='p-0'>
                <div className="border-0">
                  <div className="">
                    <p className="switcher-style-head">Theme Color Mode:</p>
                    <div className="row switcher-style gx-0">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-light-theme">
                            Light
                          </label>
                          <input className="form-check-input" type="radio" name="theme-style" id="switcher-light-theme"
                           checked={local_varaiable.dataThemeMode === 'light'}onChange={_e => { }}
                            onClick={() => { switcherdata.Light(ThemeChanger) }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-dark-theme">
                            Dark
                          </label>
                          <input className="form-check-input" type="radio" name="theme-style" id="switcher-dark-theme"
                            checked={local_varaiable.dataThemeMode === 'dark'} onChange={_e => { }}
                            onClick={() => switcherdata.Dark(ThemeChanger)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <p className="switcher-style-head">Directions:</p>
                    <div className="row switcher-style gx-0">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-ltr">
                            LTR
                          </label>
                          <input className="form-check-input" type="radio" name="direction" id="switcher-ltr"
                            checked={local_varaiable.dir == 'ltr'} onChange={_e => { }}
                            onClick={() => { switcherdata.Ltr(ThemeChanger) }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-rtl">
                            RTL
                          </label>
                          <input className="form-check-input" type="radio" name="direction" id="switcher-rtl"
                            checked={local_varaiable.dir == 'rtl'} onChange={_e => { }}
                            onClick={() => { switcherdata.Rtl(ThemeChanger) }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <p className="switcher-style-head">Navigation Styles:</p>
                    <div className="row switcher-style gx-0">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-vertical">
                            Vertical
                          </label>
                          <input className="form-check-input" type="radio" name="navigation-style" id="switcher-vertical"
                            checked={local_varaiable.dataNavLayout == 'vertical'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Vertical(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-horizontal">
                            Horizontal
                          </label>
                          <input className="form-check-input" type="radio" name="navigation-style"
                            checked={local_varaiable.dataNavLayout == 'horizontal'} onChange={(_e) => { }}
                            onClick={() => switcherdata.HorizontalClick(ThemeChanger)}
                            id="switcher-horizontal" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="navigation-menu-styles">
                    <p className="switcher-style-head">Vertical & Horizontal Menu Styles:</p>
                    <div className="row switcher-style gx-0 pb-2 gy-2">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-menu-click">
                            Menu Click
                          </label>
                          <input className="form-check-input" type="radio" name="navigation-menu-styles"
                            id="switcher-menu-click" checked={local_varaiable.dataNavStyle === 'menu-click'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Menuclick(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-menu-hover">
                            Menu Hover
                          </label>
                          <input className="form-check-input" type="radio" name="navigation-menu-styles"
                            id="switcher-menu-hover" checked={local_varaiable.dataNavStyle === 'menu-hover'} onChange={(_e) => { }}
                            onClick={() => switcherdata.MenuHover(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-icon-click">
                            Icon Click
                          </label>
                          <input className="form-check-input" type="radio" name="navigation-menu-styles"
                            id="switcher-icon-click" checked={local_varaiable.dataNavStyle === 'icon-click'} onChange={(_e) => { }}
                            onClick={() => switcherdata.IconClick(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-icon-hover">
                            Icon Hover
                          </label>
                          <input className="form-check-input" type="radio" name="navigation-menu-styles"
                            id="switcher-icon-hover" checked={local_varaiable.dataNavStyle === 'icon-hover'} onChange={(_e) => { }}
                            onClick={() => switcherdata.IconHover(ThemeChanger)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sidemenu-layout-styles">
                    <p className="switcher-style-head">Sidemenu Layout Styles:</p>
                    <div className="row switcher-style gx-0 pb-2 gy-2">
                      <div className="col-sm-6">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-default-menu">
                            Default Menu
                          </label>
                          <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                            id="switcher-default-menu" checked={local_varaiable.dataVerticalStyle === 'default'}
                            onChange={(_e) => { }} onClick={() => switcherdata.Defaultmenu(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-closed-menu">
                            Closed Menu
                          </label>
                          <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                            id="switcher-closed-menu" checked={local_varaiable.dataVerticalStyle === 'closed'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Closedmenu(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-icontext-menu">
                            Icon Text
                          </label>
                          <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                            id="switcher-icontext-menu" checked={local_varaiable.dataVerticalStyle === 'icontext'} onChange={(_e) => { }}
                            onClick={() => switcherdata.iconText(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-icon-overlay">
                            Icon Overlay
                          </label>
                          <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                            checked={local_varaiable.dataVerticalStyle === 'overlay'} onChange={(_e) => { }}
                            onClick={() => { switcherdata.iconOverayFn(ThemeChanger) }}
                            id="switcher-icon-overlay" />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-detached">
                            Detached
                          </label>
                          <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                            checked={local_varaiable.dataVerticalStyle === 'detached'} onChange={(_e) => { }}
                            onClick={() => switcherdata.DetachedFn(ThemeChanger)}
                            id="switcher-detached" />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-double-menu">
                            Double Menu
                          </label>
                          <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                            checked={local_varaiable.dataVerticalStyle === 'doublemenu'} onChange={(_e) => { }}
                            onClick={() => switcherdata.DoubletFn(ThemeChanger)}
                            id="switcher-double-menu" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <p className="switcher-style-head">Page Styles:</p>
                    <div className="row switcher-style gx-0">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-regular">
                            Regular
                          </label>
                          <input className="form-check-input" type="radio" id="switcher-regular"
                            checked={local_varaiable.dataPageStyle == 'regular'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Regular(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-classic">
                            Classic
                          </label>
                          <input className="form-check-input" type="radio" id="switcher-classic"
                            checked={local_varaiable.dataPageStyle == 'classic'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Classic(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-modern">
                            Modern
                          </label>
                          <input className="form-check-input" type="radio" id="switcher-modern"
                            checked={local_varaiable.dataPageStyle == 'modern'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Modern(ThemeChanger)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <p className="switcher-style-head">Layout Width Styles:</p>
                    <div className="row switcher-style gx-0">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-full-width">
                            Full Width
                          </label>
                          <input className="form-check-input" type="radio" name="layout-width" id="switcher-full-width"
                            checked={local_varaiable.dataWidth == 'fullwidth'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Fullwidth(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-boxed">
                            Boxed
                          </label>
                          <input className="form-check-input" type="radio" name="layout-width" id="switcher-boxed"
                            checked={local_varaiable.dataWidth == 'boxed'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Boxed(ThemeChanger)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <p className="switcher-style-head">Menu Positions:</p>
                    <div className="row switcher-style gx-0">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-menu-fixed">
                            Fixed
                          </label>
                          <input className="form-check-input" type="radio" name="menu-positions" id="switcher-menu-fixed"
                            checked={local_varaiable.dataMenuPosition == 'fixed'} onChange={(_e) => { }}
                            onClick={() => switcherdata.FixedMenu(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-menu-scroll">
                            Scrollable
                          </label>
                          <input className="form-check-input" type="radio" name="menu-positions" id="switcher-menu-scroll"
                            checked={local_varaiable.dataMenuPosition == 'scrollable'} onChange={(_e) => { }}
                            onClick={() => switcherdata.scrollMenu(ThemeChanger)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <p className="switcher-style-head">Header Positions:</p>
                    <div className="row switcher-style gx-0">
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-header-fixed">
                            Fixed
                          </label>
                          <input className="form-check-input" type="radio" name="header-positions"
                            id="switcher-header-fixed" checked={local_varaiable.dataHeaderPosition == 'fixed'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Headerpostionfixed(ThemeChanger)} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check switch-select">
                          <label className="form-check-label" htmlFor="switcher-header-scroll">
                            Scrollable
                          </label>
                          <input className="form-check-input" type="radio" name="header-positions"
                            id="switcher-header-scroll"
                            checked={local_varaiable.dataHeaderPosition == 'scrollable'} onChange={(_e) => { }}
                            onClick={() => switcherdata.Headerpostionscroll(ThemeChanger)} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second" className='p-0'>
                <div className="border-0">
                  <div>
                    <div className="theme-colors">
                      <p className="switcher-style-head">Menu Colors:</p>
                      <div className="d-flex switcher-style pb-2">
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Light Menu</Tooltip>}><input className="form-check-input color-input color-white" type="radio" name="menu-colors"
                            checked={local_varaiable.dataMenuStyles == 'light'} onChange={(_e) => { }} onClick={() => switcherdata.lightMenu(ThemeChanger)} id="switcher-menu-light" /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Dark Menu</Tooltip>}><input className="form-check-input color-input color-dark" type="radio"
                            name="menu-colors" id="switcher-menu-dark" checked={local_varaiable.dataMenuStyles == 'dark'} onChange={(_e) => { }} onClick={() => switcherdata.darkMenu(ThemeChanger)} /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Color Menu</Tooltip>}><input className="form-check-input color-input color-primary" type="radio" name="menu-colors"
                            id="switcher-menu-primary" checked={local_varaiable.dataMenuStyles == 'color'} onChange={(_e) => { }} onClick={() => switcherdata.colorMenu(ThemeChanger)} /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Gradient Menu</Tooltip>}><input className="form-check-input color-input color-gradient" type="radio" name="menu-colors"
                            id="switcher-menu-gradient" checked={local_varaiable.dataMenuStyles == 'gradient'} onChange={(_e) => { }} onClick={() => switcherdata.gradientMenu(ThemeChanger)} /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Transparent Menu</Tooltip>}><input className="form-check-input color-input color-transparent" type="radio" name="menu-colors"
                            id="switcher-menu-transparent" checked={local_varaiable.dataMenuStyles == 'transparent'} onChange={(_e) => { }} onClick={() => switcherdata.transparentMenu(ThemeChanger)} /></OverlayTrigger>
                        </div>
                      </div>
                      <div className="px-4 pb-3 text-muted fs-11">Note:If you want to change color Menu dynamically change from below Theme Primary color picker</div>
                    </div>
                    <div className="theme-colors">
                      <p className="switcher-style-head">Header Colors:</p>
                      <div className="d-flex switcher-style pb-2">
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Light Header</Tooltip>}><input className="form-check-input color-input color-white" type="radio" name="header-colors"
                            id="switcher-header-light" checked={local_varaiable.dataHeaderStyles == 'light'} onChange={(_e) => { }} onClick={() => switcherdata.lightHeader(ThemeChanger)} /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Dark Header</Tooltip>}><input className="form-check-input color-input color-dark" type="radio" name="header-colors"
                            id="switcher-header-dark" checked={local_varaiable.dataHeaderStyles == 'dark'} onChange={(_e) => { }} onClick={() => switcherdata.darkHeader(ThemeChanger)} /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Color Header</Tooltip>}><input className="form-check-input color-input color-primary" type="radio" name="header-colors"
                            id="switcher-header-primary" checked={local_varaiable.dataHeaderStyles == 'color'} onChange={(_e) => { }} onClick={() => switcherdata.colorHeader(ThemeChanger)} /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Gradient Header</Tooltip>}><input className="form-check-input color-input color-gradient" type="radio" name="header-colors"
                            id="switcher-header-gradient" checked={local_varaiable.dataHeaderStyles == 'gradient'} onChange={(_e) => { }} onClick={() => switcherdata.gradientHeader(ThemeChanger)} /></OverlayTrigger>
                        </div>
                        <div className="form-check switch-select me-3">
                          <OverlayTrigger overlay={<Tooltip>Transparent Header</Tooltip>}><input className="form-check-input color-input color-transparent" type="radio" name="header-colors"
                            id="switcher-header-transparent" checked={local_varaiable.dataHeaderStyles == 'transparent'} onChange={(_e) => { }} onClick={() => switcherdata.transparentHeader(ThemeChanger)} /></OverlayTrigger>
                        </div>
                      </div>
                      <div className="px-4 pb-3 text-muted fs-11">Note:If you want to change color Header dynamically change from below Theme Primary color picker</div>
                    </div>
                    <div className="theme-colors">
                      <p className="switcher-style-head">Theme Primary:</p>
                      <div className="d-flex flex-wrap align-items-center switcher-style">
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-primary-1" type="radio" checked={local_varaiable.colorPrimaryRgb === '58, 88, 146'}
                            name="theme-primary" id="switcher-primary" onClick={() => switcherdata.primaryColor1(ThemeChanger)} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-primary-2" type="radio" checked={local_varaiable.colorPrimaryRgb === "92, 144, 163"}
                            name="theme-primary" id="switcher-primary1" onClick={() => switcherdata.primaryColor2(ThemeChanger)} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-primary-3" type="radio" name="theme-primary" checked={local_varaiable.colorPrimaryRgb === "161, 90, 223"}
                            id="switcher-primary2" onClick={() => switcherdata.primaryColor3(ThemeChanger)} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-primary-4" type="radio" name="theme-primary" checked={local_varaiable.colorPrimaryRgb === "78, 172, 76"}
                            id="switcher-primary3" onClick={() => switcherdata.primaryColor4(ThemeChanger)} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-primary-5" type="radio" name="theme-primary" checked={local_varaiable.colorPrimaryRgb === "223, 90, 90"}
                            id="switcher-primary4" onClick={() => switcherdata.primaryColor5(ThemeChanger)} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select ps-0 mt-1 color-primary-light">
                          <div className="theme-container-primary"></div>
                          <div className="pickr-container-primary">
                            <div className="pickr">
                              <Button className='pcr-button' onClick={(ele) => {
                                if (ele.target.querySelector("input")) {
                                  ele.target.querySelector("input").click();
                                }
                              }}>
                                <Themeprimarycolor theme={local_varaiable} actionfunction={ThemeChanger} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-colors">
                      <p className="switcher-style-head">Theme Background:</p>
                      <div className="d-flex flex-wrap align-items-center switcher-style">
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-bg-1" type="radio" checked={local_varaiable.bodyBg1 === '20, 30, 96'}
                            name="theme-background" id="switcher-background"
                            onClick={() => {
                              switcherdata.backgroundColor1(ThemeChanger);
                              localStorage.getItem('spruhaMenu') && (localStorage.removeItem('spruhaMenu'), localStorage.removeItem('spruhaHeader'));
                          }}
                            onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-bg-2" type="radio" checked={local_varaiable.bodyBg1 === "8, 78, 115"}
                            name="theme-background" id="switcher-background1" 
                            onClick={() => {
                              switcherdata.backgroundColor2(ThemeChanger);
                              localStorage.getItem('spruhaMenu') && (localStorage.removeItem('spruhaMenu'), localStorage.removeItem('spruhaHeader'));
                          }} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-bg-3" type="radio" name="theme-background" checked={local_varaiable.bodyBg1 === "90, 37, 135"}
                            id="switcher-background2" 
                            onClick={() => {
                              switcherdata.backgroundColor3(ThemeChanger);
                              localStorage.getItem('spruhaMenu') && (localStorage.removeItem('spruhaMenu'), localStorage.removeItem('spruhaHeader'));
                          }} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-bg-4" type="radio" checked={local_varaiable.bodyBg1 === "24, 101, 51"}
                            name="theme-background" id="switcher-background3" 
                            onClick={() => {
                              switcherdata.backgroundColor4(ThemeChanger);
                              localStorage.getItem('spruhaMenu') && (localStorage.removeItem('spruhaMenu'), localStorage.removeItem('spruhaHeader'));
                          }} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select me-3">
                          <input className="form-check-input color-input color-bg-5" type="radio" checked={local_varaiable.bodyBg1 === "120, 66, 20"}
                            name="theme-background" id="switcher-background4" 
                            onClick={() => {
                              switcherdata.backgroundColor5(ThemeChanger);
                              localStorage.getItem('spruhaMenu') && (localStorage.removeItem('spruhaMenu'), localStorage.removeItem('spruhaHeader'));
                          }} onChange={(_e) => { }} />
                        </div>
                        <div className="form-check switch-select ps-0 mt-1 tooltip-static-demo color-bg-transparent">
                          <div className="theme-container-background"></div>
                          <div className="pickr-container-background">
                            <div className="pickr">
                              <Button className='pcr-button' onClick={(ele) => {
                                if (ele.target.querySelector("input")) {
                                  ele.target.querySelector("input").click();
                                }
                                localStorage.getItem('spruhaMenu') && (localStorage.removeItem('spruhaMenu'), localStorage.removeItem('spruhaHeader'));
                              }}>
                                <switcherdata.Themebackgroundcolor theme={local_varaiable} actionfunction={ThemeChanger} />
                              </Button>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="menu-image mb-3">
                      <p className="switcher-style-head">Menu With Background Image:</p>
                      <div className="d-flex flex-wrap align-items-center switcher-style">
                        <div className="form-check switch-select m-2">
                          <input className="form-check-input bgimage-input bg-img1" type="radio"
                            name="theme-background" id="switcher-bg-img" onClick={() => switcherdata.bgImage1(ThemeChanger)} />
                        </div>
                        <div className="form-check switch-select m-2">
                          <input className="form-check-input bgimage-input bg-img2" type="radio"
                            name="theme-background" id="switcher-bg-img1" onClick={() => switcherdata.bgImage2(ThemeChanger)} />
                        </div>
                        <div className="form-check switch-select m-2">
                          <input className="form-check-input bgimage-input bg-img3" type="radio" name="theme-background"
                            id="switcher-bg-img2" onClick={() => switcherdata.bgImage3(ThemeChanger)} />
                        </div>
                        <div className="form-check switch-select m-2">
                          <input className="form-check-input bgimage-input bg-img4" type="radio"
                            name="theme-background" id="switcher-bg-img3" onClick={() => switcherdata.bgImage4(ThemeChanger)} />
                        </div>
                        <div className="form-check switch-select m-2">
                          <input className="form-check-input bgimage-input bg-img5" type="radio"
                            name="theme-background" id="switcher-bg-img4" onClick={() => switcherdata.bgImage5(ThemeChanger)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              <div className="canvas-footer text-center">
                <Link to="#" id="reset-all" onClick={() => switcherdata.Reset(ThemeChanger)} className="btn btn-danger">Reset</Link>
              </div>
            </Tab.Content>
          </Tab.Container>
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  )
}
const mapStateToProps = (state) => ({
  local_varaiable: state
})
export default connect(mapStateToProps, { ThemeChanger })(Switcher);