import React from "react";
import _ from "lodash";
import { css, cx } from "emotion";
import produce from "immer";

import ChecksumImmerForm, { validateChecksumForm } from "./forms/checksum-form";
import AutoIncrementImmerForm, { validateAutoIncrementForm } from "./forms/auto-increment-form";
import LiteralImmerForm, { validateLiteralForm } from "./forms/literal-form";
import CodeRuleSegmentPreview from "./segment-preview";
import ParameterValueImmerForm, { validateParameterValueForm } from "./forms/parameter-value-form";
import CodeRuleYearImmerForm, { validateYearForm } from "./forms/year-form";
import CodeRuleMonthImmerForm from "./forms/month-form";
import CodeRuleDayOfMonthImmerForm from "./forms/day-of-month-form";
import CodeRuleDayOfWeekImmerForm from "./forms/day-of-week-form";
import CodeRuleDayOfYearImmerForm from "./forms/day-of-year-form";
import CodeRuleWeekOfYearImmerForm from "./forms/week-of-year-form";

import {
  ICodeRule,
  ICodeRuleFormLiteral,
  ICodeRuleFormParameterValue,
  ICodeRuleFormYear,
  ICodeRuleFormMonth,
  ICodeRuleFormDayOfMonth,
  ICodeRuleFormDayOfWeek,
  ICodeRuleFormDayOfYear,
  ICodeRuleFormWeekOfYear,
  ICodeRuleFormAutoIncrement,
  ICodeRuleFormChecksum,
} from "./models/code-rule";
import { row, center } from "@jimengio/flex-styles";
import { ECodeRuleType } from "./models/types";
import Button from "antd/lib/button";
import { lang } from "./lingual";
import { Space } from "@jimengio/flex-styles";
import { immerHelpers, ImmerStateFunc } from "@jimengio/shared-utils";

interface IProps {
  segments: ICodeRule[];
  onSubmit: (segments: ICodeRule[]) => void;
}

interface IState {
  formList: any[];
  isModified: boolean;
  focusedPosition: number;
  movingPosition: number;
  droppingPosition: number;
  listedFailures: any[];
}

