import { createSlice } from '@reduxjs/toolkit';

export interface AppState {}

const initialAppState: AppState = {};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {},
});

export default appSlice.reducer;
export const {} = appSlice.actions;
