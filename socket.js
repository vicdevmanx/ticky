import { io } from 'socket.io-client';

// Create a socket connection to the server
export const socket = io('https://ticky-api.onrender.com');
//http://192.168.2.80:3000