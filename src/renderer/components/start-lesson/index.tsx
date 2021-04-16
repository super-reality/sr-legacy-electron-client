import "./index.scss";
import "../containers.scss";
import "../lesson.scss";
import Collapsible from "../collapsible";

export default function StartLesson(): JSX.Element {
  return (
    <div className="mid">
      <div className="lesson-title-container">
        <div className="lesson-icon" />
        <div>
          <div className="lesson-title">My Lesson</div>
          <div className="lesson-subtitle">Rodney Dude</div>
        </div>
      </div>
      <Collapsible title="Active Focus">
        <div className="inner">
          <div className="lesson-title-container">
            <div className="lesson-icon" />
            <div>
              <div className="lesson-title">Blender</div>
              <div className="lesson-subtitle">Media Creation Package</div>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
