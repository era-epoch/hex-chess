import { Server } from 'socket.io';

export const RoomExists = (io: Server, room: string): boolean => {
  const rooms = io.of('/').adapter.rooms;
  return rooms.has(room);
};
