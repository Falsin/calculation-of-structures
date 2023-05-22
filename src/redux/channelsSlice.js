import { createSelector } from "@reduxjs/toolkit";
import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchChannels = fetchShapes("channels/fetchChannels", "channels");

const channelsSlice = shapeSlice("channels", fetchChannels);

export const selectAllChannels = createSelector(
  [state => state.channels.entities],
  entities => Object.values(entities)
)

export default channelsSlice.reducer;