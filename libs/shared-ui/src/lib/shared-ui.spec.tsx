import { render } from '@testing-library/react';
import type { Board } from '@trello-pro/api-interfaces';

import BoardCanvas from './shared-ui';

describe('BoardCanvas', () => {
  it('should render successfully', () => {
    const exampleBoard: Board = {
      id: 'board-1',
      title: 'Test board',
      description: 'Minimal board for rendering tests.',
      columnOrder: ['column-1'],
      columns: [
        {
          id: 'column-1',
          boardId: 'board-1',
          title: 'To do',
          order: 0,
          cardIds: ['card-1'],
        },
      ],
      cards: [
        {
          id: 'card-1',
          title: 'Sample task',
          description: 'A sample task card.',
          columnId: 'column-1',
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { baseElement } = render(<BoardCanvas board={exampleBoard} />);
    expect(baseElement).toBeTruthy();
  });
});
