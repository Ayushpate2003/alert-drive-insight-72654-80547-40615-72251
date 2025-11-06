import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { randomUUID } from 'crypto';

const app = express();
app.use(cors({ origin: '*'}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*'}
});

io.on('connection', (socket) => {
  socket.on('join-fleet', (orgId) => {
    if (orgId) socket.join(`fleet:${orgId}`);
  });

  socket.on('driver-alert', (evt) => {
    const eventId = evt?.eventId || randomUUID();
    const payload = { ...evt, eventId, t1_server: Date.now() / 1000 };
    if (evt?.orgId) io.to(`fleet:${evt.orgId}`).emit('alert', payload);
    io.emit('alert', payload);
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/emit', (req, res) => {
  const evt = req.body || {};
  const eventId = evt?.eventId || randomUUID();
  const payload = { ...evt, eventId, t1_server: Date.now() / 1000 };
  if (evt?.orgId) io.to(`fleet:${evt.orgId}`).emit('alert', payload);
  io.emit('alert', payload);
  res.json({ ok: true, eventId });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server listening on http://localhost:${PORT}`);
});
