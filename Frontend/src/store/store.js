import {configureStore} from "@reduxjs/toolkit";
import khaltiSlice from "./khaltiSlice"
import authReducer from './authSlice'; 
const store=configureStore({
    reducer:{
        khalti:khaltiSlice,
        auth:authReducer
    }
})
export default store