import React, { useLayoutEffect } from "react";

export default function useTransparentFix(debug?: boolean) {
  useLayoutEffect(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    const { setIgnoreMouseEvents } = remote.getCurrentWindow();

    let t: NodeJS.Timeout;

    window.addEventListener("mousemove", (event) => {
      const target = event.target as HTMLElement;
      if (debug) console.log(target.classList, target?.id);
      if (
        target?.classList?.contains("click-through") ||
        target?.id == "root"
      ) {
        setIgnoreMouseEvents(true, { forward: true });
        if (t) clearTimeout(t);
        t = setTimeout(() => {
          setIgnoreMouseEvents(false);
        }, 300);
      } else setIgnoreMouseEvents(false);
    });
  }, []);
}
