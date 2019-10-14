import React from "react";
import _ from "lodash";
import produce from "immer";
import { cx, css } from "emotion";

import ChecksumImmerForm, { validateChecksumForm } from "./forms//checksum-form";
import AutoIncrementImmerForm, { validateAutoIncrementForm } from "./forms//auto-increment-form";
import LiteralImmerForm, { validateLiteralForm } from "./forms//literal-form";
import ParameterValueImmerForm, { validateParameterValueForm } from "./forms//parameter-value-form";
import UserInputImmerForm, { validateUserInputForm } from "./forms//user-input-form";
import CodeRuleYearImmerForm, { validateYearForm } from "./forms//year-form";
import CodeRuleMonthImmerForm from "./forms//month-form";
import CodeRuleDayOfMonthImmerForm from "./forms//day-of-month-form";
import CodeRuleDayOfWeekImmerForm from "./forms//day-of-week-form";
import CodeRuleDayOfYearImmerForm from "./forms//day-of-year-form";
import CodeRuleWeekOfYearImmerForm from "./forms//week-of-year-form";
import ImmerComponent from "./immer-component";
import Alert from "antd/lib/alert";

import {
  ICodeRule,
  ICodeRuleFormLiteral,
  ICodeRuleFormParameterValue,
  ICodeRuleFormYear,
  ICodeRuleFormMonth,
  ICodeRuleFormDayOfMonth,
  ICodeRuleFormDayOfWeek,
  ICodeRuleFormDayOfYear,
  ICodeRuleFormWeekOfYear,
  ICodeRuleFormAutoIncrement,
  ICodeRuleFormChecksum,
  ICodeRuleFormUserInput,
} from "./models/code-rule";
import { ECodeRuleType, ELabelTextAlign } from "./models/types";
import TextAreaFormItem from "./forms/textarea-form-item";
import { LabeledField, IValidationInfomation, isFailuresEmpty } from "./immer-form";
import { lang, formatString } from "./lingual";
import { rowMiddle, rowParted } from "@jimengio/flex-styles";

export function getValidationResults(form: any) {
  switch (form.type) {
    case ECodeRuleType.AutoIncrement:
      return validateAutoIncrementForm(form);
    case ECodeRuleType.Checksum:
      return validateChecksumForm(form);
    case ECodeRuleType.Literal:
      return validateLiteralForm(form);
    case ECodeRuleType.ParameterValue:
      return validateParameterValueForm(form);
    case ECodeRuleType.Year:
      return validateYearForm(form);
    case ECodeRuleType.UserInput:
      return validateUserInputForm(form);
    default:
      return {};
  }
}

export function parseSegmentFromForm(form) {
  return {
    type: form.type,
    note: form.note,
    settings: _.map(_.toPairs(form), (pair) => {
      return { name: pair[0], value: `${pair[1]}` };
    }).filter((pair) => pair.name !== "type" && pair.name !== "note"),
  };
}

export function parseFormFromSegment(segment: ICodeRule) {
  if (!segment) {
    segment = {} as ICodeRule;
  }

  let form = _.merge({ type: segment.type, note: segment.note }, _.fromPairs(_.map(segment.settings, (setting) => [setting.name, setting.value])));
  if (!form || !form.type) {
    form = {
      type: ECodeRuleType.Literal,
      note: "",
      content: "",
    };
  }
  return form;
}

interface IProps {
  validationInfo?: IValidationInfomation;
  codeRule: ICodeRule;
  excludeCodeRuleTypes?: ECodeRuleType[];
  onSubmit: (codeRule: ICodeRule) => void;
}

interface IState {
  failures: IValidationInfomation;
}

