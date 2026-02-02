import React, { Fragment } from 'react'
import Store from '../common/redux/Store';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Switcher from './../layouts/Switcher';

const Firebaselayout = () => {
  return (
    <Fragment>
      <Helmet><body className="error-1" /></Helmet>
      <Provider store={Store}>
        <Switcher />
        <Outlet />
      </Provider>
    </Fragment>
  )
}

export default Firebaselayout
