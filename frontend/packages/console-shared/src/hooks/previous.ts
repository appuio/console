import { useMemo } from 'react';

export const usePrevious = <P = any>(value: P, deps: any[] = []): P =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => value, deps);