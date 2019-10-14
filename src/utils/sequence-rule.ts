import _ from "lodash";
import produce from "immer";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);

import {
  ICodeRule,
  ICodeRuleFormYear,
  ICodeRuleFormWeekOfYear,
  ICodeRuleFormUserInput,
  ICodeRuleFormParameterValue,
  ICodeRuleFormMonth,
  ICodeRuleFormLiteral,
  ICodeRuleFormDayOfYear,
  ICodeRuleFormAutoIncrement,
  ICodeRuleFormChecksum,
  ICodeRuleFormDayOfMonth,
  ICodeRuleFormDayOfWeek,
} from "../models/code-rule";
import { ECodeRuleType } from "../models/types";
import { lang } from "../lingual";
import { decimalSum } from "./number-calculator";

export function getSequenceCodeLength(codeRules: ICodeRule[]): number {
  return (codeRules || []).reduce((total, rule) => {
    return total + getCodeLength(rule);
  }, 0);
}

export function getCodeLength(codeRule: ICodeRule) {
  if (!codeRule) {
    return 0;
  }

  const codeRuleMap: any = parseCodeRuleMap(codeRule);
  switch (codeRule.type) {
    case ECodeRuleType.AutoIncrement:
    case ECodeRuleType.Checksum:
    case ECodeRuleType.WeekOfYear:
    case ECodeRuleType.DayOfMonth:
    case ECodeRuleType.DayOfWeek:
    case ECodeRuleType.DayOfYear:
    case ECodeRuleType.Year:
    case ECodeRuleType.Month:
    case ECodeRuleType.UserInput:
      return codeRuleMap.length ? parseInt(codeRuleMap.length, 10) : 0;
    case ECodeRuleType.Literal:
    case ECodeRuleType.ParameterValue:
      return codeRuleMap.content ? codeRuleMap.content.length : 0;
    default:
      return 0;
  }
}

export function getCodeTypeName(type: ECodeRuleType) {
  if (!type) {
    return "-";
  }

  return lang[`sequence_${type}`] || "-";
}

export function getCodeContent(codeRule: ICodeRule, options?: IPreviewSequenceCodeOptions) {
  if (!codeRule) {
    return "";
  }

  const { editableText, autoIncrementOffset } = options || ({} as IPreviewSequenceCodeOptions);
  const codeRuleMap: any = parseCodeRuleMap(codeRule);
  switch (codeRule.type) {
    case ECodeRuleType.UserInput:
      return renderUserInput(codeRuleMap, editableText);
    case ECodeRuleType.AutoIncrement:
      return renderAutoIncrement(codeRuleMap, autoIncrementOffset);
    case ECodeRuleType.Checksum:
      return renderChecksum(codeRuleMap);
    case ECodeRuleType.WeekOfYear:
      return renderWeekOfYear(codeRuleMap);
    case ECodeRuleType.DayOfMonth:
      return renderDayOfMonth(codeRuleMap);
    case ECodeRuleType.DayOfWeek:
      return renderDayOfWeek(codeRuleMap);
    case ECodeRuleType.DayOfYear:
      return renderDayOfYear(codeRuleMap);
    case ECodeRuleType.Year:
      return renderYear(codeRuleMap);
    case ECodeRuleType.Month:
      return renderMonth(codeRuleMap);
    case ECodeRuleType.Literal:
      return renderLiteral(codeRuleMap);
    case ECodeRuleType.ParameterValue:
      return renderParamaterValue(codeRuleMap);
    default:
      return "";
  }
}

export interface IPreviewSequenceCodeOptions {
  editableText?: boolean; //用户输入是否可编辑（即：文本）
  autoIncrementOffset?: number; //自增偏移量
}

export function previewSequenceCode(segments: ICodeRule[], options?: IPreviewSequenceCodeOptions) {
  if (!segments) {
    return;
  }

  return segments.reduce((content, codeRule) => {
    return (content += getCodeContent(codeRule, options));
  }, "");
}

interface ICodeRuleMap {
  [key: string]: any;
}

export function parseCodeRuleMap(codeRule: ICodeRule): ICodeRuleMap {
  if (!codeRule) {
    return {};
  }

  let codeRuleMap: ICodeRuleMap = {
    type: codeRule.type,
    note: codeRule.note,
  };

  return (codeRule.settings || []).reduce((settingMap, setting) => {
    return produce(settingMap, (draft) => {
      let value = setting.value;
      if (["length", "start"].includes(setting.name)) {
        value = setting.value ? parseInt(setting.value as string, 10) : 0;
      }
      draft[setting.name] = value;
    });
  }, codeRuleMap);
}

export function parseCodeRule(codeRuleMap: ICodeRuleMap): ICodeRule {
  let codeRule: ICodeRule = {
    type: undefined,
    note: undefined,
    settings: [],
  };

  if (!codeRuleMap) {
    return codeRule;
  }

  return Object.keys(codeRuleMap).reduce((segment, key) => {
    const value = codeRuleMap[key];
    if (key === "type" || key === "note") {
      segment[key] = value;
    } else {
      segment.settings.push({
        name: key,
        value: key === "length" ? (value ? parseInt(value as string, 10) : 0) : value,
      });
    }

    return segment;
  }, codeRule);
}

export function renderLiteral(form: ICodeRuleFormLiteral) {
  return form.content;
}

export function renderUserInput(form: ICodeRuleFormUserInput, editable?: boolean) {
  if (editable) {
    return _.padEnd(form.userInputValue != null ? form.userInputValue : "", form.length, "_");
  }

  return _.padStart("", form.length, "X");
}

export function renderParamaterValue(form: ICodeRuleFormParameterValue) {
  return `\${${form.parameterName || ""}}`;
}

export function renderYear(form: ICodeRuleFormYear) {
  return dayjs().format(form.length == 2 ? "YY" : "YYYY");
}

export function renderMonth(form: ICodeRuleFormMonth) {
  return dayjs().format("MM");
}

export function renderDayOfMonth(form: ICodeRuleFormDayOfMonth) {
  return dayjs().format("DD");
}

export function renderWeekOfYear(form: ICodeRuleFormWeekOfYear) {
  return _.padStart(
    dayjs()
      .week()
      .toString(),
    2,
    "0"
  );
}

export function renderDayOfWeek(form: ICodeRuleFormDayOfWeek) {
  return dayjs().format("d");
}

export function renderAutoIncrement(form: ICodeRuleFormAutoIncrement, offset: number = 0) {
  /** 初始值大于当前自增值时，以开始值为起始值 */
  const start = form.start || 1;
  const current = form.currentAutoNumber || 1;
  const previewStart = start > current ? start : current;

  return _.padStart(`${decimalSum(previewStart as number, offset)}`, form.length, form.paddingCharactor || "0");
}

export function renderChecksum(form: ICodeRuleFormChecksum) {
  return _.padStart("", form.length, form.paddingCharactor);
}

export function renderDayOfYear(form: ICodeRuleFormDayOfYear) {
  return _.padStart(
    dayjs()
      .dayOfYear()
      .toString(),
    3,
    "0"
  );
}
