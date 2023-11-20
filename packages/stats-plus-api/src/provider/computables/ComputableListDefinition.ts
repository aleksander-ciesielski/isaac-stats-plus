import type { ComputableDefinition } from "~/provider/computables/ComputableDefinition";

export type ComputableListDefinition = Record<keyof never, ComputableDefinition<any[], any>>;
