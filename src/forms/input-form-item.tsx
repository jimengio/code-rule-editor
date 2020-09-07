import React, { ChangeEvent, Component, CSSProperties } from "react";

import Input from "antd/lib/input/Input";

interface IProps {
  className?: string;
  onRefReady?: (e: Input) => void;
  style?: CSSProperties;
  defaultValue?: any;
  value?: any;
  width?: number | string;
  autofocus?: boolean;
  placeholder?: string;
  suffix?: string | React.ReactNode;
  type?: string;
  disabled?: boolean;
  size?: "large" | "middle" | "small";
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onPressEnter?: () => void;
}

export default class InputFormItem extends Component<IProps, any> {
  inputRef: Input;

  setInputRef = (el) => {
    this.inputRef = el;

    if (this.props.onRefReady) {
      this.props.onRefReady(el);
    }
  };

  componentDidMount() {
    if (this.inputRef && this.props.autofocus) this.inputRef.focus();
  }

  render() {
    return (
      <Input
        className={this.props.className}
        disabled={this.props.disabled}
        defaultValue={this.props.defaultValue}
        value={this.props.value}
        style={{
          width: this.props.width,
          ...this.props.style,
        }}
        type={this.props.type}
        size={this.props.size}
        placeholder={this.props.placeholder || ""}
        onChange={this.onChange}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onPressEnter={this.props.onPressEnter}
        ref={this.setInputRef}
        suffix={this.props.suffix}
      />
    );
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };
}
