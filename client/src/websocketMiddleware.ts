import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

const socketMiddleware: Middleware = (api: MiddlewareAPI) => {
  let socket: Socket | null = null;
  return (next: Dispatch<AnyAction>) => (action: any) => {
    switch (action.type) {
      default:
        return next(action);
    }
  };
};
