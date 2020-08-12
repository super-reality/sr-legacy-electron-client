import React, { useCallback, useState, ReactComponentElement } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";
import { json_rpc_remote } from '../../../utils/util'

const remote = window.require('electron').remote
const path = require("path");
const url = require("url");
var snipWindow: any = null;
function initAnchorDlg() {
  snipWindow = new remote.BrowserWindow({
    width: true ? 100 : 100,
    height: true ? 100 : 100,
    frame: false,
    transparent: false,
    opacity: 0.5,
    alwaysOnTop: true,
    resizabel: true,
    movable: true,
    draggable: true,
    backgroundColor: "#00FFFFFF",
    webPreferences: {
      nodeIntegration: true
    }
  });

  snipWindow.on('closed', () => {
    snipWindow = null;
  });
  snipWindow.on('show', () => console.log('checkmehere show event'))

  var translucent = false

  remote.globalShortcut.register('Control+D', () => {
    translucent = !translucent;
    if (translucent == true) {
      snipWindow.setIgnoreMouseEvents(true)
    }
    else {
      snipWindow.setIgnoreMouseEvents(false)
    }
  })
  remote.globalShortcut.register('Control+S', () => {
    snipWindow.hide()

  })
  snipWindow.hide()

  snipWindow.loadURL(url.format({
    pathname: path.join(__dirname, "..", "public", "dialog.html"),
    protocol: "file:",
    slashes: true,
  }))
  return snipWindow;
}

initAnchorDlg()

export default function DescAuthoring(): JSX.Element {

  let isShow = true

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  
  const insertIcon = useCallback(() => {
    if (snipWindow == null) {
      snipWindow = initAnchorDlg();
      isShow = true
    }
    if (isShow == true) {
      isShow = false
      snipWindow.show();
      json_rpc_remote("snipImage", { "posx": 18, "posy": 39, "width": 100, "height": 200, "path": "" }).then(res => {
        image = require("../../../assets/images/car.png")
        setImage(image)
        setTitle("acer")
      }).catch(err => {
        console.log("error ocurrec checkmehere")
        console.log(err)
      })
    }
    else {
      isShow = true
      snipWindow.hide();
    }
  }, []);
  snipWindow.hide()

  
  

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
      <Flex style={{ gridArea: "icon" }}>
        <div className="container-with-desc">
          <div>Icon</div>
          <InsertMedia
            style={{ width: "32px", height: "32px" }}
            callback={insertIcon}
          />
        </div>
      </Flex>
      <Flex style={{ gridArea: "title" }}>
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
      <Flex style={{ gridArea: "purpose" }}>
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
      <Flex style={{ gridArea: "tags" }}>
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
      <Flex style={{ gridArea: "media" }}>
        <div className="container-with-desc">
          <div>Example Media</div>
          <div className="insert-images-div">
            {
              image == null ?
                <InsertMedia
                  style={{ width: "100%", height: "125px"}}
                  callback={insertIcon}
                /> :
                <InsertMedia
                  style={{ width: "100%", height: "125px", background: `url(${image})` }}
                  callback={insertIcon}
                />
            }
            <InsertMedia
              style={{ width: "100%", height: "125px" }}
              callback={insertIcon}
            />
            <InsertMedia
              style={{ width: "100%", height: "125px" }}
              callback={insertIcon}
            />
          </div>
        </div>
      </Flex>
    </div>
  );
}
