// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './PropertySlice'


export const store = configureStore({
  reducer: {
    property: propertyReducer,
  },
});

