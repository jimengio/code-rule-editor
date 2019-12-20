import React from "react";
import { last, isEmpty } from "lodash-es";
import produce from "immer";
import InputNumber from "antd/lib/input-number";
import Select from "antd/lib/select";

import { styleFormContainer, styleFormRowsList, LabeledField, LabeledFieldInput } from "../immer-form";

import { lang, formatString } from "../lingual/index";
import { ICodeRuleFormAutoIncrement } from "../models/code-rule";

import CodeRuleTypesDropdown from "../types-dropdown";
import { ECodeRuleType, ELabelTextAlign } from "../models/types";
import { immerHelpers, ImmerStateFunc } from "@jimengio/shared-utils";

let { Option } = Select;

interface IProps {
  labelTextAlign?: ELabelTextAlign;
  form: ICodeRuleFormAutoIncrement;
  excludeCodeRuleTypes?: ECodeRuleType[];
  onSubmit: (form: ICodeRuleFormAutoIncrement) => void;
  validationFailures: { [field: string]: string };
  onChangeType: (type: ECodeRuleType) => void;
}

interface IState {}

export default class AutoIncrementImmerForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    const { labelTextAlign = ELabelTextAlign.Left } = this.props;
    let form: ICodeRuleFormAutoIncrement = this.props.form;
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
          {/* <LabeledFieldInput
            styleInput={{ width: 200 }}
            label={lang.scope}
            value={form.scope}
            showRequired={true}
            validationFailure={failures.scope}
            styleFormLabel={{ textAlign: "left" }}
            onChange={(value: string) => {
              this.props.onSubmit(
                produce(form, (draft) => {
                  draft.scope = value;
                })
              );
            }}
          /> */}
          <LabeledField label={lang.resetPeriod} showRequired={true} validationFailure={failures.period} styleFormLabel={{ textAlign: labelTextAlign }}>
            <Select
              style={{ width: 200 }}
              placeholder={lang.pleaseSelect}
              value={form.period}
              onChange={(value) => {
                this.props.onSubmit(
                  produce(form, (draft) => {
                    draft.period = value as any;
                  })
                );
              }}
            >
              <Option value={"forever"}>{lang.neverReset}</Option>
              <Option value={"day"}>{lang.resetEveryDay}</Option>
              <Option value={"month"}>{lang.resetEveryMonth}</Option>
              <Option value={"year"}>{lang.resetEveryYear}</Option>
            </Select>
          </LabeledField>
          <LabeledField label={lang.length} showRequired={true} validationFailure={failures.length} styleFormLabel={{ textAlign: labelTextAlign }}>
            <InputNumber
              placeholder={lang.pleaseEnter}
              style={{ width: 200 }}
              min={1}
              precision={0}
              value={form.length}
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
                  draft.paddingCharactor = last((value as string) || "0");
                })
              );
            }}
          />
          <LabeledField label={lang.initialValue} validationFailure={failures.start} styleFormLabel={{ textAlign: labelTextAlign }}>
            <InputNumber
              placeholder={lang.pleaseEnter}
              style={{ width: 200 }}
              min={1}
              precision={0}
              value={form.start || 1}
              onChange={(value) => {
                //排除错误数据
                if (!value || (value as any) === "null" || (value as any) === "undefined") {
                  value = 1;
                }
                this.props.onSubmit(
                  produce(form, (draft) => {
                    draft.start = value as number;
                  })
                );
              }}
            />
          </LabeledField>
        </div>
      </div>
    );
  }
}

export let validateAutoIncrementForm = (form: ICodeRuleFormAutoIncrement) => {
  let result: any = {};

  // if (isEmpty(form.scope)) {
  //   result.scope = lang.dataIsRequired;
  // }

  if (form.length == null) {
    result.length = lang.invalidInput;
  }

  if (isEmpty(form.period)) {
    result.period = lang.dataIsRequired;
  }

  if (isEmpty(form.paddingCharactor)) {
    result.paddingCharactor = lang.dataIsRequired;
  }

  const maxStartValue = Math.pow(10, form.length || 1) - 1;
  if (form.start > maxStartValue) {
    result.start = formatString(lang.maximumNotBeExceed, { n: `${maxStartValue}` });
  }

  return result;
};
