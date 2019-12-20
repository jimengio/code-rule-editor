import React from "react";
import { isNumber, padStart } from "lodash-es";
import moment from "moment";
import dayjs from "dayjs";
import { css, cx } from "emotion";
import produce from "immer";
import { ECodeRuleType } from "./models/types";

import {
  ICodeRuleFormParameterValue,
  ICodeRuleFormLiteral,
  ICodeRuleFormYear,
  ICodeRuleFormMonth,
  ICodeRuleFormDayOfMonth,
  ICodeRuleFormWeekOfYear,
  ICodeRuleFormDayOfYear,
  ICodeRuleFormAutoIncrement,
  ICodeRuleFormChecksum,
} from "./models/code-rule";
import { row, column } from "@jimengio/flex-styles";
import { emptyBase64Image } from "./utils/image";
import { lang } from "./lingual";
import { immerHelpers, ImmerStateFunc } from "@jimengio/shared-utils";

interface IProps {
  form: any;
  isFocused: boolean;
  failuresHighlighted: boolean;
  movingPosition: number;
  droppingPosition: number;
  index: number;
  onClick: () => void;
  onRemove: () => void;
  onMove: (fromPosition, toPosition) => void;
  onMarkMovingPosition: (x: number) => void;
  onMarkDropppingPosition: (x: number) => void;
}

interface IState {}

export default class CodeRuleSegmentPreview extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      dropHint: null,
    };
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    let from = this.props.movingPosition;
    let to = this.props.droppingPosition;

    return (
      <div
        className={cx(column, styleContainer)}
        onClick={this.props.onClick}
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData("text", this.props.index as any);

          var img = new Image();
          img.src = emptyBase64Image;
          event.dataTransfer.setDragImage(img, 10, 10);

          this.props.onMarkMovingPosition(this.props.index);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          this.props.onMove(parseInt(event.dataTransfer.getData("text"), 10), this.props.index);
          this.props.onMarkMovingPosition(null);
        }}
        onDragEnter={(event) => {
          this.props.onMarkDropppingPosition(this.props.index);
        }}
        onDragEnd={(event) => {
          this.props.onMarkDropppingPosition(null);
        }}
      >
        <div className={styleType}>
          <span className={cx(styleName, this.props.failuresHighlighted ? styleFailures : null)}>{lang[`sequence_${this.props.form.type}`]}</span>
          <span
            className={styleRemoveIcon}
            onClick={(event) => {
              event.stopPropagation();
              this.props.onRemove();
            }}
          >
            ×
          </span>
        </div>
        <div className={cx(styleLabel, this.props.isFocused ? styleFocused : null)}>{this.renderPreview(this.props.form)}</div>

        {isNumber(from) && isNumber(to) && to === this.props.index ? this.renderDropHint(from, to) : null}
      </div>
    );
  }

  renderPreview(form) {
    switch (form.type) {
      case ECodeRuleType.Literal:
        return this.renderLiteral(form);
      case ECodeRuleType.ParameterValue:
        return this.renderParamaterValue(form);
      case ECodeRuleType.Year:
        return this.renderYear(form);
      case ECodeRuleType.Month:
        return this.renderMonth(form);
      case ECodeRuleType.DayOfWeek:
        return this.renderDayOfWeek(form);
      case ECodeRuleType.DayOfMonth:
        return this.renderDayOfMonth(form);
      case ECodeRuleType.DayOfYear:
        return this.renderDayOfYear(form);
      case ECodeRuleType.WeekOfYear:
        return this.renderWeekOfYear(form);
      case ECodeRuleType.AutoIncrement:
        return this.renderAutoIncrement(form);
      case ECodeRuleType.Checksum:
        return this.renderChecksum(form);
      default:
        return JSON.stringify(form);
    }
  }

  renderDropHint(from: number, to: number) {
    if (from === to) {
      return null;
    }

    return <div className={styleDropPosition} style={from > to ? { left: -6 } : { right: -6 }} />;
  }

  renderLiteral(form: ICodeRuleFormLiteral) {
    return form.content;
  }

  renderParamaterValue(form: ICodeRuleFormParameterValue) {
    return `\${${form.parameterName || ""}}`;
  }

  renderYear(form: ICodeRuleFormYear) {
    return dayjs().format("YYYY");
  }

  renderMonth(form: ICodeRuleFormMonth) {
    return dayjs().format("MM");
  }

  renderDayOfMonth(form: ICodeRuleFormDayOfMonth) {
    return dayjs().format("DD");
  }

  renderWeekOfYear(form: ICodeRuleFormWeekOfYear) {
    return padStart(
      dayjs()
        .week()
        .toString(),
      2,
      "0"
    );
  }

  renderDayOfWeek(form: ICodeRuleFormDayOfYear) {
    return dayjs().format("d");
  }

  renderAutoIncrement(form: ICodeRuleFormAutoIncrement) {
    return padStart("1", form.length, form.paddingCharactor || "0");
  }

  renderChecksum(form: ICodeRuleFormChecksum) {
    return padStart("", form.length, form.paddingCharactor);
  }

  renderDayOfYear(form: ICodeRuleFormDayOfYear) {
    return padStart(
      "0",
      3,
      moment()
        .dayOfYear()
        .toString()
    );
  }
}

const styleRemoveIcon = css`
  color: #aaa;
  font-size: 14px;
  margin-left: 8px;
  font-weight: bold;
`;

const styleLabel = css`
  background-color: #e5e5e5;
  border-radius: 5px;

  line-height: 30px;
  height: 30px;
  font-size: 14px;
  text-align: center;
  padding: 0 16px;
  display: inline-block;
  margin-top: 8px;
  pointer-events: none;
`;

const styleContainer = css`
  margin-right: 8px;
  align-items: flex-start;
  cursor: pointer;
  position: relative;

  & .${styleRemoveIcon} {
    visibility: hidden;
  }

  &:hover .${styleRemoveIcon} {
    visibility: visible;
  }
`;

const styleType = css`
  font-size: 12px;
  color: #888;
`;

const styleFocused = css`
  background-color: #2f4756;
  color: white;
`;

const styleFailures = css`
  color: red;
  text-decoration: underline;
`;

const styleName = css`
  pointer-events: none;
`;

const styleDropPosition = css`
  width: 4px;
  height: 56px;
  position: absolute;
  bottom: 0px;
  background-color: hsl(240, 80%, 80%);
`;
