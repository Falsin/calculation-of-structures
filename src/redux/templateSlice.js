import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const shapeSlice = (shapeName, fetchFunc) => {
  const initialState = { 
    [shapeName]: [], 
    status: "idle",
    error: null 
  }

  return createSlice({
    name: shapeName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchFunc.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchFunc.fulfilled, (state, action) => {
          state.status = "succeeded";
          state[shapeName] = JSON.parse(action.payload);
        })
        .addCase(fetchFunc.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        })
    }
  })
}

export const fetchShapes = (type, shape) => {
  return createAsyncThunk(type, async () => {
    const request = await fetch(`http://localhost:3000/sortament/${shape}/`);
    return await request.json();
  })
}