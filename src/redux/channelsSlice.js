import { shapeSlice, fetchShapes } from "./templateSlice";

export const fetchChannels = fetchShapes("channels/fetchChannels", "channels");

const channelsSlice = shapeSlice("channels", fetchChannels);

export const selectAllChannels = state => state.channels.channels;

export default channelsSlice.reducer;