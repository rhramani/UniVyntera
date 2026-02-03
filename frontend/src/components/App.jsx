import { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { useLocation } from "react-router-dom";
import Store from "../common/redux/Store";
import Switcher from "../layouts/Switcher";
import Header from './../layouts/Header';
import SideBar from './../layouts/sidebar/SideBar';
import Footer from './../layouts/Footer';
import Backtotop from "../layouts/Backtotop";

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {

    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Fragment>
      <Provider store={Store}>
        
        <div className="horizontalMenucontainer default-bg-color">
          <Switcher />
          <div className="page">
            <Header />
            <SideBar />
            <div className="main-content app-content" >
              <div className="container-fluid">
                <Outlet />
              </div>
            </div>
            <Footer />
          </div>
          <Backtotop />
        </div>
      </Provider>
    </Fragment>
  );
};
export default App;
