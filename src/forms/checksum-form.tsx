import React from "react";
import _ from "lodash";
import produce from "immer";
import InputNumber from "antd/lib/input-number";
import Select from "antd/lib/select";

import { styleFormContainer, styleFormRowsList, LabeledField, LabeledFieldInput } from "../immer-form";

import { lang } from "../lingual/index";
import { ICodeRuleFormChecksum } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import { immerHelpers, ImmerStateFunc } from "@jimengio/shared-utils";

let { Option } = Select;

interface IProps {
  labelTextAlign?: ELabelTextAlign;
  form: ICodeRuleFormChecksum;
  excludeCodeRuleTypes?: ECodeRuleType[];
  onSubmit: (form: ICodeRuleFormChecksum) => void;
  validationFailures: { [field: string]: string };
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class ChecksumImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormChecksum = this.props.form;
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
          <LabeledField label={lang.algorithm} showRequired={true} validationFailure={failures.algorithm} styleFormLabel={{ textAlign: labelTextAlign }}>
            <Select
              placeholder={lang.pleaseSelect}
              style={{ width: 200 }}
              value={form.algorithm}
              onChange={(value) => {
                this.props.onSubmit(
                  produce(form, (draft) => {
                    draft.algorithm = value as any;
                  })
                );
              }}
            >
              <Option key={"CRC32"} value={"CRC32"}>
                {"CRC32"}
              </Option>
            </Select>
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
            label={lang.paddingCharactor}
            value={form.paddingCharactor}
            showRequired={true}
            validationFailure={failures.paddingCharactor}
            styleFormLabel={{ textAlign: labelTextAlign }}
            onChange={(value: string) => {
              this.props.onSubmit(
                produce(form, (draft) => {
                  draft.paddingCharactor = _.last((value as string) || "0");
                })
              );
            }}
          />
        </div>
      </div>
    );
  }
}

export const validateChecksumForm = (form: ICodeRuleFormChecksum) => {
  let result: any = {};

  if (form.length == null) {
    result.length = lang.invalidInput;
  }

  if (_.isEmpty(form.paddingCharactor)) {
    result.paddingCharactor = lang.dataIsRequired;
  }

  if (_.isEmpty(form.algorithm)) {
    result.algorithm = lang.dataIsRequired;
  }

  return result;
};
