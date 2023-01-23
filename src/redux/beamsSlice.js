import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchBeams = fetchShapes("beams/fetchBeams", "beams");

export const beamsSlice = shapeSlice("beams", fetchBeams);

export const saveBeams = beamsSlice.actions;

export const selectAllBeams = state => state.beams.beams;

export default beamsSlice.reducer;