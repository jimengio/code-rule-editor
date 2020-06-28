import React, { ChangeEvent, Component, CSSProperties } from "react";
import TextArea from "antd/lib/input/TextArea";
import { immerHelpers, MergeStateFunc } from "../utils/immer-helper";
import { relative } from "@jimengio/flex-styles";
import { css, cx } from "emotion";
import { safeGet } from "@jimengio/safe-property";

interface IProps {
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  defaultValue?: any;
  value?: any;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
  showLength?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface IState {
  strLength: number;
}

export default class TextAreaFormItem extends Component<IProps, IState> {
  mergeState = immerHelpers.mergeState as MergeStateFunc<IState>;

  constructor(props) {
    super(props);

    this.state = {
      strLength: safeGet(props.value, "length") || 0,
    };
  }

  render() {
    const { className, placeholder, style, defaultValue, value, rows, disabled, maxLength, showLength, onBlur, onFocus } = this.props;

    return (
      <div className={relative} style={{ width: style && style.width }}>
        <TextArea
          placeholder={placeholder}
          className={className}
          rows={rows || 4}
          defaultValue={defaultValue}
          value={value}
          style={style}
          disabled={disabled}
          onChange={this.onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={maxLength}
        />
        {showLength && <span className={styleNum}>{this.formatValueLength(this.state.strLength, maxLength)}</span>}
      </div>
    );
  }

  onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
      this.props.showLength && this.mergeState({ strLength: e.target.value.length });
    }
  };

  formatValueLength(length: number, maxLength?: number) {
    return maxLength != null ? `${length}/${maxLength}` : `${length}`;
  }
}

const styleNum = css`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 0.9em;
  user-select: none;
  color: #bdbdbd;
`;
