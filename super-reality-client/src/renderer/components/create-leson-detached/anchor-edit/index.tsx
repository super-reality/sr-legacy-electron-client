import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { IAnchor } from "../../../api/types/anchor/anchor";
import reduxAction from "../../../redux/reduxAction";
import updateAnchor from "../lesson-utils/updateAnchor";

import ButtonSimple from "../../button-simple";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import AnchorEditSliders from "../anchor-edit-sliders";
import uploadFileToS3 from "../../../../utils/api/uploadFileToS3";
import BaseInput from "../../base-input";
import useDebounce from "../../../hooks/useDebounce";
import useAnchor from "../hooks/useAnchor";

interface AnchorEditProps {
  anchorId: string | undefined;
}

export default function AnchorEdit(props: AnchorEditProps): JSX.Element {
  const { anchorId } = props;
  const dispatch = useDispatch();

  const anchor = useAnchor(anchorId);

  const [anchorName, setAnchorName] = useState(anchor?.name || "New Anchor");

  const update = useCallback(
    (data: Partial<IAnchor>) => {
      if (anchor) {
        const newData = { ...anchor, ...data };
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_SETANCHOR",
          arg: { anchor: newData },
        });
        updateAnchor({ ...data }, anchor._id);
      }
    },
    [anchor, dispatch]
  );

  const debouncer = useDebounce(1000);

  const debouncedUpdate = useCallback(
    (data: Partial<IAnchor>) => {
      debouncer(() => {
        update(data);
      });
    },
    [debouncer, update]
  );

  const insertImage = useCallback(
    (image: string) => {
      if (anchor) {
        uploadFileToS3(image).then((url) => {
          const imgArr = [...anchor.templates, url];
          update({ templates: imgArr });
        });
      }
    },
    [anchor]
  );

  const doTest = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        previewing: false,
        previewOne: false,
        lessonPreview: false,
        chapterPreview: false,
        stepPreview: false,
        itemPreview: false,
        anchorTestView: true,
        currentAnchor: anchorId,
      },
    });
  }, [dispatch, anchorId]);

  const [Popup, _open] = usePopupImageSource(
    insertImage,
    true,
    true,
    true,
    true
  );

  const handleNameChange = useCallback(
    (e) => {
      setAnchorName(e.currentTarget.value);

      if (anchor && e.key === "Enter") {
        debouncer(() => {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETANCHOR",
            arg: { anchor: { ...anchor, name: anchorName } },
          });
          updateAnchor({ name: anchorName }, anchor._id);
        });
      }
    },
    [anchor, anchorName, debouncer]
  );

  if (anchor === null) return <></>;
  return (
    <>
      {Popup}
      <ButtonSimple onClick={doTest} width="190px" height="24px" margin="auto">
        Test Anchor
      </ButtonSimple>
      <BaseInput
        title="Anchor name"
        value={anchorName}
        onChange={handleNameChange}
      />
      <AnchorEditSliders anchor={anchor} update={debouncedUpdate} />
    </>
  );
}
