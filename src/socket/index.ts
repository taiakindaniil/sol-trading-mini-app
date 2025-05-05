import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/config';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
export const socket = io(API_BASE_URL, {
    autoConnect: false,
    transports: ['websocket'],
    extraHeaders: {
        "ngrok-skip-browser-warning": "69420"
    },
});