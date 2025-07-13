import { createSlice } from '@reduxjs/toolkit';

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    step: 1,
    formData: {},
  },
  reducers: {
    nextStep: (state) => { state.step += 1; },
    prevStep: (state) => { state.step -= 1; },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
});

export const { nextStep, prevStep, updateFormData } = propertySlice.actions;
export default propertySlice.reducer;
