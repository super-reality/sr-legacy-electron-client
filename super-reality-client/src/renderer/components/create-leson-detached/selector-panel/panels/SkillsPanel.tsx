import React from "react";
import useBasePanel from "../useBasePanel";

import IconAdd from "../../../../../assets/images/small-cirlce-outlined.png";

export default function SkillsPanel() {
  const Panel = useBasePanel("Skills and Achievements");

  return (
    <Panel>
      <div className="panel-wide">
        <div className="skills-search">
          Select skills
          <select>
            <option>Skills</option>
          </select>
        </div>
        Skills
        <div className="skill-chips">
          <div className="skill-chip">MSPaint</div>
          <div className="skill-chip">Digital Art</div>

          <button type="button">
            <img src={IconAdd} alt="" />
          </button>
        </div>
        Achievements Badges
        <div className="skill-chips">
          <div className="skill-chip">Learned How To Open MSPaint</div>

          <button type="button">
            <img src={IconAdd} alt="" />
          </button>
        </div>
      </div>
    </Panel>
  );
}
