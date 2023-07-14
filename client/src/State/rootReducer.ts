import { combineReducers } from 'redux';
import appReducer from './Slices/appSlice';
import gameReducer from './Slices/gameSlice';

const rootReducer = combineReducers({
  app: appReducer,
  game: gameReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
