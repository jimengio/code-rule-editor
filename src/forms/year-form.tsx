import React from "react";
import produce from "immer";
import Select from "antd/lib/select";

import { styleFormContainer, styleFormRowsList, LabeledField } from "../immer-form";

import { lang } from "../lingual/index";
import { ICodeRuleFormYear } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import { ImmerStateFunc, immerHelpers } from "../utils/immer-helper";

let { Option } = Select;

interface IProps {
  labelTextAlign?: ELabelTextAlign;
  form: ICodeRuleFormYear;
  excludeCodeRuleTypes?: ECodeRuleType[];
  validationFailures: { [field: string]: string };
  onSubmit: (form: ICodeRuleFormYear) => void;
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class CodeRuleYearImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormYear = this.props.form;
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
            <Select
              placeholder={lang.pleaseSelect}
              style={{ width: 200 }}
              value={form.length as any}
              onChange={(value) => {
                this.props.onSubmit(
                  produce(form, (draft) => {
                    draft.length = value as any;
                  })
                );
              }}
            >
              <Option value={2}>{2}</Option>
              <Option value={4}>{4}</Option>
            </Select>
          </LabeledField>
        </div>
      </div>
    );
  }
}

export const validateYearForm = (form: ICodeRuleFormYear) => {
  let result: any = {};

  return result;
};
