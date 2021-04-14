import { useRef } from "react";
import ButtonSimple from "../components/button-simple";
import usePopup from "./usePopup";

interface CreateGroupProps {
  createGroup: (gName: string, gPhoto?: string) => void;
}
export default function usePopupCreateGroup(
  props: CreateGroupProps
): [() => JSX.Element, () => void] {
  const { createGroup } = props;
  const [CreateGroupPopup, doOpen, close] = usePopup(false);
  const groupNameField = useRef<HTMLInputElement | null>(null);
  const groupAvatarField = useRef<HTMLInputElement | null>(null);

  const submitCreateGroup = () => {
    if (groupNameField.current) {
      if (
        groupNameField.current &&
        groupAvatarField.current &&
        groupAvatarField.current.value
      ) {
        // console.log(
        //   "groupAvatarField.current.value",
        //   groupAvatarField.current.value,
        //   "groupNameField.current.value",
        //   groupNameField.current.value
        // );
        // (client as any)
        //   .service("collectives")
        //   .create({
        //     collectiveName: "Test Grop from hook",

        //     collectivePhoto:
        //       "https://i.pinimg.com/originals/e7/f0/c9/e7f0c9b4cdc731cd9b58077af3854118.jpg",
        //   })
        //   .catch((err: any) => {
        //     console.log(err);
        //   });
        createGroup(
          groupNameField.current.value,
          groupAvatarField.current.value
        );
        close();
      } else {
        createGroup(groupNameField.current.value);
        close();
      }
    }
  };

  const Modal = () => {
    return (
      <CreateGroupPopup width="400px" height="500px">
        <form className="auth-container">
          <fieldset>
            <div className="input-container">
              <label>Group Name</label>
              <input
                ref={groupNameField}
                key="group-name"
                type="text"
                placeholder=""
              />
            </div>
            <div className="input-container">
              <label>Group Avatar</label>
              <input
                ref={groupAvatarField}
                key="gruop-avatar-input"
                type="text"
                placeholder=""
              />
            </div>
          </fieldset>
          <ButtonSimple
            margin="8px auto"
            width="140px"
            height="16px"
            onClick={submitCreateGroup}
          >
            Ok
          </ButtonSimple>
          <ButtonSimple
            margin="8px auto"
            width="140px"
            height="16px"
            onClick={() => {
              close();
            }}
          >
            Cancel
          </ButtonSimple>
        </form>
      </CreateGroupPopup>
    );
  };

  return [Modal, doOpen];
}
