import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { TypeValue } from "../../../../../types/utils";
import { ItemVideo, VideoSourceTypeValue } from "../../../../items/item";
import reduxAction from "../../../../redux/reduxAction";
import useStep from "../../hooks/useStep";
import updateItem from "../../lesson-utils/updateItem";
import "../index.scss";
import TypeIdSelectorPanel from "../TypeIdSelectorPanel";

interface VideoItemPanelProps {
  itemId: string;
}

export default function VideoItemPanel(props: VideoItemPanelProps) {
  const { itemId } = props;
  const dispatch = useDispatch();

  const step = useStep(itemId);

  const doUpdate = useCallback(
    (val: VideoSourceTypeValue[]) => {
      if (val[0]?.value) {
        updateItem<ItemVideo>(
          { source: val[0].type, url: val[0].value },
          itemId
        ).then((updated) => {
          if (updated) {
            reduxAction(dispatch, {
              type: "CREATE_LESSON_V2_SETITEM",
              arg: { item: updated },
            });
          }
        });
      }
    },
    [itemId, dispatch]
  );

  return (
    <TypeIdSelectorPanel
      title="Source"
      single
      showActive={false}
      types={["Crop", "File", "YouTube"]}
      baseData={step?.canvas || []}
      callback={doUpdate as (val: TypeValue[]) => void}
    />
  );
}
