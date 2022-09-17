// eslint-disable-next-line import/no-extraneous-dependencies
import { act } from '@testing-library/react';

export * from '@testing-library/react';

export function asyncFlush() {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function waitForComponentToPaint() {
  await act(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}
