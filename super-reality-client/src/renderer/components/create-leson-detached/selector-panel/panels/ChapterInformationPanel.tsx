import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../../../hooks/useDebounce";
import reduxAction from "../../../../redux/reduxAction";
import { AppState } from "../../../../redux/stores/renderer";
import BaseInput from "../../../base-input";
import updateChapter from "../../lesson-utils/updateChapter";
import useBasePanel from "../useBasePanel";

import { ReactComponent as IconInfo } from "../../../../../assets/svg/information.svg";

interface ChapterInformationPanelProps {
  chapterId: string;
}

export default function ChapterInformationPanel(
  props: ChapterInformationPanelProps
) {
  const { chapterId } = props;
  const dispatch = useDispatch();
  const { treeChapters } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const step = useMemo(
    () => (chapterId ? treeChapters[chapterId] : undefined),
    [chapterId, treeChapters]
  );

  const [chapterName, setChapterName] = useState(step?.name || "");

  const debouncer = useDebounce(1000);
  const handleNameChange = useCallback(
    (e) => {
      const newName = e.currentTarget.value;
      setChapterName(newName);

      if (step) {
        debouncer(() => {
          updateChapter({ name: newName }, step._id).then((newChapter) => {
            if (newChapter) {
              reduxAction(dispatch, {
                type: "CREATE_LESSON_V2_SETCHAPTER",
                arg: { chapter: newChapter },
              });
            }
          });
        });
      }
    },
    [step, chapterName, debouncer]
  );

  const Panel = useBasePanel("Information", IconInfo, {});

  return (
    <Panel>
      <div className="panel-wide">
        <BaseInput
          title="Chapter Name"
          value={chapterName}
          onChange={handleNameChange}
        />
      </div>
    </Panel>
  );
}
