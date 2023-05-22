import { createSelector } from "@reduxjs/toolkit";
import { fetchShapes, shapeSlice } from "./templateSlice";

export const fetchUnequalAnglesCorners = fetchShapes("unequalAnglesCorners/fetchUnequalAnglesCorners", "unequalAngles");

const unequalAnglesSlice = shapeSlice("unequalAnglesCorners", fetchUnequalAnglesCorners);

export const selectAllUnequalAnglesCorners = createSelector(
  [state => state.unequalAnglesCorners.entities],
  entities => Object.values(entities)
)

export default unequalAnglesSlice.reducer;