export function apiInterfaces(): string {
  return 'api-interfaces';
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Card {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  order: number; // For sorting
  assignees: User[];
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
  cardIds: string[]; // Normalized reference
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  cards: Card[]; // We'll normalize this in the store
}

// For WebSockets
export enum SocketEvents {
  CardMoved = 'card:moved',
  BoardUpdated = 'board:updated',
}
