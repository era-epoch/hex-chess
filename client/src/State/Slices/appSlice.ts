import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AppState {
  activeGame: boolean;
}

const initialAppState: AppState = {
  activeGame: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setActiveGame: (state: AppState, action: PayloadAction<boolean>) => {
      state.activeGame = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { setActiveGame } = appSlice.actions;
