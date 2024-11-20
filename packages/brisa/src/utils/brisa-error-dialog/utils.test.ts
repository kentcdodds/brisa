import { getConstants } from '@/constants';
import { describe, it, expect, afterEach, spyOn, beforeEach } from 'bun:test';
import { getFilterDevRuntimeErrors } from './utils';

let mockLog: ReturnType<typeof spyOn>;

describe('utils - brisa-error-dialog - getFilterDevRuntimeErrors', () => {
  beforeEach(() => {
    mockLog = spyOn(console, 'log');
  });
  afterEach(() => {
    globalThis.mockConstants = undefined;
    mockLog.mockRestore();
  });
  it('should return a function if CONFIG.filterRuntimeDevErrors is a function', () => {
    globalThis.mockConstants = {
      ...getConstants(),
      CONFIG: { filterRuntimeDevErrors: () => false },
    };

    expect(getFilterDevRuntimeErrors()).toBe('() => !1');
    expect(mockLog).toBeCalledTimes(0);
  });

  it('should throws an error when CONFIG.filterRuntimeDevErrors is not a function', () => {
    globalThis.mockConstants = {
      ...getConstants(),
      CONFIG: { filterRuntimeDevErrors: false },
    } as any;

    expect(getFilterDevRuntimeErrors()).toBe('() => true');
    expect(mockLog.mock.calls.toString()).toContain(
      'CONFIG.filterRuntimeDevErrors should be a function',
    );
  });

  it('should return a function that always return true when CONFIG.filterRuntimeDevErrors is undefined', () => {
    globalThis.mockConstants = {
      ...getConstants(),
      CONFIG: { filterRuntimeDevErrors: undefined },
    };

    expect(getFilterDevRuntimeErrors()).toBe('() => true');
    expect(mockLog).toBeCalledTimes(0);
  });
});
