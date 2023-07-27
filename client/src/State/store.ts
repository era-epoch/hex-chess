import { configureStore } from '@reduxjs/toolkit';
import socketMiddleware from '../websocketMiddleware';
import rootReducer from './rootReducer';

export const store = configureStore({ reducer: rootReducer, middleware: [socketMiddleware] });
