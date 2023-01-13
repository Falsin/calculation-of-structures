import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  shapes: {
    beams: [],
    corners: []
  },
  status: "idle",
  error: null
}

export const sortamentSlice = createSlice({
  name: "sortament",
  initialState,
  reducers: {
    /* saveBeams: (state, action) => {
      state.shapes.beams = action.payload
    }, */
    saveCorners: (state, action) => {
      state.shapes.corners = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeams.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBeams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shapes.beams = JSON.parse(action.payload);
      })
      .addCase(fetchBeams.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  }
})

export const selectAllBeams = state => state.sortament.shapes.beams;
export const selectAllCorners = state => state.sortament.shapes.corners;

export const fetchBeams = createAsyncThunk("beams/fetchBeams", async () => {
  const request = await fetch("http://localhost:3000/beams/");
  const response = await request.json();
  return response;
})

export const { saveBeams, saveCorners } = sortamentSlice.actions;

export default sortamentSlice.reducer;