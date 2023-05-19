import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";

const shapeCollectionSliceAdapter = createEntityAdapter({});

const shapeCollectionSlice = createSlice({
  name: "shapeCollection",
  initialState: shapeCollectionSliceAdapter.getInitialState(),
  reducers: {
    addShape: {
      reducer: shapeCollectionSliceAdapter.addOne,
      prepare: (shape) => {
        return {
          payload: {
            ...shape,
            id: nanoid(),
          }
        }
      }
    },
    removeShape: shapeCollectionSliceAdapter.removeOne,
    updateShape: shapeCollectionSliceAdapter.updateOne
  },
})

export const { addShape, removeShape, updateShape } = shapeCollectionSlice.actions;
 
export const {
  selectAll: selectAllShapes,
  selectById: selectSpecificShape
} = shapeCollectionSliceAdapter.getSelectors(state => state.shapeCollection)

export default shapeCollectionSlice.reducer;