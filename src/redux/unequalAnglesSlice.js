import { fetchShapes, shapeSlice } from "./templateSlice";

export const fetchUnequalAnglesCorners = fetchShapes("unequalAnglesCorners/fetchUnequalAnglesCorners", "unequalAngles");

const unequalAnglesSlice = shapeSlice("unequalAnglesCorners", fetchUnequalAnglesCorners);

export const selectAllUnequalAnglesCorners = state => Object.values(state.unequalAnglesCorners.entities);

export default unequalAnglesSlice.reducer;