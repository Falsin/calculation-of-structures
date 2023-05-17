import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const shapeAdapter = createEntityAdapter({});

export const shapeSlice = (shapeName, fetchFunc) => {
  const initialState = shapeAdapter.getInitialState({
    status: "idle",
    error: null 
  })

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
          shapeAdapter.upsertMany(state, action.payload);
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
    const response = await request.json();
    return JSON.parse(response);
  })
}