export default class SingleCodeRuleEditor extends ImmerComponent<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      failures: {},
    };
  }

  render() {
    let failures = this.props.validationInfo;

    //父组件传递的错误信息优先级高
    if (isFailuresEmpty(this.props.validationInfo)) {
      failures = this.state.failures;
    }

    const form = parseFormFromSegment(this.props.codeRule);
    return (
      <div>
        {this.renderForm(form, failures || {})}
        <LabeledField label={lang.lblRemark} styleFormLabel={{ textAlign: ELabelTextAlign.Right }} validationFailure={failures && failures.note}>
          <TextAreaFormItem
            placeholder={lang.pleaseEnter}
            value={form.note}
            onChange={(value) => {
              if ((value || "").length > 30) {
                return;
              }
              this.onSubmitCodeRule(
                produce(form, (draft) => {
                  draft.note = value;
                })
              );
            }}
          />
          <div className={cx(rowMiddle, rowParted)}>
            <Alert className={cx(styleAlert, rowMiddle)} message={formatString(lang.maxStringLength, { n: `${30}` })} type={"info"} showIcon />
            <span>{`${(form.note || "").length || 0}/30`}</span>
          </div>
        </LabeledField>
      </div>
    );
  }

  renderForm(form, failures: any) {
    if (_.isNil(form)) {
      return null;
    }
    switch (form.type) {
      case ECodeRuleType.Literal:
        return this.renderLiteral(form, failures);
      case ECodeRuleType.ParameterValue:
        return this.renderParameterValue(form, failures);
      case ECodeRuleType.Year:
        return this.renderYear(form, failures);
      case ECodeRuleType.Month:
        return this.renderMonth(form);
      case ECodeRuleType.DayOfMonth:
        return this.renderDayOfMonth(form);
      case ECodeRuleType.DayOfWeek:
        return this.renderDayOfWeek(form);
      case ECodeRuleType.DayOfYear:
        return this.renderDayOfYear(form);
      case ECodeRuleType.WeekOfYear:
        return this.renderWeekOfYear(form);
      case ECodeRuleType.AutoIncrement:
        return this.renderAutoIncrement(form, failures);
      case ECodeRuleType.Checksum:
        return this.renderChecksum(form, failures);
      case ECodeRuleType.UserInput:
        return this.renderUserInput(form, failures);
      default:
        return JSON.stringify(form);
    }
  }

  renderLiteral(form: ICodeRuleFormLiteral, failures: any) {
    return (
      <LiteralImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={failures}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderParameterValue(form: ICodeRuleFormParameterValue, failures: any) {
    return (
      <ParameterValueImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={failures}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderUserInput(form: ICodeRuleFormUserInput, failures: any) {
    return (
      <UserInputImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={failures}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderYear(form: ICodeRuleFormYear, failures: any) {
    return (
      <CodeRuleYearImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={failures}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderMonth(form: ICodeRuleFormMonth) {
    return (
      <CodeRuleMonthImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={{}}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderDayOfMonth(form: ICodeRuleFormDayOfMonth) {
    return (
      <CodeRuleDayOfMonthImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={{}}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderDayOfWeek(form: ICodeRuleFormDayOfWeek) {
    return (
      <CodeRuleDayOfWeekImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={{}}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderDayOfYear(form: ICodeRuleFormDayOfYear) {
    return (
      <CodeRuleDayOfYearImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={{}}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderWeekOfYear(form: ICodeRuleFormWeekOfYear) {
    return (
      <CodeRuleWeekOfYearImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={{}}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderAutoIncrement(form: ICodeRuleFormAutoIncrement, failures: any) {
    return (
      <AutoIncrementImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={failures}
        onSubmit={(form) => {
          // @sillydong: just use plant, hide the input box for scope
          let modifiedForm = produce(form, (draft) => {
            draft.scope = "plant";
          });

          this.onSubmitCodeRule(modifiedForm);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderChecksum(form: ICodeRuleFormChecksum, failures: any) {
    return (
      <ChecksumImmerForm
        form={form}
        labelTextAlign={ELabelTextAlign.Right}
        excludeCodeRuleTypes={this.props.excludeCodeRuleTypes}
        validationFailures={failures}
        onSubmit={(form) => {
          this.onSubmitCodeRule(form);
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  onSubmitCodeRule = (form) => {
    this.props.onSubmit(parseSegmentFromForm(form));
  };

  onConfirm = () => {
    const form = parseFormFromSegment(this.props.codeRule);
    let failures = getValidationResults(form);

    if (_.isEmpty(failures)) {
      const newSegment = parseSegmentFromForm(form);

      this.props.onSubmit(newSegment);
    }
    this.immerState((state) => {
      state.failures = failures;
    });
  };

  onChangeType = (type: ECodeRuleType) => {
    // reset data to clear redundant keys

    let data: any = { type: type };

    switch (type) {
      case ECodeRuleType.AutoIncrement:
        data = {
          type: type,
          scope: "plant",
          period: "forever",
          length: 1,
          paddingCharactor: "0",
          start: 1,
        } as ICodeRuleFormAutoIncrement;
        break;
      case ECodeRuleType.Checksum:
        data = {
          type: type,
          algorithm: "CRC32",
          length: 1,
          paddingCharactor: "0",
        } as ICodeRuleFormChecksum;
        break;
      case ECodeRuleType.Literal:
        data = { type: type, content: "" } as ICodeRuleFormLiteral;
        break;
      case ECodeRuleType.ParameterValue:
        data = { type: type, parameterName: "", length: 2 } as ICodeRuleFormParameterValue;
        break;
      case ECodeRuleType.Year:
        data = { type: type, length: 2 } as ICodeRuleFormYear;
        break;
      case ECodeRuleType.Month:
        data = { type: type, length: 2 } as ICodeRuleFormYear;
        break;
      case ECodeRuleType.DayOfMonth:
        data = { type: type, length: 2 } as ICodeRuleFormYear;
        break;
      case ECodeRuleType.DayOfWeek:
        data = { type: type, length: 1 } as ICodeRuleFormYear;
        break;
      case ECodeRuleType.DayOfYear:
        data = { type: type, length: 3 } as ICodeRuleFormYear;
        break;
      case ECodeRuleType.WeekOfYear:
        data = { type: type, length: 2 } as ICodeRuleFormYear;
        break;
      case ECodeRuleType.UserInput:
        data = { type: type, parameterName: "", length: 1 } as ICodeRuleFormUserInput;
        break;
    }

    this.mergeState({ failures: {} });
    this.onSubmitCodeRule(data);
  };
}

const styleAlert = css`
  display: inline-flex;
  margin-top: 8px;
  padding: 5px;
  font-size: 12px;

  .ant-alert-icon {
    position: static;
    margin: 0 5px;
  }
`;
