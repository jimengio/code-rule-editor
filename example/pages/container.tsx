import React, { useState, FC } from "react";
import { parseRoutePath, IRouteParseResult } from "@jimengio/ruled-router";
import { css, cx } from "emotion";

import { HashRedirect } from "@jimengio/ruled-router/lib/dom";
import { genRouter } from "controller/generated-router";
import CodeRuleEditor from "../../src/editor";
import CodeRuleView from "../../src/code-rule-view";
import { CodeRuleModal } from "../../src";
import { fullscreen, row, expand } from "@jimengio/flex-styles";
import { DocSidebar, ISidebarEntry, DocDemo } from "@jimengio/doc-frame";

let items: ISidebarEntry[] = [{ title: "Editor", path: "/" }];

let Container: FC<{
  router: IRouteParseResult;
}> = React.memo((props) => {
  let [segments, setSegments] = useState([]);
  let [visible, setVisible] = useState(false);

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
        <DocDemo title="DEMO" link="https://github.com/jimengio/code-rule-editor/blob/master/example/pages/container.tsx">
          <CodeRuleEditor
            segments={[]}
            onSubmit={(xs) => {
              setSegments(xs);
            }}
          />
        </DocDemo>

        <DocDemo title="Viewer" link="https://github.com/jimengio/code-rule-editor/blob/master/example/pages/container.tsx">
          <CodeRuleView segments={segments || []} />
        </DocDemo>

        <DocDemo title="Modal Editor" link={"https://github.com/jimengio/code-rule-editor/blob/master/example/pages/container.tsx"}>
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
        </DocDemo>
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
