import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import reduxAction from "../../redux/reduxAction";
import { AppState } from "../../redux/stores/renderer";
import Windowlet from "../create-leson-detached/windowlet";
import Flex from "../flex";
import ItemPreview from "./item-preview";

interface LessonPlayerProps {
  onFinish: () => void;
}

export default function LessonPlayer(props: LessonPlayerProps) {
  const { onFinish } = props;
  const dispatch = useDispatch();
  const { stepPreview, itemPreview, lessonPreview } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const clearPreviews = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { stepPreview: false, itemPreview: false, lessonPreview: false },
    });
    onFinish();
  }, [dispatch, onFinish]);

  return (
    <>
      {itemPreview && <ItemPreview />}
      <Windowlet
        title="Super Reality"
        width={320}
        height={140}
        onClose={clearPreviews}
      >
        <Flex column style={{ height: "100%" }}>
          Playing lesson
        </Flex>
      </Windowlet>
    </>
  );
}
