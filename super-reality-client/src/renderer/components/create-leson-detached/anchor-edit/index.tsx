import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAnchor } from "../../../api/types/anchor/anchor";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import Flex from "../../flex";
import updateAnchor from "../lesson-utils/updateAnchor";

import { ReactComponent as CloseButton } from "../../../../assets/svg/win-close.svg";
import { ReactComponent as ImageButton } from "../../../../assets/svg/add-image.svg";
import { ReactComponent as RecordButton } from "../../../../assets/svg/add-video.svg";
import TemplatesList from "../templates-list";
import ButtonSimple from "../../button-simple";
import ButtonRound from "../../button-round";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import AnchorEditSliders from "../anchor-edit-sliders";
import uploadFileToS3 from "../../../../utils/uploadFileToS3";

interface AnchorEditProps {
  setTransparent: () => void;
}

export default function AnchorEdit(props: AnchorEditProps): JSX.Element {
  const { setTransparent } = props;
  const updateTImeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const { currentAnchor, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const closeAnchorEdit = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { currentAnchor: undefined },
    });
  }, [dispatch]);

  const anchor = useMemo(() => {
    return treeAnchors[currentAnchor || ""] || null;
  }, [treeAnchors, currentAnchor]);

  const update = useCallback(
    (data: Partial<IAnchor>) => {
      // Debouce api update, 1 second (should make a debounce hook??)
      console.log(data);
      if (updateTImeout.current) clearTimeout(updateTImeout.current);
      updateTImeout.current = setTimeout(() => {
        const newData = { ...anchor, ...data };
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_SETANCHOR",
          arg: { anchor: newData },
        });
        updateAnchor(data, anchor._id);
      }, 1000);
    },
    [anchor, dispatch]
  );

  const insertImage = useCallback(
    (image: string) => {
      uploadFileToS3(image).then((url) => {
        const imgArr = [...anchor.templates, url];
        update({ templates: imgArr });
      });
    },
    [anchor]
  );

  const doTest = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { anchorTestView: true },
    });
    setTransparent();
  }, [dispatch, setTransparent]);

  const [Popup, open] = usePopupImageSource(insertImage, true, true, true);

  if (anchor === null) return <></>;

  return (
    <div
      className="mid-tight"
      style={{
        height: "100%",
        overflow: "auto",
        padding: "10px",
        marginTop: "0",
      }}
    >
      {Popup}
      <Flex style={{ marginBottom: "16px" }}>
        <div>Edit Anchor</div>
        <div className="container-close" onClick={closeAnchorEdit}>
          <CloseButton style={{ margin: "auto" }} />
        </div>
      </Flex>
      <Flex style={{ marginBottom: "8px" }}>
        <ButtonRound
          svg={ImageButton}
          width="28px"
          height="28px"
          style={{ marginRight: "8px" }}
          onClick={open}
        />
        <ButtonRound
          svg={RecordButton}
          width="28px"
          height="28px"
          onClick={open}
        />
      </Flex>
      <TemplatesList
        key={anchor._id}
        update={update}
        templates={anchor.templates}
      />
      <ButtonSimple onClick={doTest} width="190px" height="24px" margin="auto">
        Test Anchor
      </ButtonSimple>
      <AnchorEditSliders anchor={anchor} update={update} />
    </div>
  );
}
