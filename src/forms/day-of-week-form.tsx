import React from "react";
import produce from "immer";

import { styleFormContainer, styleFormRowsList, LabeledField } from "../immer-form";

import { lang } from "../lingual/index";
import { ICodeRuleFormDayOfWeek } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import { immerHelpers, ImmerStateFunc } from "@jimengio/shared-utils";

interface IProps {
  labelTextAlign?: ELabelTextAlign;
  form: ICodeRuleFormDayOfWeek;
  excludeCodeRuleTypes?: ECodeRuleType[];
  validationFailures: { [field: string]: string };
  onSubmit: (form: ICodeRuleFormDayOfWeek) => void;
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class CodeRuleDayOfWeekImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormDayOfWeek = this.props.form;
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
