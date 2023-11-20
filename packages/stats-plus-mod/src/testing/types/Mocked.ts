import type { MockProxy } from "vitest-mock-extended";

export type Mocked<TValue> = MockProxy<TValue> & TValue;
