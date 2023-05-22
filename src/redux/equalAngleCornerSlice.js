import { createSelector } from "@reduxjs/toolkit";
import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchEqualAnglesCorners = fetchShapes("equalAnglesCorners/fetchEqualAnglesCorners", "equalAngles");

const cornerSlice = shapeSlice("equalAnglesCorners", fetchEqualAnglesCorners);

export const selectAllEqualAnglesCorners = createSelector(
  [state => state.equalAnglesCorners.entities],
  entities => Object.values(entities)
)

export default cornerSlice.reducer;