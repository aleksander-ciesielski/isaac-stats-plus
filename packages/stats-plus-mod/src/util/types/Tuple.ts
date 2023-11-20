type TupleOf<N extends number, T, R extends unknown[]> =
  R["length"] extends N
    ? R
    : TupleOf<N, T, [T, ...R]>;

export type Tuple<N extends number, T> =
  number extends N
    ? T[]
    : TupleOf<N, T, []>;
