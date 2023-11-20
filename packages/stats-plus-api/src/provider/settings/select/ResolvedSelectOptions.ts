import type { SelectOption } from "~/provider/settings/select/SelectOption";
import type { SelectSettingAllowedValue } from "~/provider/settings/select/SelectSetting";

export type ResolvedSelectOptions<TOption extends SelectSettingAllowedValue> = SelectOption<TOption>[];
