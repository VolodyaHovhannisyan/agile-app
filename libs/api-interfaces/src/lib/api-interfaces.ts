export interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
  cardIds: string[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  columnOrder: string[];
  columns: Column[];
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardSnapshotPayload {
  board: Board;
  version: number;
}

export interface CardMovedPayload {
  boardId: string;
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
}

export interface CardCreatedPayload {
  boardId: string;
  columnId: string;
  card: Card;
}

export interface ColumnCreatedPayload {
  boardId: string;
  column: Column;
}

export enum SocketEvents {
  connect = 'connect',
  disconnect = 'disconnect',
  boardSnapshot = 'board:snapshot',
  cardMoved = 'card:moved',
  cardCreated = 'card:created',
  columnCreated = 'column:created',
  boardUpdated = 'board:updated',
  joinBoard = 'board:join'
}
