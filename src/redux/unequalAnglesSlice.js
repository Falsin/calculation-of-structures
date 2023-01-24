//unequalAngles
import { fetchShapes, shapeSlice } from "./templateSlice";

export const fetchUnequalAnglesCorners = fetchShapes("unequalAnglesCorners/fetchUnequalAnglesCorners", "unequalAngles");

const unequalAnglesSlice = shapeSlice("unequalAnglesCorners", fetchUnequalAnglesCorners);

export const selectAllUnequalAnglesCorners = state => state.unequalAnglesCorners.unequalAnglesCorners;

export default unequalAnglesSlice.reducer;