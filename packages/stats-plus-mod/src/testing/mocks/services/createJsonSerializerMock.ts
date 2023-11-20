import type { JsonSerializer } from "~/types/JsonSerializer";
import type { Mocked } from "~/testing/types/Mocked";
import { mock } from "vitest-mock-extended";

export function createJsonSerializerMock(): Mocked<JsonSerializer> {
  const jsonService = mock<JsonSerializer>();
  jsonService.encode.mockImplementation((decoded) => JSON.stringify(decoded));
  jsonService.decode.mockImplementation((encoded) => JSON.parse(encoded));

  return jsonService;
}
