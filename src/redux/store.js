import { configureStore } from "@reduxjs/toolkit";
import sortamentReducer from "./sortamentSlice";
import beamsReducer from "./beamsSlice";


export default configureStore({
  reducer: {
    sortament: sortamentReducer,
    beams: beamsReducer,
  },
})