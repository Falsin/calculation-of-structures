import { createSlice } from "@reduxjs/toolkit";

export const sortamentSlice = createSlice({
  name: "sortament",
  initialState: {
    beams: [],
    corners: []
  },
  reducers: {
    saveBeams: (state, action) => {
      state.beams = action.payload
    },
    saveCorners: (state, action) => {
      state.corners = action.payload
    }
  }
})

export const { saveBeams, saveCorners } = sortamentSlice.actions;

export default sortamentSlice.reducer;