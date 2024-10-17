import express from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ port: 5001 }); // Separate WebSocket server on port 5001

const PORT = process.env.PORT || 5000;
const WS_PORT = 5001;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected to WebSocket');

  ws.on('message', (message: string) => {
    console.log('Received:', message);
    
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

server.listen(PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket Server is running on ws://localhost:${WS_PORT}`);
});