import { configureStore } from "@reduxjs/toolkit";
import beamsReducer from "./beamsSlice";
import channelsReducer from "./channelsSlice";
import equalAnglesCornersReducer from "./equalAngleCornerSlice";
import unequalAnglesCornersReducer from "./unequalAnglesSlice";

export default configureStore({
  reducer: {
    beams: beamsReducer,
    channels: channelsReducer,
    equalAnglesCorners: equalAnglesCornersReducer,
    unequalAnglesCorners: unequalAnglesCornersReducer,
  },
})