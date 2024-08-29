import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "../Reducers/RegistrationReducer/register";

export const store = configureStore({
    reducer:{
        register:registerReducer,
    }
})


export default store;