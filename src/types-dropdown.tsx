import React from "react";
import Select from "antd/lib/select";
import { ECodeRuleType } from "./models/types";
import { lang } from "./lingual";

let { Option } = Select;

interface IProps {
  value: string;
  excludeTypes?: ECodeRuleType[];
  placeholder?: string;
  notFoundContent?: any;
  onChange: (value) => void;
  size?: any;
  onDeselect?: () => void;
  disabled?: boolean;
}

interface IState {}

let ruleTypes = [
  ECodeRuleType.Literal,
  ECodeRuleType.ParameterValue,
  ECodeRuleType.Year,
  ECodeRuleType.Month,
  ECodeRuleType.DayOfMonth,
  ECodeRuleType.DayOfWeek,
  ECodeRuleType.DayOfYear,
  ECodeRuleType.WeekOfYear,
  ECodeRuleType.AutoIncrement,
  ECodeRuleType.Checksum,
  ECodeRuleType.UserInput,
];

export default class CodeRuleTypesEditor extends React.Component<IProps, IState> {
  render() {
    const { notFoundContent, placeholder, size, onDeselect, disabled, excludeTypes } = this.props;

    return (
      <Select
        value={this.props.value}
        onChange={(value) => {
          this.props.onChange(value);
        }}
        size={size}
        placeholder={placeholder || lang.pleaseSelect}
        notFoundContent={notFoundContent}
        allowClear={false}
        disabled={disabled}
        onDeselect={onDeselect}
        style={{ width: 200 }}
      >
        {ruleTypes
          .filter((type) => !(excludeTypes || []).includes(type))
          .map((type) => {
            return (
              <Option value={type} key={type}>
                {lang[`sequence_${type}`]}
              </Option>
            );
          })}
      </Select>
    );
  }
}
