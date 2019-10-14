import { ECodeRuleType } from "./types";

export interface ICodeRule {
  type: ECodeRuleType;
  note?: string;
  settings: { name: string; value: number | string }[];
}

//固定文本内容，自动
export interface ICodeRuleFormLiteral {
  type: ECodeRuleType;
  note?: string;
  content: string;
}

//传参，自动
export interface ICodeRuleFormParameterValue {
  type: ECodeRuleType;
  note?: string;
  parameterName: string;
  length: number;
}

//年，自动
export interface ICodeRuleFormYear {
  type: ECodeRuleType;
  note?: string;
  length: number;
}

//月，自动
export interface ICodeRuleFormMonth {
  type: ECodeRuleType;
  note?: string;
}

//一月中的第几天，自动
export interface ICodeRuleFormDayOfMonth {
  type: ECodeRuleType;
  note?: string;
}

// 一周中的第几天，自动
export interface ICodeRuleFormDayOfWeek {
  type: ECodeRuleType;
  note?: string;
}

//一年中的第几天，自动
export interface ICodeRuleFormDayOfYear {
  type: ECodeRuleType;
  note?: string;
}

// 一年中的第几周，自动
export interface ICodeRuleFormWeekOfYear {
  type: ECodeRuleType;
  note?: string;
}

// (自增)流水号，自动
export interface ICodeRuleFormAutoIncrement {
  type: ECodeRuleType;
  scope: string;
  period: "forever" | "day" | "month" | "year";
  length: number;
  paddingCharactor: string;
  start: number;
  // step?: number; //暂时用不到
  /** 当前自增数 */
  currentAutoNumber?: number | string;
  note?: string;
}

// 校验码, 自动
export interface ICodeRuleFormChecksum {
  type: ECodeRuleType;
  algorithm: string;
  length: number;
  paddingCharactor: string;
  note?: string;
}

// 文本内容，手动
export interface ICodeRuleFormUserInput {
  type: ECodeRuleType;
  length: number;
  parameterName: string;
  note?: string;
  /** userInputValue 字段仅在序列号维护的时候有效 */
  userInputValue?: string;
}

export interface IRule {
  segments: ICodeRule[];
}
