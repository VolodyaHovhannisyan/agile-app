import { BoardCanvas } from '@trello-pro/shared-ui';
import type { Board } from '@trello-pro/api-interfaces';

const exampleBoard: Board = {
  id: 'board-1',
  title: 'Trello Pro Demo Board',
  description: 'A starter board for the real-time Trello clone.',
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
      title: 'Define board contracts',
      description: 'Write shared types for boards, columns, cards, and socket events.',
      columnId: 'column-1',
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'card-2',
      title: 'Build shared UI',
      description: 'Create reusable column and card components.',
      columnId: 'column-1',
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'card-3',
      title: 'Connect socket server',
      description: 'Sync board updates through socket.io.',
      columnId: 'column-2',
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function Index() {
  return <BoardCanvas board={exampleBoard} />;
}
