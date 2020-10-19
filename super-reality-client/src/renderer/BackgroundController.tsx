import React, { useEffect } from "react";
import initializeBackground from "../background/initializeBackground";

export default function BackgroundController(): JSX.Element {
  useEffect(() => {
    initializeBackground();
  }, []);

  return <>Background process</>;
}
