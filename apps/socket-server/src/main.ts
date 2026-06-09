import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {
  Board,
  BoardSnapshotPayload,
  CardCreatedPayload,
  CardMovedPayload,
  ColumnCreatedPayload,
  SocketEvents,
} from '@trello-pro/api-interfaces';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const initialBoard: Board = {
  id: 'board-1',
  title: 'Trello Pro Board',
  description: 'A real-time board powered by socket.io and Redux Toolkit.',
  columnOrder: ['column-1', 'column-2', 'column-3'],
  columns: [
    {
      id: 'column-1',
      boardId: 'board-1',
      title: 'To do',
      order: 0,
      cardIds: ['card-1', 'card-2'],
    },
    {
      id: 'column-2',
      boardId: 'board-1',
      title: 'In progress',
      order: 1,
      cardIds: ['card-3'],
    },
    {
      id: 'column-3',
      boardId: 'board-1',
      title: 'Done',
      order: 2,
      cardIds: [],
    },
  ],
  cards: [
    {
      id: 'card-1',
      title: 'Design board API',
      description: 'Define socket payloads and board state shapes.',
      columnId: 'column-1',
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'card-2',
      title: 'Create shared UI library',
      description: 'Build reusable column and card components.',
      columnId: 'column-1',
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'card-3',
      title: 'Implement socket server',
      description: 'Broadcast board snapshots and card moves.',
      columnId: 'column-2',
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const currentBoard = { ...initialBoard };
let version = 1;

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.emit(SocketEvents.boardSnapshot, {
    board: currentBoard,
    version,
  } as BoardSnapshotPayload);

  socket.on(SocketEvents.joinBoard, (payload: { boardId: string }) => {
    console.log(`Socket ${socket.id} joined board ${payload.boardId}`);
    socket.join(payload.boardId);
  });

  socket.on(SocketEvents.cardMoved, (payload: CardMovedPayload) => {
    console.log(`Card moved event received`, payload);
    const { cardId, fromColumnId, toColumnId, toIndex } = payload;
    const fromColumn = currentBoard.columns.find((column) => column.id === fromColumnId);
    const toColumn = currentBoard.columns.find((column) => column.id === toColumnId);
    const card = currentBoard.cards.find((item) => item.id === cardId);

    if (!fromColumn || !toColumn || !card) {
      return;
    }

    fromColumn.cardIds = fromColumn.cardIds.filter((id) => id !== cardId);
    toColumn.cardIds = [...toColumn.cardIds.slice(0, toIndex), cardId, ...toColumn.cardIds.slice(toIndex)];
    card.columnId = toColumnId;
    card.updatedAt = new Date().toISOString();
    version += 1;

    const snapshot: BoardSnapshotPayload = {
      board: currentBoard,
      version,
    };

    io.emit(SocketEvents.boardSnapshot, snapshot);
  });

  socket.on(SocketEvents.cardCreated, (payload: CardCreatedPayload) => {
    console.log(`Card created event received`, payload);
    currentBoard.cards.push(payload.card);
    const column = currentBoard.columns.find((item) => item.id === payload.columnId);
    if (column) {
      column.cardIds.push(payload.card.id);
    }
    version += 1;
    io.emit(SocketEvents.boardSnapshot, { board: currentBoard, version } as BoardSnapshotPayload);
  });

  socket.on(SocketEvents.columnCreated, (payload: ColumnCreatedPayload) => {
    console.log(`Column created event received`, payload);
    currentBoard.columns.push(payload.column);
    currentBoard.columnOrder.push(payload.column.id);
    version += 1;
    io.emit(SocketEvents.boardSnapshot, { board: currentBoard, version } as BoardSnapshotPayload);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
