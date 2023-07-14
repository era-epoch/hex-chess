import { createSlice } from '@reduxjs/toolkit';

export interface GameState {}

const initialGameState: GameState = {};

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {},
});

export default gameSlice.reducer;
export const {} = gameSlice.actions;
