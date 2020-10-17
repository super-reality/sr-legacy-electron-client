import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import ButtonRound from "../../button-round";
import { ReactComponent as TrashButton } from "../../../../assets/svg/trash.svg";
import { ReactComponent as EditButton } from "../../../../assets/svg/edit.svg";
import usePopupImage from "../../../hooks/usePopupImage";
import { IAnchor } from "../../../api/types/anchor/anchor";

interface TemplatesListProps {
  templates: string[];
  update: (data: Partial<IAnchor>) => void;
}

export default function TemplatesList(props: TemplatesListProps): JSX.Element {
  const { templates, update } = props;
  const [temp, setTemp] = useState(templates);
  const [editIndex, setEditIndex] = useState(-1);

  const insertImage = useCallback(
    (image: string) => {
      const images = [...temp];
      images.splice(editIndex, 1, image);
      setTemp(images);
    },
    [editIndex, temp]
  );

  const removeImage = useCallback(
    (index: number) => {
      const imgArr = [...temp];
      imgArr.splice(index, 1);
      setTemp(imgArr);
    },
    [temp]
  );

  useEffect(() => {
    update({ templates: temp });
  }, [temp]);

  const [Popup, open] = usePopupImageSource(insertImage, true, true, true);
  const [Image, openImage] = usePopupImage();

  return (
    <>
      {Popup}
      <Image />
      <div className="templates-list-container">
        {temp.map((image, i) => {
          return (
            <div
              className="template-item"
              key={image}
              onClick={() => openImage(image)}
            >
              <img className="template-image" src={image} />
              <ButtonRound
                width="28px"
                height="28px"
                svgStyle={{ width: "18px", height: "18px" }}
                style={{ margin: "6px 0px" }}
                svg={EditButton}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                  setEditIndex(i);
                }}
              />
              <ButtonRound
                width="28px"
                height="28px"
                style={{ margin: "6px" }}
                svg={TrashButton}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
