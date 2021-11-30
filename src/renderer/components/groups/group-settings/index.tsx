import { useSelector } from "react-redux";
import { PagesIndex } from "../../../../types/browser";
import { AppState } from "../../../redux/stores/renderer";
import ButtonRound from "../../button-round";
import GeneralSettings from "../settings-general";
import { ReactComponent as Close } from "../../../../assets/svg/close-circle-red.svg";
import "./index.scss";

interface GroupSettingsProps {
  setPage: (pageIndex: any) => void;
}
export default function GroupSettings(props: GroupSettingsProps) {
  const { setPage } = props;
  const { activeGroup, groups } = useSelector((state: AppState) => state.chat);
  const activeGroupObject = groups.find(({ _id }) => _id === activeGroup);
  return (
    <div className="group-settings">
      <div className="left-container">
        <div className="group-name">
          {activeGroupObject && activeGroupObject.groupName}
        </div>
        <div className="setttings-list">
          <div className="settings-list-item">General</div>
          <div className="settings-list-item">settings-list-item</div>
          <div className="settings-list-item">settings-list-item</div>
          <div className="settings-list-item">settings-list-item</div>
          <div className="settings-list-item">settings-list-item</div>
        </div>
      </div>

      <div className="settings-content-container">
        <div className="settings-content">
          {activeGroupObject && (
            <GeneralSettings activeGroup={activeGroupObject} />
          )}
        </div>
        <ButtonRound
          svg={Close}
          width="50px"
          height="50px"
          style={{
            color: "var(--color-text)",
          }}
          iconFill="var(--color-text)"
          onClick={() => {
            setPage(PagesIndex.chatContainer);
          }}
        />
      </div>
    </div>
  );
}
