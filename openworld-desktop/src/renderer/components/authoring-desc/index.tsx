import React, { useCallback, useState } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";
const remote = window.require('electron').remote
const path = require("path");
const url = require("url");
const snipWindow = new remote.BrowserWindow({
  width: true ? 100 : 100,
  height: true ? 100 : 100,
  frame: false,
  transparent: false,
  opacity:0.5,
  alwaysOnTop: true, 
  resizabel:true,
  movable:true,
  draggable:true,
  backgroundColor: "#00FFFFFF",
  webPreferences: {
    nodeIntegration: true
  }
});


var translucent = false
remote.globalShortcut.register('Control+D', () => {
  if(translucent == true){
    snipWindow.setIgnoreMouseEvents(true)
  }
  else{
    snipWindow.setIgnoreMouseEvents(false)
  }
  translucent = !translucent;
})
remote.globalShortcut.register('Control+S', () => {
  
})


export default function DescAuthoring(): JSX.Element {
  let isShow = true
  snipWindow.loadURL(url.format({
    pathname: path.join(__dirname,"..","public", "dialog.html"),
    protocol: "file:",
    slashes: true,
  }))
  const insertIcon = useCallback(() => {
    if (isShow == true) {
      isShow = false
      snipWindow.show();
    }
    else {
      isShow = true
      snipWindow.hide();
    }
  }, []);
  const [title, setTitle] = useState("");

  const handleChange = useCallback(

    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLInputElement>
    ): void => {
      setTitle(e.currentTarget.value);
    },
    []
  );

  return (
    <div className="inner desc-authoring-grid">
      <Flex style={{gridArea: "icon"}}>
        <div className="container-with-desc">
          <div>Icon</div>
          <InsertMedia
            style={{width: "32px", height: "32px"}}
            callback={insertIcon}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "title"}}>
        <div className="container-with-desc">
          <div>Lesson Title</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "purpose"}}>
        <div className="container-with-desc">
          <div>Purpose</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "tags"}}>
        <div className="container-with-desc">
          <div>Lesson Tags</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "media"}}>
        <div className="container-with-desc">
          <div>Example Media</div>
          <Flex style={{justifyContent: "space-between"}}>
            <InsertMedia
              style={{width: "30%", height: "125px"}}
              callback={insertIcon}
            />
            <InsertMedia
              style={{width: "30%", height: "125px"}}
              callback={insertIcon}
            />
            <InsertMedia
              style={{width: "30%", height: "125px"}}
              callback={insertIcon}
            />
          </Flex>
        </div>
      </Flex>
    </div>
  );
}
