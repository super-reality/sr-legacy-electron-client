import React, { useEffect, useState, useCallback } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { Field, /*  ErrorMessage, */ FieldProps } from "formik";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";

import { InputProps, PositiveVibes } from "..";
import getVibes from "../../support/support-help/support-help-utils/getVibes";
import { IGetVibe } from "../../../api/types/support-ticket/supportTicket";
import VibeEmoji from "./vibeEmojiMy2";

/* import { ReactComponent as VibeAmusement } from "../../../../assets/svg/vibe-amusment.svg";
import { ReactComponent as VibeAnger } from "../../../../assets/svg/vibe-anger.svg";
import { ReactComponent as VibeAnnoyance } from "../../../../assets/svg/vibe-annoyance.svg";
import { ReactComponent as VibeAwe } from "../../../../assets/svg/vibe-awe.svg";
import { ReactComponent as VibeCompassion } from "../../../../assets/svg/vibe-compasion.svg";
import { ReactComponent as VibeContent } from "../../../../assets/svg/vibe-content.svg";
import { ReactComponent as VibeCool } from "../../../../assets/svg/vibe-cool.svg";
import { ReactComponent as VibeDisgust } from "../../../../assets/svg/vibe-disgust.svg";
import { ReactComponent as VibeFear } from "../../../../assets/svg/vibe-fear.svg";
import { ReactComponent as VibeHope } from "../../../../assets/svg/vibe-hope.svg";
import { ReactComponent as VibeInterest } from "../../../../assets/svg/vibe-interest.svg";
import { ReactComponent as VibeJoy } from "../../../../assets/svg/vibe-joy.svg";
import { ReactComponent as VibeLoneliness } from "../../../../assets/svg/vibe-loneliness.svg";
import { ReactComponent as VibeLove } from "../../../../assets/svg/vibe-love.svg";
import { ReactComponent as VibeMelancholy } from "../../../../assets/svg/vibe-melancholy.svg";
import { ReactComponent as VibePride } from "../../../../assets/svg/vibe-pride.svg";
import { ReactComponent as VibeRage } from "../../../../assets/svg/vibe-rage.svg";
import { ReactComponent as VibeSadness } from "../../../../assets/svg/vibe-sadness.svg"; */

/* const PositiveEmojis = [
  { emoji: emoji2, title: "Puke" },
  { emoji: emoji3, title: "Gross" },
  { emoji: emoji4, title: "Curious" },
  { emoji: emoji5, title: "Happy" },
  { emoji: emoji6, title: "Stars" },
];

const NegativeEmojis = [
  { emoji: emoji1, title: "Sad" },
  { emoji: emoji7, title: "Level 1" },
  { emoji: emoji8, title: "Very Angry" },
  { emoji: emoji9, title: "Crying" },
  { emoji: emoji2, title: "puke" },
]; */

export default function VibeGroup(props: InputProps): JSX.Element {
  function HorizontallyBound(parentDiv: Element, childDiv: Element) {
    const parentRect = parentDiv.getBoundingClientRect();
    const childRect = childDiv.getBoundingClientRect();
    if (childRect.right > parentRect.right) {
      childDiv.classList.remove("left");
      childDiv.classList.remove("center");
      childDiv.classList.add("right");
    } else if (childRect.left - parentRect.left < 10) {
      childDiv.classList.remove("right");
      childDiv.classList.remove("center");
      childDiv.classList.add("left");
    } else {
      childDiv.classList.remove("right");
      childDiv.classList.remove("left");
      childDiv.classList.add("center");
    }
  }
  const { name, setFieldValue } = props;

  const { vibeData } = useSelector(
    (state: AppState) => state.createSupportTicket
  );
  const dispatch = useDispatch();
  const checkBoundaries = () => {
    const vibesGroups = document.querySelector(".vibe-emojis");

    document.querySelectorAll(".vibeEmoji-Container").forEach((container) => {
      if (vibesGroups) HorizontallyBound(vibesGroups, container);
    });
  };

  const [positiveVibes] = useState<IGetVibe[]>(vibeData?.positiveVibes ?? []);

  const setVibes = useCallback(() => {
    (async () => {
      await getVibes().then((result) => {
        reduxAction(dispatch, {
          type: "SET_SUPPORT_TICKET",
          arg: {
            vibeData: result,
          },
        });
      });
    })();
  }, [positiveVibes]);

  useEffect(() => {
    console.log("RERENDER");
    checkBoundaries();
    if (vibeData && vibeData.positiveVibes.length == 0) {
      (async () => {
        await setVibes();
      })();
    }
  }, []);

  return (
    <Field name={name}>
      {({ field }: FieldProps) => {
        return (
          <>
            <div className="vibe-group">
              Positive
              <div className="vibe-emojis">
                {positiveVibes.map((vibe, index) => (
                  <div key={`${vibe.title}-${vibe.emoji}`}>
                    <VibeEmoji
                      title={vibe.title}
                      checkBoundaries={checkBoundaries}
                      emoji={PositiveVibes[index].emoji}
                      field={{ ...field }}
                      setEmoji={setFieldValue}
                      _id={vibe._id}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="vibe-group">
              Negative
              <div className="vibe-emojis">
                {NegativeVibes.map((vibe) => (
                  <div key={`${vibe.title}-${vibe.emoji}`}>
                    <VibeEmoji
                      title={vibe.title}
                      checkBoundaries={checkBoundaries}
                      emoji={vibe.emoji}
                      field={{ ...field }}
                      setEmoji={setFieldValue}
                    />
                  </div>
                ))}
              </div>
            </div> */}
          </>
        );
      }}
    </Field>
  );
}
/* 
<div className="vibe-emojis">
<div>
  <VibeEmoji
    title="Fear"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Anger"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Disgust"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Sadness"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Rage"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Loneliness"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Melancholy"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Annoyance"
    checkBoundaries={checkBoundaries}
    emoji={NegativeEmojis}
  />
</div>
</div> */

/* <div className="vibe-emojis">
          <div>
            <VibeEmoji
              title="Cool"
              checkBoundaries={checkBoundaries}
              emoji={VibeCool}
            />
          </div>
          <div>
            <VibeEmoji
              title="Amusement"
              checkBoundaries={checkBoundaries}
              emoji={VibeAmusement}
            />
          </div>
          <div>
            <VibeEmoji
              title="Awe"
              checkBoundaries={checkBoundaries}
              emoji={VibeAwe}
            />
          </div>
          <div>
            <VibeEmoji
              title="Compassion"
              checkBoundaries={checkBoundaries}
              emoji={VibeCompassion}
            />
          </div>
          <div>
            <VibeEmoji
              title="Content"
              checkBoundaries={checkBoundaries}
              emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Gratitude"
              checkBoundaries={checkBoundaries}
              emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Hope"
              checkBoundaries={checkBoundaries}
              emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Interest"
              checkBoundaries={checkBoundaries}
              emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Joy"
              checkBoundaries={checkBoundaries}
              emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Love"
              checkBoundaries={checkBoundaries}
              emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Pride"
              checkBoundaries={checkBoundaries}
              emoji={PositiveEmojis}
            />
          </div>
        </div> */
