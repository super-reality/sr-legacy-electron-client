import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useSelector } from "react-redux";
import SelectHeader from "../../components/select-header";
import { AppState } from "../../redux/stores/renderer";

export default function Profile(): JSX.Element {
  const { name, avatarUrl } = useSelector((state: AppState) => state.auth);
  return (
    <div className="mid">
      <SelectHeader />
      <div className="lesson-title-container">
        <div
          className="avatar-icon"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
        <div>
          <div className="lesson-title">{name}</div>
          <div className="lesson-subtitle">User</div>
        </div>
      </div>
    </div>
  );
}
