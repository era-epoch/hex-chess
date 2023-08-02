import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Alert, Dialogue, LogItem, PlayerSide } from '../../types';

export interface AppState {
  activeGame: boolean;
  activeDialogue: Dialogue;
  onlineGameId: string | null;
  onlinePlayerId: string | null;
  playerName: string;
  playerSide: PlayerSide;
  opponentName: string | null;
  alerts: Alert[];
  log: LogItem[];
  servicePopulation: number;
  searchingForGame: boolean;
}

const initialAppState: AppState = {
  activeGame: true,
  activeDialogue: Dialogue.none,
  onlineGameId: null,
  onlinePlayerId: null,
  playerName: 'Player' + Math.random().toString().slice(-4, -1),
  opponentName: null,
  playerSide: PlayerSide.random,
  alerts: [],
  log: [],
  servicePopulation: 0,
  searchingForGame: false,
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
    setPlayerName: (state: AppState, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    setPlayerSide: (state: AppState, action: PayloadAction<PlayerSide>) => {
      state.playerSide = action.payload;
    },
    pushAlert: (state: AppState, action: PayloadAction<Alert>) => {
      state.alerts.push(action.payload);
    },
    killAlertByID: (state: AppState, action: PayloadAction<string>) => {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert !== undefined) {
        alert.alive = false;
      }
    },
    removeAlertByID: (state: AppState, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
    setOpponentName: (state: AppState, action: PayloadAction<string>) => {
      state.opponentName = action.payload;
    },
    pushLogItem: (state: AppState, action: PayloadAction<LogItem>) => {
      state.log.push(action.payload);
    },
    setServicePopulation: (state: AppState, action: PayloadAction<number>) => {
      state.servicePopulation = action.payload;
    },
    setSearchingForGame: (state: AppState, action: PayloadAction<boolean>) => {
      state.searchingForGame = action.payload;
    },
  },
});

export default appSlice.reducer;
export const {
  setActiveGame,
  setActiveDialogue,
  setOnlineGameId,
  setOnlinePlayerId,
  pushAlert,
  removeAlertByID,
  killAlertByID,
  setPlayerName,
  setPlayerSide,
  setOpponentName,
  pushLogItem,
  setServicePopulation,
  setSearchingForGame,
} = appSlice.actions;
