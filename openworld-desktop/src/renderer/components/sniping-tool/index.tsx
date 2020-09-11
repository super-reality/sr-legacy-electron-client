/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from "react";
import fs from "fs";
import ReactCrop from "react-image-crop";
import ButtonSimple from "../button-simple";
import "react-image-crop/lib/ReactCrop.scss";

export default function SnipingTool() {
  // eslint-disable-next-line global-require
  const { app, remote, nativeImage } = require("electron");
  const fileName = `${(app || remote.app)
    .getPath("userData")
    .replace(/\\/g, "/")}/capture.png`;
  const output = `${(app || remote.app)
    .getPath("userData")
    .replace(/\\/g, "/")}/crop.png`;
  const [crop, setCrop] = useState<any>({});

  useEffect(() => {
    fs.unlink(output, () => {});
  }, []);

  const doClick = useCallback(async () => {
    const image = nativeImage.createFromPath(fileName).crop({
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
    });
    console.log(image);
    fs.writeFile(output, image.toPNG(), {}, () => {
      remote.getCurrentWindow().close();
    });
  }, [crop]);

  return (
    <>
      <ReactCrop
        src={fileName}
        crop={crop}
        onChange={(newCrop: any) => setCrop(newCrop)}
      />
      {crop.x !== 0 && crop.y !== 0 && crop.width !== 0 && crop.height != 0 ? (
        <ButtonSimple
          width="200px"
          height="24px"
          margin="auto"
          style={{
            position: "absolute",
            bottom: "32px",
            left: "calc(50% - 100px)",
            boxShadow: "0 7px 10px 4px #00000052",
          }}
          onClick={doClick}
        >
          Done
        </ButtonSimple>
      ) : (
        <></>
      )}
    </>
  );
}
