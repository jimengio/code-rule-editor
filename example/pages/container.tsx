import React, { useState } from "react";
import { parseRoutePath, IRouteParseResult } from "@jimengio/ruled-router";
import { css } from "emotion";

import { HashRedirect } from "@jimengio/ruled-router/lib/dom";
import { genRouter } from "controller/generated-router";
import CodeRuleEditor from "../../src/editor";
import CodeRuleView from "../../src/code-rule-view";
import { CodeRuleModal } from "../../src";

export default (props) => {
  let [segments, setSegments] = useState([]);
  let [visible, setVisible] = useState(false);

  return (
    <div className={styleContainer}>
      <div>Editor</div>
      <CodeRuleEditor
        segments={[]}
        onSubmit={(xs) => {
          setSegments(xs);
        }}
      />

      <div>Viewer</div>

      <CodeRuleView segments={segments || []} />

      <div>Modal</div>

      <button
        onClick={() => {
          setVisible(true);
        }}
      >
        Open editor
      </button>
      <CodeRuleModal
        visible={visible}
        codeRules={segments}
        onCancelModal={() => {
          setVisible(false);
        }}
        onSubmitForm={(xs) => {
          setSegments(xs);
          setVisible(false);
        }}
      />
    </div>
  );
};

const styleContainer = css`
  font-family: "Helvetica";
`;

const styleTitle = css`
  margin-bottom: 16px;
`;
