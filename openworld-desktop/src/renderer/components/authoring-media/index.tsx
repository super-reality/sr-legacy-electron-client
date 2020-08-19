import React from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import { useDispatch, useSelector } from "react-redux";
import InsertMedia from "../insert-media";
import Flex from "../flex";
import { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";

export default function MediAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const { medias } = useSelector((state: AppState) => state.createLesson);

  // const [imageUrls, setImageUrls] = useState<string[]>([]);

  const insertUrl = (image: string, index: number) => {
    const arr = [...medias];
    arr.splice(index, 1, image);

    reduxAction(dispatch, {
      type: "CREATE_LESSON_DATA",
      arg: { medias: arr },
    });
    // setImageUrls(arr);
  };

  const datekey = new Date().getTime();

  return (
    <Flex style={{ gridArea: "media" }}>
      <div className="container-with-desc">
        <div>Add Media</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...medias, undefined].map((url, i) => (
            <InsertMedia
              // eslint-disable-next-line react/no-array-index-key
              key={`insert-media-${datekey}-${i}`}
              imgUrl={url}
              style={{
                marginBottom: "8px",
                width: "100%",
                height: url ? "200px" : "auto",
              }}
              callback={(str) => {
                insertUrl(str, i);
              }}
            />
          ))}
        </Flex>
      </div>
    </Flex>
  );
}
