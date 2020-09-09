import React, { Component } from "react";
import { css, cx } from "emotion";
import produce from "immer";

import { ECodeRuleType } from "./models/types";
import { ICodeRule, ICodeRuleFormUserInput } from "./models/code-rule";
import { column, row, rowMiddle, expand } from "@jimengio/flex-styles";
import { lang, formatString } from "./lingual";
import { getCodeContent, renderUserInput, parseCodeRuleMap } from "./utils/sequence-rule";
import InputFormItem from "./forms/input-form-item";

export interface ISegmentErrorMap {
  [index: number]: string;
}

interface IProps {
  editableUserInput?: boolean;
  className?: string;
  mode?: "horizontal" | "vertical";
  segments: ICodeRule[];
  segmentErrorMap?: ISegmentErrorMap;
  onUserInputChange?: (form, index) => void;
}

export default class CodeRuleView extends Component<IProps, any> {
  render() {
    let mainContainer = row;
    let itemContainer = cx(column, styleContainer);
    let labelContainer = styleType;
    let valueContainer = marginTop8;
    if (this.props.mode === "vertical") {
      mainContainer = column;
      itemContainer = cx(rowMiddle, marginBottom16);
      labelContainer = styleLabel;
      valueContainer = expand;
    }

    return (
      <div className={cx(mainContainer, this.props.className)}>
        {(this.props.segments || []).map((form, index) => {
          //如果当前规则项是用户输入（即：文本），则当前项 label 显示参数值
          let segmentLabel;
          let promptInfo;
          if (form.type === ECodeRuleType.UserInput) {
            const codeRuleMap = parseCodeRuleMap(form);
            segmentLabel = codeRuleMap.parameterName;
            promptInfo = `(${formatString(lang.numberDigits, { n: codeRuleMap.length })})`;
          }

          return (
            <div key={index} className={itemContainer} title={form.note}>
              <div className={labelContainer}>
                <span className={styleName}>
                  {segmentLabel || lang[`sequence_${form.type}`]}
                  {promptInfo}
                </span>
              </div>
              <div className={valueContainer}>
                {form.type === ECodeRuleType.UserInput ? this.renderUserInput(form, index) : <div className={styleValueContent}>{getCodeContent(form)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderUserInput(form, index) {
    const { segmentErrorMap, mode } = this.props;

    if (this.props.editableUserInput) {
      const codeRuleMap: ICodeRuleFormUserInput = parseCodeRuleMap(form) as any;

      const hasError = segmentErrorMap && segmentErrorMap[index];

      return (
        <div className={cx(displayInlineBlock, hasError ? "has-error" : "")}>
          <InputFormItem
            width={80}
            placeholder={lang.pleaseEnter}
            value={codeRuleMap.userInputValue}
            onChange={(value) => {
              //当输入的文本长度等于预设文本长度时，不可再输入
              if ((value || "").length > codeRuleMap.length) {
                return;
              }

              if (this.props.onUserInputChange != null) {
                this.props.onUserInputChange(
                  produce(form, (draft) => {
                    if ("userInputValue" in codeRuleMap) {
                      draft.settings = form.settings.map((setting) => {
                        if (setting.name === "userInputValue") {
                          return produce(setting, (settingDraft) => {
                            settingDraft.value = value;
                          });
                        }

                        return setting;
                      });
                    } else {
                      draft.settings = [].concat(form.settings, [{ name: "userInputValue", value: value }]);
                    }
                  }),
                  index
                );
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className={cx(styleValueContent)} title={form.note}>
        {renderUserInput(form)}
      </div>
    );
  }
}

const styleRemoveIcon = css`
  color: #aaa;
  font-size: 12px;
  margin-left: 8px;
  font-weight: 100;
`;

const styleContainer = css`
  margin-right: 8px;
  align-items: flex-start;
  position: relative;

  & .${styleRemoveIcon} {
    visibility: hidden;
  }

  &:hover .${styleRemoveIcon} {
    visibility: visible;
  }
`;

const styleType = css`
  align-self: center;
  font-size: 12px;
  color: #888;
`;

const styleName = css`
  pointer-events: none;
`;

const styleLabel = css`
  width: 150px;
  text-align: right;
  padding-right: 8px;

  &:after {
    content: " :";
  }
`;

const styleValueContent = css`
  display: inline-flex;
  align-items: center;
  height: 30px;
  background-color: #e5e5e5;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
  padding: 0 16px;
`;

let marginBottom16 = css`
  margin-bottom: 16px;
`;

let marginTop8 = css`
  margin-top: 8px;
`;

let displayInlineBlock = css`
  display: inline-block;
`;
