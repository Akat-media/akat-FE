import { io } from 'socket.io-client';
import { BaseUrlSocket } from '../../constants';

const socket = io(BaseUrlSocket, {
  transports: ['websocket'],
  withCredentials: true, // nếu backend yêu cầu cookie/session
});

export default socket;
