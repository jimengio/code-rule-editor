// Self-made form layout utilities

// To learn more https://github.com/beego/dev/issues/723#issuecomment-377137166

import * as React from "react";
import { CSSProperties, ReactNode } from "react";
import { isString, values, isNil, isObject } from "lodash-es";
import { css, cx } from "emotion";
import { inlineRow, column, row, flex } from "@jimengio/flex-styles";
import { lang, formatString } from "./lingual";
import Input from "antd/lib/input";
import Alert from "antd/lib/alert";
import Select from "antd/lib/select";

import TextArea from "antd/lib/input/TextArea";
import { immerMerge } from "@jimengio/shared-utils";
let { Option } = Select;

export interface ISingleValidationResult {
  failed: boolean;
  reason?: string;
}

export interface IValidationInfomation {
  [field: string]: string;
}

export interface IValidationResult {
  passed?: boolean;
  information?: IValidationInfomation;
}

type IValidationRule = (data: any) => ISingleValidationResult;

interface IValidationFieldItems {
  field: string;
  rules: IValidationRule[];
}

export type IValidationFields = IValidationFieldItems[];

// to generate errors
export type IShapedFailures<T> = { [P in keyof T]?: string };
export type IShapedRules<T> = { [P in keyof T]?: (form: T) => string };

// code outdated, see https://github.com/beego/fi/pull/1247
export const validationMethods = {
  required: (data): ISingleValidationResult => {
    const defaultFailed = { failed: true, reason: lang.lblRequired };

    if (data == null) {
      return defaultFailed;
    } else if (isString(data)) {
      if (data.length === 0) {
        return defaultFailed;
      }
    } else if (Array.isArray(data)) {
      if (!data.length) {
        return defaultFailed;
      }
    }

    return { failed: false };
  },
  digital: (data): ISingleValidationResult => {
    if (data === null || data === undefined || typeof data === "number") {
      return { failed: false };
    }

    const n = parseFloat(data);
    if (String(n) !== data)
      return {
        failed: true,
        reason: `${data} is not digital`,
      };

    return { failed: false };
  },
  maxLength: (n) => (data): ISingleValidationResult => {
    if (data.length != null) {
      if (data.length <= n) {
        return { failed: false };
      } else {
        return { failed: true, reason: formatString(lang.maxStringLength, { n }) };
      }
    }

    return { failed: true, reason: `${data} has no length property` };
  },
  minLength: (n) => (data): ISingleValidationResult => {
    if (data.length != null) {
      if (data.length >= n) {
        return { failed: false };
      } else {
        return { failed: true, reason: formatString(lang.minStringLength, { n }) };
      }
    }
    return { failed: true, reason: `${data} has no length property` };
  },
  fn: (f) => (data): ISingleValidationResult => {
    return f(data);
  },
};

// function outdated, see https://github.com/beego/fi/pull/1247
export function isFailuresEmpty(failures: object): boolean {
  return values(failures).every(isNil);
}

// form rows

interface IFieldBaseOptions {
  label?: string; // for null label, just display empty
  showRequired?: boolean;
  classFormLabel?: string;
  classRow?: string;
  styleRow?: CSSProperties;
  styleFormLabel?: CSSProperties;
  validationFailure?: string | string[] | number;
  key?: string;
  hideSymbolColon?: boolean;
  labelInfo?: string;
}

interface IFieldOptions extends IFieldBaseOptions {
  inline?: boolean;
}

interface IFailureInfo {
  type: "warning" | "error";
  text: string;
}

let renderFailure = (failure) => {
  if (failure == null) {
    return null;
  }
  if (isString(failure)) {
    return <div className={styleFormInvalid}>{failure}</div>;
  }
  if (isObject(failure)) {
    let failureInfo = failure as IFailureInfo;
    switch (failureInfo.type) {
      case "warning":
        return (
          <div className={styleAlertWrapper}>
            <Alert message={failureInfo.text} type="warning" />
          </div>
        );
      case "error":
        return (
          <div className={styleAlertWrapper}>
            <Alert message={failureInfo.text} type="error" />>
          </div>
        );
    }
  }

  console.log("Failed ro render failure", failure);
  throw new Error("Failed ro render failure");
};

