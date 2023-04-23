import { createSlice } from "@reduxjs/toolkit";

export const pointsModeSlice = createSlice({
  name: "pointsMode",
  initialState: {
    value: false
  },
  reducers: {
    changeMode: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { changeMode } = pointsModeSlice.actions;

export default pointsModeSlice.reducer;