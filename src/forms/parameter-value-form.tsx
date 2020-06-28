import React from "react";
import { isEmpty } from "lodash-es";
import produce from "immer";

import { styleFormContainer, styleFormRowsList, LabeledField, LabeledFieldInput } from "../immer-form";

import { lang } from "../lingual/index";
import { ICodeRuleFormParameterValue } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import { immerHelpers, ImmerStateFunc } from "../utils/immer-helper";

interface IProps {
  form: ICodeRuleFormParameterValue;
  labelTextAlign?: ELabelTextAlign;
  excludeCodeRuleTypes?: ECodeRuleType[];
  validationFailures: { [field: string]: string };
  onSubmit: (form: ICodeRuleFormParameterValue) => void;
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class ParameterValueImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormParameterValue = this.props.form;
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

export const validateParameterValueForm = (form: ICodeRuleFormParameterValue) => {
  let result: any = {};

  if (isEmpty(form.parameterName)) {
    result.parameterName = lang.parameterNameRequired;
  }

  return result;
};
