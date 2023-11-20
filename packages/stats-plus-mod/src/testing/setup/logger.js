vi.mock("../../Logger", () => ({
  Logger: new Proxy({}, {
    get: () => () => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  }),
}));
