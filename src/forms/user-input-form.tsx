import React from "react";
import { isEmpty } from "lodash-es";
import produce from "immer";

import { styleFormContainer, styleFormRowsList, LabeledField, LabeledFieldInput } from "../immer-form";

import { lang } from "../lingual/index";
import { ICodeRuleFormUserInput } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import InputNumber from "antd/lib/input-number";
import { immerHelpers, ImmerStateFunc } from "../utils/immer-helper";

interface IProps {
  labelTextAlign?: ELabelTextAlign;
  form: ICodeRuleFormUserInput;
  excludeCodeRuleTypes?: ECodeRuleType[];
  validationFailures: { [field: string]: string };
  onSubmit: (form: ICodeRuleFormUserInput) => void;
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class UserInputImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormUserInput = this.props.form;
    let failures = this.props.validationFailures;

    return (
      <div className={styleFormContainer}>
        <div className={styleFormRowsList}>
          <LabeledField label={lang.type} showRequired={true} validationFailure={failures.type} styleFormLabel={{ textAlign: labelTextAlign }}>
            <CodeRuleTypesDropdown
              value={form.type}
              excludeTypes={this.props.excludeCodeRuleTypes}
              onChange={(value) => {
                this.props.onChangeType(value);
              }}
            />
          </LabeledField>
          <LabeledField label={lang.length} showRequired={true} validationFailure={failures.length} styleFormLabel={{ textAlign: labelTextAlign }}>
            <InputNumber
              placeholder={lang.pleaseEnter}
              value={form.length}
              style={{ width: 200 }}
              min={1}
              precision={0}
              onChange={(value) => {
                //排除错误数据
                if (!value || (value as any) === "null" || (value as any) === "undefined") {
                  value = 1;
                }
                this.props.onSubmit(
                  produce(form, (draft) => {
                    draft.length = value as number;
                  })
                );
              }}
            />
          </LabeledField>
          <LabeledFieldInput
            placeholder={lang.pleaseEnter}
            styleInput={{ width: 200 }}
            label={lang.parameterName}
            value={form.parameterName}
            showRequired={true}
            validationFailure={failures.parameterName}
            styleFormLabel={{ textAlign: labelTextAlign }}
            onChange={(value: string) => {
              let newForm = produce(form, (draft) => {
                draft.parameterName = value;
              });

              this.props.onSubmit(newForm);
            }}
          />
        </div>
      </div>
    );
  }
}

export const validateUserInputForm = (form: ICodeRuleFormUserInput) => {
  let result: any = {};

  if (form.length == null) {
    result.length = lang.invalidInput;
  }

  if (isEmpty(form.parameterName)) {
    result.parameterName = lang.parameterNameRequired;
  }

  return result;
};
