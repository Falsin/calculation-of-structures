import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchBeams = fetchShapes("beams/fetchBeams", "beams");

export const beamsSlice = shapeSlice("beams", fetchBeams);

export const selectAllBeams = state => Object.values(state.beams.entities);

export default beamsSlice.reducer;