export default class CodeRuleEditor extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      formList: this.getFormsFromSegments(this.props.segments),
      isModified: false,
      focusedPosition: 0,
      listedFailures: [],
      movingPosition: null,
      droppingPosition: null,
    };
  }

  getFormsFromSegments(segments: ICodeRule[]) {
    return _.map(segments, (segment) => _.merge({ type: segment.type }, _.fromPairs(_.map(segment.settings, (setting) => [setting.name, setting.value]))));
  }

  setImmerState = immerHelpers.immerState as ImmerStateFunc<IState>;

  render() {
    return (
      <div>
        <div className={cx(row, styleSegmentsList)}>
          <div className={cx(row)}>
            {this.state.formList.map((form, idx) => {
              return (
                <CodeRuleSegmentPreview
                  key={idx}
                  index={idx}
                  form={form}
                  isFocused={idx === this.state.focusedPosition}
                  movingPosition={this.state.movingPosition}
                  droppingPosition={this.state.droppingPosition}
                  failuresHighlighted={!_.isEmpty(this.state.listedFailures[idx])}
                  onClick={() => {
                    this.setImmerState((state) => {
                      state.focusedPosition = idx;
                    });
                  }}
                  onRemove={() => {
                    this.setImmerState((state) => {
                      state.formList.splice(idx, 1);

                      if (state.focusedPosition >= idx) {
                        state.focusedPosition = state.focusedPosition - 1;
                      }

                      state.isModified = true;
                    });
                  }}
                  onMove={this.onMove}
                  onMarkMovingPosition={(x) => {
                    this.setImmerState((state) => {
                      state.movingPosition = x;
                    });
                  }}
                  onMarkDropppingPosition={(x) => {
                    this.setImmerState((state) => {
                      state.droppingPosition = x;
                    });
                  }}
                />
              );
            })}
          </div>
          <Space width={16} />
          <div className={center}>
            <span
              className={styleAddIcon}
              onClick={() => {
                this.setImmerState((state) => {
                  state.formList.push({
                    type: ECodeRuleType.Literal,
                    content: "",
                  });
                  state.focusedPosition = state.formList.length - 1;
                  state.isModified = true;
                });
              }}
            >
              ➕
            </span>
          </div>
        </div>
        <div className={styleFormContainer}>
          {this.renderForm(this.state.formList[this.state.focusedPosition], this.state.listedFailures[this.state.focusedPosition] || {})}
        </div>
        <div>
          {this.state.isModified ? (
            <Button type="primary" onClick={this.onConfirm}>
              {lang.confirm}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  renderForm(form, failures: any[]) {
    if (_.isNil(form)) {
      return null;
    }
    switch (form.type) {
      case ECodeRuleType.Literal:
        return this.renderLiteral(form, failures);
      case ECodeRuleType.ParameterValue:
        return this.renderParameterValue(form, failures);
      case ECodeRuleType.Year:
        return this.renderYear(form, failures);
      case ECodeRuleType.Month:
        return this.renderMonth(form);
      case ECodeRuleType.DayOfMonth:
        return this.renderDayOfMonth(form);
      case ECodeRuleType.DayOfWeek:
        return this.renderDayOfWeek(form);
      case ECodeRuleType.DayOfYear:
        return this.renderDayOfYear(form);
      case ECodeRuleType.WeekOfYear:
        return this.renderWeekOfYear(form);
      case ECodeRuleType.AutoIncrement:
        return this.renderAutoIncrement(form, failures);
      case ECodeRuleType.Checksum:
        return this.renderChecksum(form, failures);
      default:
        return JSON.stringify(form);
    }
  }

  renderLiteral(form: ICodeRuleFormLiteral, failures: any) {
    return (
      <LiteralImmerForm
        form={form}
        validationFailures={failures}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderParameterValue(form: ICodeRuleFormParameterValue, failures: any) {
    return (
      <ParameterValueImmerForm
        form={form}
        validationFailures={failures}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderYear(form: ICodeRuleFormYear, failures: any) {
    return (
      <CodeRuleYearImmerForm
        form={form}
        validationFailures={failures}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderMonth(form: ICodeRuleFormMonth) {
    return (
      <CodeRuleMonthImmerForm
        form={form}
        validationFailures={{}}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderDayOfMonth(form: ICodeRuleFormDayOfMonth) {
    return (
      <CodeRuleDayOfMonthImmerForm
        form={form}
        validationFailures={{}}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderDayOfWeek(form: ICodeRuleFormDayOfWeek) {
    return (
      <CodeRuleDayOfWeekImmerForm
        form={form}
        validationFailures={{}}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderDayOfYear(form: ICodeRuleFormDayOfYear) {
    return (
      <CodeRuleDayOfYearImmerForm
        form={form}
        validationFailures={{}}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderWeekOfYear(form: ICodeRuleFormWeekOfYear) {
    return (
      <CodeRuleWeekOfYearImmerForm
        form={form}
        validationFailures={{}}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderAutoIncrement(form: ICodeRuleFormAutoIncrement, failures: any) {
    return (
      <AutoIncrementImmerForm
        form={form}
        validationFailures={failures}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          // @sillydong: just use plant, hide the input box for scope
          let modifiedForm = produce(form, (draft) => {
            draft.scope = "plant";
          });
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = modifiedForm;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  renderChecksum(form: ICodeRuleFormChecksum, failures: any) {
    return (
      <ChecksumImmerForm
        form={form}
        validationFailures={failures}
        excludeCodeRuleTypes={[ECodeRuleType.UserInput]}
        onSubmit={(form) => {
          this.setImmerState((state) => {
            state.formList[this.state.focusedPosition] = form;
            state.isModified = true;
          });
        }}
        onChangeType={this.onChangeType}
      />
    );
  }

  getValidationResults(formList: any[]) {
    return formList.map((form) => {
      switch (form.type) {
        case ECodeRuleType.AutoIncrement:
          return validateAutoIncrementForm(form);
        case ECodeRuleType.Checksum:
          return validateChecksumForm(form);
        case ECodeRuleType.Literal:
          return validateLiteralForm(form);
        case ECodeRuleType.ParameterValue:
          return validateParameterValueForm(form);
        case ECodeRuleType.Year:
          return validateYearForm(form);
        default:
          return {};
      }
    });
  }

  onConfirm = () => {
    let listedFailures = this.getValidationResults(this.state.formList);

    if (_.every(listedFailures, _.isEmpty)) {
      let newSegments = this.state.formList.map((form) => {
        return {
          type: form.type,
          settings: _.map(_.toPairs(form), (pair) => {
            return { name: pair[0], value: `${pair[1]}` };
          }).filter((pair) => pair.name !== "type"),
        };
      });

      this.props.onSubmit(newSegments);
      this.setImmerState((state) => {
        state.isModified = false;
        state.listedFailures = listedFailures;
      });
    } else {
      this.setImmerState((state) => {
        state.listedFailures = listedFailures;
      });
    }
  };

  onMove = (fromPosition, toPosition) => {
    if (fromPosition < toPosition) {
      this.setImmerState((state) => {
        let x = state.formList[fromPosition];
        state.formList.splice(toPosition + 1, 0, x); // perform the operation with larger the index first
        state.formList.splice(fromPosition, 1);
        state.focusedPosition = toPosition;
        state.isModified = true;
      });
    } else if (fromPosition > toPosition) {
      this.setImmerState((state) => {
        let x = state.formList[fromPosition];
        state.formList.splice(fromPosition, 1);
        state.formList.splice(toPosition, 0, x);
        state.focusedPosition = toPosition;
        state.isModified = true;
      });
    }
  };

  onChangeType = (type: ECodeRuleType) => {
    // reset data to clear redundant keys

    let data: any = { type: type };

    switch (type) {
      case ECodeRuleType.AutoIncrement:
        data = {
          type: type,
          scope: "plant",
          period: "forever",
          length: 1,
          paddingCharactor: "0",
          start: 1,
        } as ICodeRuleFormAutoIncrement;
        break;
      case ECodeRuleType.Checksum:
        data = {
          type: type,
          algorithm: "CRC32",
          length: 1,
          paddingCharactor: "0",
        } as ICodeRuleFormChecksum;
        break;
      case ECodeRuleType.Literal:
        data = { type: type, content: "" } as ICodeRuleFormLiteral;
        break;
      case ECodeRuleType.ParameterValue:
        data = { type: type, parameterName: "", length: 2 } as ICodeRuleFormParameterValue;
        break;
      case ECodeRuleType.Year:
        data = { type: type, length: 2 } as ICodeRuleFormYear;
        break;
    }

    this.setImmerState((state) => {
      state.formList[this.state.focusedPosition] = data;
      state.isModified = true;
    });
  };
}

const styleSegmentsList = css`
  border-bottom: 1px solid #bbb;
  padding: 8px 0;
`;

const styleFormContainer = css`
  width: 600px;
  padding: 32px 8px;
`;

const styleAddIcon = css`
  font-size: 13px;
  cursor: pointer;
`;
