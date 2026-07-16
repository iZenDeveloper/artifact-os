// @vitest-environment jsdom

import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { TodoCard } from '../../src/components/ToolCard';

describe('TodoCard completion disclosure', () => {
  afterEach(() => cleanup());

  it('collapses a fully completed checklist even while final prose is streaming', () => {
    const { container } = render(
      <TodoCard
        input={{
          todos: [
            { content: 'Read home.ts', status: 'completed' },
            { content: 'Edit home.ts', status: 'completed' },
            { content: 'Finish', status: 'completed' },
          ],
        }}
        runStreaming
        runSucceeded={false}
      />,
    );

    const toggle = container.querySelector<HTMLButtonElement>('.op-todo-toggle');
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('.op-todo')).toHaveClass('op-todo-collapsed');

    fireEvent.click(toggle!);
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
  });
});
