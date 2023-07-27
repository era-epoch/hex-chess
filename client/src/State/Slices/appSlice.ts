import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Dialogue } from '../../types';

export interface AppState {
  activeGame: boolean;
  activeDialogue: Dialogue;
  onlineGameId: string | null;
  onlinePlayerId: string | null;
}

const initialAppState: AppState = {
  activeGame: true,
  activeDialogue: Dialogue.none,
  onlineGameId: null,
  onlinePlayerId: null,
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
    setOnlineGameId: (state: AppState, action: PayloadAction<string>) => {
      state.onlineGameId = action.payload;
    },
    setOnlinePlayerId: (state: AppState, action: PayloadAction<string>) => {
      state.onlinePlayerId = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { setActiveGame, setActiveDialogue, setOnlineGameId, setOnlinePlayerId } = appSlice.actions;
