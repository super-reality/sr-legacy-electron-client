import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import { Category, Channel, ChannelsResult } from "../../../../types/chat";
import ButtonAdd from "../../../../assets/images/add-circle.png";
import SingleChannel from "../single-channel";
import { onTextChange } from "../../../../utils/chat-utils/common-functions";
import { UpdateGroupType } from "../../../../utils/chat-utils/groups-services";
import { UpdateCategoryType } from "../../../../utils/chat-utils/categories-services";
import "./index.scss";

interface CategoryProps {
  category: Category;
  channels: ChannelsResult;
  createChannel: () => void;
  setCategory: (id: string) => void;
  updateCategory: UpdateCategoryType;
  // (id: string, params: CategorySettings) => void;
}
export default function SingleCategory(props: CategoryProps): JSX.Element {
  const {
    category,
    channels,
    createChannel,
    setCategory,
    updateCategory,
  } = props;
  const [edit, setEdit] = useState<boolean>(false);
  const [text, setText] = useState<string>(category.categoryName);

  const categoryChannels = channels.data.filter(
    ({ categoryId }) => categoryId === category._id
  );

  const addNewChannel = () => {
    setCategory(category._id);
    createChannel();
  };

  // function for changing the category name
  const submitEditText = (
    id: string,
    updatedText: string,
    updateService: UpdateCategoryType | UpdateGroupType,
    editSetFunc: (param: boolean) => void,
    textSetFunc: (param: string) => void
  ) => {
    updateService(id, { categoryName: updatedText });
    editSetFunc(false);
    textSetFunc("");
  };

  const handleEnterDownEdit = (
    id: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      submitEditText(id, text, updateCategory, setEdit, setText);
    }
  };

  const nameProps = useSpring({
    config: { mass: 4, tension: 1500, friction: 180 },
    opacity: edit ? 1 : 0,
    width: edit ? "70%" : "0%",
    right: edit ? "20%" : "50%",
    zIndex: 1,
    position: "absolute",
    top: "8%",
    boxShadow: "0 7px 10px rgba(0, 0, 0, 0.24)",
    // from: { opacity: 0, width: "0" },
  } as any);

  return (
    <>
      <div
        className="channel-title"
        onDoubleClick={() => {
          setEdit(!edit);
          setText(category.categoryName);
        }}
      >
        {category.categoryName}
      </div>
      <animated.div style={nameProps}>
        <div className="category-input">
          <input
            style={{
              textAlign: "center",
            }}
            value={text}
            type={text}
            placeholder="You rock!"
            onChange={(e) => {
              onTextChange(e, setText);
            }}
            onKeyDown={(e) => {
              handleEnterDownEdit(category._id, e);
            }}
          />
        </div>
      </animated.div>
      <div className="add" onClick={addNewChannel}>
        <button type="button">
          <img src={ButtonAdd} />
        </button>
      </div>
      <div className="channel-container">
        <div className="channels">
          {categoryChannels &&
            categoryChannels.map((channel: Channel) => {
              return <SingleChannel key={channel._id} channel={channel} />;
            })}
        </div>
      </div>
    </>
  );
}
/*
{edit ? (
          <div className="category-input">
            <input
              value={text}
              type={text}
              placeholder="You rock!"
              onChange={(e) => {
                onTextChange(e, setText);
              }}
              onKeyDown={(e) => {
                handleEnterDownEdit(category._id, e);
              }}
            />
          </div>
        ) : (
          category.categoryName
        )}
        
*/
