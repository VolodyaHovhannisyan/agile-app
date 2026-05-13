import { render } from '@testing-library/react';

import TrelloProSharedUi from './shared-ui';

describe('TrelloProSharedUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TrelloProSharedUi />);
    expect(baseElement).toBeTruthy();
  });
});
