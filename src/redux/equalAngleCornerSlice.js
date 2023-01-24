import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchEqualAnglesCorners = fetchShapes("equalAnglesCorners/fetchEqualAnglesCorners", "equalAngles");

const cornerSlice = shapeSlice("equalAnglesCorners", fetchEqualAnglesCorners);

export const selectAllEqualAnglesCorners = state => state.equalAnglesCorners.equalAnglesCorners;

export default cornerSlice.reducer;