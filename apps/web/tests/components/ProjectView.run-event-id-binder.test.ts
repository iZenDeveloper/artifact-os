import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRunEventIdBinder } from '../../src/components/ProjectView';

describe('createRunEventIdBinder', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('coalesces rapid SSE ids into one apply after throttle', () => {
    const apply = vi.fn();
    const binder = createRunEventIdBinder({ apply, throttleMs: 200 });

    binder.onRunEventId('1');
    binder.onRunEventId('2');
    binder.onRunEventId('3');
    expect(apply).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith('3');
  });

  it('ignores duplicate ids', () => {
    const apply = vi.fn();
    const binder = createRunEventIdBinder({ apply, throttleMs: 50 });
    binder.onRunEventId('7');
    binder.onRunEventId('7');
    vi.advanceTimersByTime(50);
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith('7');

    binder.onRunEventId('7');
    vi.advanceTimersByTime(50);
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('flush applies pending id immediately', () => {
    const apply = vi.fn();
    const binder = createRunEventIdBinder({ apply, throttleMs: 500 });
    binder.onRunEventId('a');
    binder.onRunEventId('b');
    binder.flush();
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith('b');
    // Second flush is a no-op when already applied
    binder.flush();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('cancel drops pending timer without apply', () => {
    const apply = vi.fn();
    const binder = createRunEventIdBinder({ apply, throttleMs: 200 });
    binder.onRunEventId('x');
    binder.cancel();
    vi.advanceTimersByTime(500);
    expect(apply).not.toHaveBeenCalled();
  });
});
