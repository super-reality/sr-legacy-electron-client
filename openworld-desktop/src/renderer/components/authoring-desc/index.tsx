import React, { useCallback, useState, addCallback, setGlobal, getGlobal, useEffect } from "reactn";
import { useSet } from "react-use";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";

// this sample code 
import { jsonRpcRemote } from '../../../utils/util'

const electron = window.require('electron')
const { remote } = electron
const { screen } = remote
const path = require("path");

const url = require("url");

let snipWindow: any = null;

function initAnchorDlg() {
  snipWindow = new remote.BrowserWindow({
    width: true ? 200 : 200,
    height: true ? 200 : 200,
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

  let translucent = false

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
    if (snipWindow != null) {
      snipWindow.hide()
      const pos = snipWindow.getPosition()
      const size = snipWindow.getSize()
      if(size[0]<=0 || size[1] <= 0){
        return;
      }
      
      jsonRpcRemote("snipImage", { "posx": pos[0], "posy": pos[1], "width": size[0], "height": size[1], "path": "" }).then(res => {
        let rescopy:any = res;
        const ImagePathCopy = rescopy.result.imgPath
        setGlobal({imgUrl : ImagePathCopy})
      }).catch(err => {
        console.log("error ocurrec checkmehere")
        console.log(err)
      })
    }
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
// end sample code
export default function DescAuthoring(): JSX.Element {

  // this sample code 
  const [imgUrl,setimgUrl] = useState("")

  useEffect(() => {
    addCallback(global => {
      let result:any = global
      setimgUrl(result.imgUrl)
    })
  });

  let isShow = true
  const insertIcon = useCallback(() => {
    if (snipWindow == null) {
      snipWindow = initAnchorDlg();
      isShow = true
    }
    if (isShow == true) {
      isShow = false
      snipWindow.show();
    }
    else {
      isShow = true
      snipWindow.hide();
    }
  }, []);
  // end sample code

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
            <InsertMedia
              imgUrl={imgUrl}
              style={{ width: "100%", height: "125px" }}
              callback={insertIcon}
            />
            <InsertMedia
              imgUrl={imgUrl}
              style={{ width: "100%", height: "125px" }}
              callback={insertIcon}
            />
            <InsertMedia
              imgUrl={imgUrl}
              style={{ width: "100%", height: "125px" }}
              callback={insertIcon}
            />
          </div>
        </div>
      </Flex>
    </div>
  );
}
