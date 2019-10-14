import React from "react";
import produce from "immer";

import { styleFormContainer, styleFormRowsList, LabeledField } from "../immer-form";

import { lang } from "../lingual/index";
import { ICodeRuleFormDayOfMonth } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import { immerHelpers, ImmerStateFunc } from "@jimengio/shared-utils";

interface IProps {
  labelTextAlign?: ELabelTextAlign;
  form: ICodeRuleFormDayOfMonth;
  excludeCodeRuleTypes?: ECodeRuleType[];
  validationFailures: { [field: string]: string };
  onSubmit: (form: ICodeRuleFormDayOfMonth) => void;
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class CodeRuleDayOfMonthImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormDayOfMonth = this.props.form;
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
        </div>
      </div>
    );
  }
}
