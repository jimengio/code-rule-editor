import React, { useState, FC } from "react";
import { parseRoutePath, IRouteParseResult } from "@jimengio/ruled-router";
import { css, cx } from "emotion";

import { HashRedirect } from "@jimengio/ruled-router/lib/dom";
import { genRouter } from "controller/generated-router";
import CodeRuleEditor from "../../src/editor";
import CodeRuleView from "../../src/code-rule-view";
import { CodeRuleModal } from "../../src";
import { fullscreen, row, expand } from "@jimengio/flex-styles";
import { DocSidebar, ISidebarEntry } from "@jimengio/doc-frame";

let Container: FC<{
  router: IRouteParseResult;
}> = React.memo((props) => {
  let [segments, setSegments] = useState([]);
  let [visible, setVisible] = useState(false);

  let items: ISidebarEntry[] = [];
  let onSwitchPage = (path) => {};

  /** Methods */
  /** Effects */
  /** Renderers */

  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <DocSidebar
        title="Code Rule Editor"
        currentPath={props.router.name}
        onSwitch={(item) => {
          onSwitchPage(item.path);
        }}
        items={items}
      />

      <div className={cx(expand, stylePage)}>
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
    </div>
  );
});

export default Container;

const styleContainer = css`
  font-family: "Helvetica";
`;

let stylePage = css`
  padding: 40px;
`;
