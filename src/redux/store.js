import { configureStore } from "@reduxjs/toolkit";
import sortamentReducer from "./sortamentSlice";


export default configureStore({
  reducer: {
    sortament: sortamentReducer
  },
})