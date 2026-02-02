import { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeChanger } from "../common/redux/Action";
import  * as switcherdata from "../common/Switcherdata";
import Store from "../common/redux/Store";
import Backtotop from './../layouts/Backtotop';

const Landingpageapp = () => {

  useEffect(() => {
    switcherdata.LocalStorageBackup(ThemeChanger)
  }, [])

  return (
    <Fragment>
      <Provider store={Store}>
        <Outlet />
        <Backtotop />
      </Provider>
    </Fragment>
  );
};
export default Landingpageapp;
