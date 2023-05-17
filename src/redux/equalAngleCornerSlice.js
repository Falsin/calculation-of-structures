import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchEqualAnglesCorners = fetchShapes("equalAnglesCorners/fetchEqualAnglesCorners", "equalAngles");

const cornerSlice = shapeSlice("equalAnglesCorners", fetchEqualAnglesCorners);

export const selectAllEqualAnglesCorners = state => Object.values(state.equalAnglesCorners.entities);

export default cornerSlice.reducer;