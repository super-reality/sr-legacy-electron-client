import React, { PropsWithChildren, useMemo } from "react";

export default function useBasePanel(
  title: string
): (props: PropsWithChildren<unknown>) => JSX.Element {
  const Component = useMemo(
    () => (props: PropsWithChildren<unknown>) => (
      <div className="selector-panel-container">
        <div className="panel-title">{title}</div>
        <div className="panels-flex">{props.children}</div>
      </div>
    ),

    [title]
  );

  return Component;
}
