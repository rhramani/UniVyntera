

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import themeReducer from './Reducer';
// import rootReducer from '../../redux/reducers/Index.reducer';

const middleware = [thunk];

const Store = configureStore({reducer: themeReducer, middleware: middleware})

export default Store;
