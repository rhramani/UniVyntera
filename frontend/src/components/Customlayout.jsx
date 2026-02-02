import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import Switcher from '../layouts/Switcher'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from '../common/redux/Store'

export function Customlayout() {
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
