import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import interact from "interactjs";
// import { getCategory } from "../../../utils/chat-utils/categories-services";
// import { getGroup } from "../../../utils/chat-utils/groups-services";
// import { getChannel } from "../../../utils/chat-utils/channels-services";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
import ShootingStar from "../animations";

import TopMenuBar from "../top-menu-bar";
import Windowlet from "../windowlet";
import ClassroomImg from "../../../assets/images/Classroom.png";
import ButtonAdd from "../../../assets/images/add-circle.png";
import { voidFunction } from "../../constants";

function GroupTemplates() {
  return (
    <div className="group-builder">
      <div className="category">
        <div className="category-name">People</div>
        <button type="button">
          <img src={ButtonAdd} />
        </button>
        <div className="tool-channel">Connections</div>
        <div className="tool-channel">Support</div>
        <div className="tool-channel">Life Stream</div>
      </div>
      <div className="category">
        <div className="category-name">Learning</div>
        <div className="tool-channel">Tutorials</div>
        <div className="tool-channel">Tips</div>
      </div>
      <div className="category">
        <div className="category-name">Productivity</div>
        <div className="tool-channel">Calendar</div>
        <div className="tool-channel">Annotations</div>
        <div className="tool-channel">Match Sense</div>
      </div>
      <div className="category">
        <div className="category-name">Worlds</div>
        <div className="tool-channel">Main Office</div>
        <div className="tool-channel">Annotations</div>
        <div className="tool-channel">Break Room</div>
        <div className="tool-channel">Playground</div>
        <div className="tool-channel">Classroom 1</div>
        <div className="tool-channel">Classroom 2</div>
        <div className="tool-channel">Classroom 3</div>
      </div>
    </div>
  );
}
/*
People
Connections
Support
Life Stream

Learning
Tutorials
Tips

Productivity
Calendar
Annotations
Match Sense

Worlds
Main Office
Break Room
Playground
Classroom 1
Classroom 2
Classroom 3
Hall
*/

const restrictMinSize =
  interact.modifiers &&
  interact.modifiers.restrictSize({
    min: { width: 100, height: 100 },
  });

export default function GroupBuilder() {
  const resizeContainer = useRef<HTMLDivElement>(null);

  const history = useHistory();

  //   getGroup("60198196f067f8217110af35");
  //   getCategory("60199c4af067f8217110af38");
  //   getChannel("60099f0ad01c0f13a237687c");
  //   console.log("test services", test);
  const primarySize = getPrimaryMonitor().workArea;

  useEffect(() => {
    if (resizeContainer.current) {
      interact(resizeContainer.current)
        .resizable({
          edges: { left: false, right: true, bottom: false, top: false },
          modifiers: [restrictMinSize],
          inertia: true,
        } as any)
        .on("resizemove", (event) => {
          const { target } = event;
          target.style.width = `${event.rect.width - 4}px`;
        });

      return (): void => {
        if (resizeContainer.current) interact(resizeContainer.current).unset();
      };
    }
    return voidFunction;
  }, [resizeContainer]);

  return (
    <Windowlet
      width={primarySize.width}
      height={primarySize.height}
      title="Super Reality"
      topBarContent={<TopMenuBar />}
      onMinimize={minimizeWindow}
      onClose={() => history.push("/")}
    >
      <div className="main-container">
        <div className="edit">
          <div
            className="creator"
            style={{ width: "340px" }}
            ref={resizeContainer}
          >
            {/* For shooting star animation - START */}
            <ShootingStar
              style={{ animationDelay: "1.5s", top: 0 }}
              direction="right"
            />
            <ShootingStar
              style={{ animationDelay: "1.75s", right: 0 }}
              direction="bottom"
            />
            {/* For shooting start animation - END */}
            <GroupTemplates />
          </div>
          {/* {openPanel && <LeftPanelWrapper />} */}
          <div className="animate-gradient preview">
            {/* For shooting star animation - START */}
            <ShootingStar
              style={{ animationDelay: "2s", bottom: 0 }}
              direction="right"
            />
            <div>
              <img src={ClassroomImg} />
            </div>
            <ShootingStar
              style={{ animationDelay: "1.75s", left: 0 }}
              direction="bottom"
            />
            {/* For shooting start animation - END */}
          </div>
        </div>
      </div>
    </Windowlet>
  );
}
