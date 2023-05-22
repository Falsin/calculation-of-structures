import { createSelector } from "@reduxjs/toolkit";
import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchBeams = fetchShapes("beams/fetchBeams", "beams");

export const beamsSlice = shapeSlice("beams", fetchBeams);

export const selectAllBeams = createSelector(
  [state => state.beams.entities],
  entities => Object.values(entities)
)

export default beamsSlice.reducer;