export class LabeledField extends React.Component<IFieldOptions, any> {
  render() {
    let options = this.props;
    let valueItem = this.props.children;

    const styleMargin = !options.inline ? styleFormRowMargin : "";
    const styleRow = !options.inline ? row : inlineRow;
    const styleLabel = !options.inline ? styleLabelLayout : "";

    return (
      <div className={cx(styleRow, styleFormRow, styleMargin, options.classRow)} style={options.styleRow} key={options.key}>
        {(options.showRequired || options.label) && (
          <div className={cx(styleLabel, styleFormLabel, options.classFormLabel)} style={options.styleFormLabel}>
            {options.showRequired ? <span className={styleFormRequired}>*</span> : null}
            {options.label}
            {!this.props.hideSymbolColon && <span>{options.label !== null ? lang.symbolColon : null}</span>}
          </div>
        )}
        <div className={cx(flex, styleFormValueContainer)}>
          {valueItem}
          {options.validationFailure ? renderFailure(options.validationFailure) : null}
        </div>
      </div>
    );
  }
}

interface IFieldInputOptions extends IFieldBaseOptions {
  styleInput?: CSSProperties;
  type?: "text" | "password";
  inline?: boolean;
  value: string | number;
  placeholder?: string;
  multiline?: boolean;
  styleFormLabel?: CSSProperties;
  onChange: (value) => void;
  classRow?: string;
  uneditable?: boolean;
  maxLength?: any;
}

export class LabeledFieldInput extends React.Component<IFieldInputOptions, any> {
  render() {
    let options = this.props;
    let uneditable = this.props.uneditable;

    return (
      <LabeledField {...options}>
        {options.multiline ? (
          <TextArea
            style={immerMerge(styleInput, options.styleInput)}
            value={options.value}
            placeholder={options.placeholder}
            onChange={(event) => {
              let value = event.target.value;
              options.onChange(value);
            }}
          />
        ) : (
          <Input
            style={immerMerge(styleInput, options.styleInput)}
            value={options.value}
            disabled={uneditable}
            type={options.type}
            placeholder={options.placeholder}
            onChange={(event) => {
              let value = event.target.value;
              options.onChange(value);
            }}
            maxLength={options.maxLength}
          />
        )}
      </LabeledField>
    );
  }
}

interface ISelectCandidate {
  key?: string; // by default, value can be used as keys
  value: string | number;
  display: string;
}

export interface IFieldSelectOptions extends IFieldBaseOptions {
  value: string | number;
  candidates: ISelectCandidate[];
  onChange: (value) => void;
  allowClear?: boolean;
  selectStyle?: CSSProperties;
  placeholder?: string;
  classRow?: string;
  inline?: boolean;
  disabled?: boolean;
}

export class LabeledFieldSelect extends React.Component<IFieldSelectOptions, any> {
  render() {
    let options = this.props;

    let { allowClear, showRequired = false, disabled } = this.props;

    let canBeCleared = allowClear != null ? allowClear : !showRequired;

    return (
      <LabeledField {...options}>
        <Select
          value={this.props.value || undefined}
          onChange={(value) => {
            this.props.onChange(value);
          }}
          className={styleSelect}
          allowClear={canBeCleared}
          style={options.selectStyle}
          placeholder={options.placeholder}
          disabled={disabled}
        >
          {options.candidates.map((candidate) => {
            return (
              <Option key={candidate.key || candidate.value} value={candidate.value}>
                {candidate.display}
              </Option>
            );
          })}
        </Select>
      </LabeledField>
    );
  }
}

interface IEmptyFieldOptions {
  classRow?: string;
  styleRow?: CSSProperties;
  classFormLabel?: string;
  styleFormLabel?: CSSProperties;
  validationFailure?: string;
  key?: string;
}

// common styles for immer-forms
// layout primatives defined in ./layout.ts

export const styleFormContainer = css`
  max-height: 1000px;
  transition-duration: 300ms;
`;

export const styleFormRowsList = null;

export const styleFormRow = css`
  line-height: 32px;
`;

export const styleFormRowMargin = css`
  margin-bottom: 16px;

  /*
  &:last-child {
    margin-bottom: 0;
  }
  */
`;

export const styleFormLabel = css`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin-right: 8px;
`;

export const styleLabelLayout = css`
  width: 9.86%;
  width: max-content;
  min-width: 108px;
  max-width: 310px;
  text-align: right;
`;

export const styleFormValueContainer = null;

export const styleFormInvalid = css`
  color: red;
`;

export const styleFormFooter = css`
  justify-content: flex-end;

  button {
    margin-left: 8px;
  }
`;

export const styleFormRequired = css`
  color: red;
  margin-right: 5px;
`;

export const styleAlertWrapper = css`
  margin-top: 16px;
`;

const styleSelect = css`
  min-width: 120px;
`;

const styleInput: CSSProperties = {
  width: 180,
};

// TODO: styles for horizonal forms
