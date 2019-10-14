import React, { Component } from "react";

import { lang } from "./lingual";
import { ICodeRule } from "./models/code-rule";

import { MesonModal } from "@jimengio/meson-modal";
import CodeRuleEditor from "./editor";

interface IProps {
  visible: boolean;
  codeRules?: ICodeRule[];
  confirmLoading?: boolean;
  onCancelModal?: () => void;
  onSubmitForm?: (codeRules: ICodeRule[]) => void;
}

export default class CodeRuleModal extends Component<IProps, any> {
  render() {
    const { codeRules, confirmLoading, visible } = this.props;

    return (
      <MesonModal
        title={lang.codeRule}
        visible={visible}
        width={700}
        onClose={this.props.onCancelModal}
        renderContent={() => {
          return (
            <div>
              <CodeRuleEditor segments={codeRules || []} onSubmit={this.props.onSubmitForm} />
            </div>
          );
        }}
      ></MesonModal>
    );
  }
}
