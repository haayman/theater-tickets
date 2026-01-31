export type Rule = (value?: string) => boolean | string;
export type RuleSet = { [key: string]: Rule[] };
