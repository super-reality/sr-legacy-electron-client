import React, { useState } from "react";
import { Category, Channel, ChannelsResult } from "../../../../types/chat";
import ButtonAdd from "../../../../assets/images/add-circle.png";
import SingleChannel from "../single-channel";
import { UpdateCategoryType } from "../../../../utils/chat-utils/categories-services";
import "./index.scss";
import useAnimatedInput from "../../../hooks/useAnimatedInput";

interface CategoryProps {
  category: Category;
  channels: ChannelsResult;
  createChannel: () => void;
  setCategory: (id: string) => void;
  updateCategory: UpdateCategoryType;
  openSettings: () => void;
}
export default function SingleCategory(props: CategoryProps): JSX.Element {
  const {
    category,
    channels,
    createChannel,
    setCategory,
    updateCategory,
    openSettings,
  } = props;
  const { _id } = category;
  const [edit, setEdit] = useState<boolean>(false);

  const categoryChannels = channels.data.filter(
    ({ categoryId }) => categoryId === _id
  );

  const addNewChannel = () => {
    setCategory(_id);
    createChannel();
  };

  const closeEdit = () => {
    setEdit(false);
  };

  // this function updates the category name
  // by calling updateCategory service
  const submitEditCategoryName = (newName: string) => {
    updateCategory(_id, { categoryName: newName });
    setEdit(false);
  };

  const CategoryInput = useAnimatedInput(
    edit,
    category.categoryName,
    submitEditCategoryName,
    closeEdit
  );

  return (
    <div className="single-category">
      <div
        className="channel-title"
        onDoubleClick={() => {
          setEdit(true);
        }}
      >
        {category.categoryName}
      </div>
      {CategoryInput}
      {}
      <div className="add" onClick={addNewChannel}>
        <button type="button">
          <img src={ButtonAdd} />
        </button>
      </div>
      <div className="channels-container">
        <div className="channels">
          {categoryChannels &&
            categoryChannels.map((channel: Channel) => {
              return (
                <SingleChannel
                  key={channel._id}
                  channel={channel}
                  openSettings={openSettings}
                />
              );
            })}
        </div>
      </div>
    </div>
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
/* <animated.div style={nameProps}>
        <div className="category-input">
          <input
            ref={inputRef}
            style={{
              textAlign: "center",
            }}
            value={categoryValue}
            type="text"
            placeholder="Category Name"
            onChange={onChangeHandler}
            onKeyDown={(e) => {
              handleEnterDownEdit(e, submitEditText);
            }}
          />
        </div>
      </animated.div> */
// // activate the outside element click hook
// useDetectOutsideClick(inputRef, closeEdit);
