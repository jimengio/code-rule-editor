import React from "react";
import _ from "lodash";
import produce from "immer";

import { styleFormContainer, styleFormRowsList, LabeledField, LabeledFieldInput } from "../immer-form";

import { lang } from "../lingual/index";
import { ICodeRuleFormLiteral } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import { immerHelpers, ImmerStateFunc } from "@jimengio/shared-utils";

interface IProps {
  labelTextAlign?: ELabelTextAlign;
  form: ICodeRuleFormLiteral;
  excludeCodeRuleTypes?: ECodeRuleType[];
  validationFailures: { [field: string]: string };
  onSubmit: (form: ICodeRuleFormLiteral) => void;
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class LiteralImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormLiteral = this.props.form;
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
            label={lang.content}
            value={form.content}
            showRequired={true}
            validationFailure={failures.content}
            styleFormLabel={{ textAlign: labelTextAlign }}
            onChange={(value: string) => {
              let newForm = produce(form, (draft) => {
                draft.content = value;
              });

              this.props.onSubmit(newForm);
            }}
          />
        </div>
      </div>
    );
  }
}

export const validateLiteralForm = (form: ICodeRuleFormLiteral) => {
  let result: any = {};

  if (_.isEmpty(form.content)) {
    result.content = lang.contentRequired;
  }

  return result;
};
