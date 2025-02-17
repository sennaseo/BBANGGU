import { createSlice } from '@reduxjs/toolkit';

export interface EchoSave {
  savedMoney: number;
  reducedCo2e: number;
}

interface EchoSaveState {
  echosave: EchoSave | null;
}

const initialState: EchoSaveState = {
  echosave: null,
};

const echosaveSlice = createSlice({
  name: 'echosave',
  initialState,
  reducers: {
    setEchoSave: (state, action) => {
      state.echosave = action.payload;
    },
  },
});

export const { setEchoSave } = echosaveSlice.actions;
export default echosaveSlice.reducer;   
