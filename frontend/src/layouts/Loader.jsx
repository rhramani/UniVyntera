import React, { Fragment } from 'react'
import ALLImages from './../common/Imagedata';

const Loader = () => {
    return (
        <Fragment>
            <div id="loader" >
                <img src={ALLImages('media79')} alt="" />
            </div>
        </Fragment>
    )
}

export default Loader;
