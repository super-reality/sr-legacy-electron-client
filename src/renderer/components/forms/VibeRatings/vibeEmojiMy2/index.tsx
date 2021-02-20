import React, { useState, useEffect, useCallback, useRef } from "react";
import "./index.scss";
import { FieldProps, FormikProps } from "formik";
import emoji1 from "../../../../../assets/svg/emoji1.svg";
/* import emoji2 from "../../../../../assets/svg/emoji2.svg";
import emoji3 from "../../../../../assets/svg/emoji3.svg";
import emoji4 from "../../../../../assets/svg/emoji4.svg";
import emoji5 from "../../../../../assets/svg/emoji5.svg";
 */
/* type TEmojiObject = { emoji: typeof emoji1; title: string }; */

interface IVibeEmoji {
  _id: string;
  title: string;
  checkBoundaries: () => void;
  emoji: string;
  field: FieldProps["field"];
  setEmoji: FormikProps<any>["setFieldValue"];
}

const NONE = 0;
/* const EMOJI1 = 1;
const EMOJI2 = 2;
const EMOJI3 = 3;
const EMOJI4 = 4;
const EMOJI5 = 5; */

/* type TEmojiChoice =
  | typeof EMOJI1
  | typeof EMOJI2
  | typeof EMOJI3
  | typeof EMOJI4
  | typeof EMOJI5
  | typeof NONE; */
/* 
function countWords(str: string) {
  return str.trim().split(/\s+/).length;
} */

export function VibeEmoji(props: IVibeEmoji): JSX.Element {
  const { title, checkBoundaries, emoji, field, setEmoji, _id } = props;
  /*   const Emojisrc = React.lazy(() => import(emoji)); */
  const [selectedEmoji, setSelectedEmoji] = useState<number>(
    field.value.map((f: any) => f._id).indexOf(_id) != -1
      ? field.value[field.value.map((f: any) => f._id).indexOf(_id)].level
      : NONE
  );

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      checkBoundaries();
      const index = field.value.map((f: any) => f._id).indexOf(title);
      console.log(index);
      if (index != -1) {
        const fieldValues = [...field.value];
        console.log(selectedEmoji);
        if (selectedEmoji != NONE) {
          const vibe = { ...fieldValues[index] };
          vibe.level = selectedEmoji;
          fieldValues.splice(index, 1);
          fieldValues.splice(index, 0, vibe);
        } else {
          fieldValues.splice(index, 1);
          console.log(fieldValues);
        }

        setEmoji(field.name, fieldValues);
      } else if (selectedEmoji != NONE) {
        setEmoji(
          field.name,
          field.value.concat([{ _id: _id, title: title, level: selectedEmoji }])
        );
      }
    }
  }, [selectedEmoji]);

  const changeEmoji = useCallback(
    (value: number) => {
      setSelectedEmoji(value);
      console.log(typeof emoji1);
    },
    [selectedEmoji]
  );

  return (
    <div className="vibeEmojis-wrapper">
      <div
        onClick={() => {
          changeEmoji(NONE);
        }}
        className={`vibeEmoji-selector ${
          selectedEmoji != NONE && "vibeEmoji-selected"
        }`}
      >
        {title} +
        {selectedEmoji != NONE && (
          <img className={`result-${selectedEmoji}`} src={emoji} />
        )}
      </div>
      <div className="vibeEmoji-Container">
        {Array.from(Array(3)).map((item, index) => {
          const key = `${title}-${index}`;
          return (
            <div key={key} className={`reaction-${index + 1}`}>
              <div className="reaction-title reaction-title-short">
                {`Level ${index + 1}`}
              </div>
              <img
                onClick={() => {
                  changeEmoji(index + 1);
                }}
                src={emoji}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(VibeEmoji);

/* {selectedEmoji == EMOJI2 && <img src={emojis[1].emoji} />}
        {selectedEmoji == EMOJI3 && <img src={emojis[2].emoji} />}
        {selectedEmoji == EMOJI4 && <img src={emojis[3].emoji} />}
        {selectedEmoji == EMOJI5 && <img src={emojis[4].emoji} />} */

/*         {emojis.map((emoji, index) => (
          <div key={`${emoji.emoji}`} className={`reaction-${index + 1}`}>
            <div
              className={`reaction-title ${
                countWords(emoji.title) > 1
                  ? "reaction-title-long"
                  : "reaction-title-short"
              }`}
            >
              {emoji.title}
            </div>
            <img
              onClick={() => {
                changeEmoji(index + 1);
              }}
              src={emoji.emoji}
            />
          </div>
        ))} */

/*         <div className="reaction-1">
          <div className="reaction-title">sad</div>
          <img
            onClick={() => {
              changeEmoji(EMOJI1);
            }}
            src={emoji1}
          />
        </div>
        <div className="reaction-2">
          <div className="reaction-title">puke</div>
          <img
            onClick={() => {
              changeEmoji(EMOJI2);
            }}
            src={emoji2}
          />
        </div>
        <div className="reaction-3">
          <div className="reaction-title">gross</div>
          <img
            onClick={() => {
              changeEmoji(EMOJI3);
            }}
            src={emoji3}
          />
        </div>
        <div className="reaction-4">
          <div className="reaction-title">akward</div>
          <img
            onClick={() => {
              changeEmoji(EMOJI4);
            }}
            src={emoji4}
          />
        </div>
        <div className="reaction-5">
          <div className="reaction-title">happy</div>
          <img
            onClick={() => {
              changeEmoji(EMOJI5);
            }}
            src={emoji5}
          />
        </div> */
