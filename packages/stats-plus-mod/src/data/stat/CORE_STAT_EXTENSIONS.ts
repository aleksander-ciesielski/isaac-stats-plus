import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import { speed } from "~/core/stats/speed";
import { tears } from "~/core/stats/tears";
import { damage } from "~/core/stats/damage";
import { range } from "~/core/stats/range";
import { shotSpeed } from "~/core/stats/shotSpeed";
import { luck } from "~/core/stats/luck";

export const CORE_STAT_EXTENSIONS = [
  speed,
  tears,
  damage,
  range,
  shotSpeed,
  luck,
] satisfies StatExtension[];
