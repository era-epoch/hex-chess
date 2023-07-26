import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Dialogue } from '../../types';

export interface AppState {
  activeGame: boolean;
  activeDialogue: Dialogue;
}

const initialAppState: AppState = {
  activeGame: true,
  activeDialogue: Dialogue.none,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setActiveGame: (state: AppState, action: PayloadAction<boolean>) => {
      state.activeGame = action.payload;
    },
    setActiveDialogue: (state: AppState, action: PayloadAction<Dialogue>) => {
      state.activeDialogue = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { setActiveGame, setActiveDialogue } = appSlice.actions;
