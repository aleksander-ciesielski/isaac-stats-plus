import type { API } from "~/API";

declare global {
  export interface AddCallbackParameters {
    STATS_PLUS_REGISTER: [(statsPlus: API) => void];
  }
}
