import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  shapes: {
    beams: [],
    channels: []
  },
  status: "idle",
  error: null
}

export const sortamentSlice = createSlice({
  name: "sortament",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShapes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchShapes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shapes[action.meta.arg] = JSON.parse(action.payload);
      })
      .addCase(fetchShapes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  }
})

export const selectAllBeams = state => state.sortament.shapes.beams;
export const selectAllChannels = state => state.sortament.shapes.channels;

export const fetchShapes = createAsyncThunk("sortament/fetchShapes", async (shape) => {
  const request = await fetch(`http://localhost:3000/${shape}/`);
  return await request.json();
})

export const { saveBeams, saveCorners } = sortamentSlice.actions;

export default sortamentSlice.reducer;