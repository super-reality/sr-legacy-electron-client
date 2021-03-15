import React, { useEffect } from "react";
import "./index.scss";
import { Field, /*  ErrorMessage, */ FieldProps } from "formik";
import { InputProps } from "..";
import VibeEmoji from "./VibeEmojiMy";

import VibeAmusement from "../../../../assets/svg/vibe-amusment.svg";
import VibeAnger from "../../../../assets/svg/vibe-anger.svg";
import VibeAnnoyance from "../../../../assets/svg/vibe-annoyance.svg";
import VibeAwe from "../../../../assets/svg/vibe-awe.svg";
import VibeCompassion from "../../../../assets/svg/vibe-compasion.svg";
import VibeContent from "../../../../assets/svg/vibe-content.svg";
import VibeCool from "../../../../assets/svg/vibe-cool.svg";
import VibeDisgust from "../../../../assets/svg/vibe-disgust.svg";
import VibeFear from "../../../../assets/svg/vibe-fear.svg";
import VibeHope from "../../../../assets/svg/vibe-hope.svg";
import VibeInterest from "../../../../assets/svg/vibe-interest.svg";
import VibeJoy from "../../../../assets/svg/vibe-joy.svg";
import VibeLoneliness from "../../../../assets/svg/vibe-loneliness.svg";
import VibeLove from "../../../../assets/svg/vibe-love.svg";
import VibeMelancholy from "../../../../assets/svg/vibe-melancholy.svg";
import VibePride from "../../../../assets/svg/vibe-pride.svg";
import VibeRage from "../../../../assets/svg/vibe-rage.svg";
import VibeSadness from "../../../../assets/svg/vibe-sadness.svg";

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

const PositiveVibes = [
  {
    title: "Cool",
    emoji: VibeCool,
  },
  {
    title: "Amusement",
    emoji: VibeAmusement,
  },
  {
    title: "Awe",
    emoji: VibeAwe,
  },
  {
    title: "Compassion",
    emoji: VibeCompassion,
  },
  {
    title: "Content",
    emoji: VibeContent,
  },
  {
    title: "Gratitude",
    emoji: VibeContent,
  },
  {
    title: "Hope",
    emoji: VibeHope,
  },
  {
    title: "Interest",
    emoji: VibeInterest,
  },
  {
    title: "Joy",
    emoji: VibeJoy,
  },
  {
    title: "Love",
    emoji: VibeLove,
  },
  {
    title: "Pride",
    emoji: VibePride,
  },
];

const NegativeVibes = [
  {
    title: "Fear",
    emoji: VibeFear,
  },
  {
    title: "Anger",
    emoji: VibeAnger,
  },
  {
    title: "Disgust",
    emoji: VibeDisgust,
  },
  {
    title: "Sadness",
    emoji: VibeSadness,
  },
  {
    title: "Rage",
    emoji: VibeRage,
  },
  {
    title: "Loneliness",
    emoji: VibeLoneliness,
  },
  {
    title: "Melancholy",
    emoji: VibeMelancholy,
  },
  {
    title: "Annoyance",
    emoji: VibeAnnoyance,
  },
];

export default function VineGroup(props: InputProps): JSX.Element {
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

  const checkBoundaries = () => {
    const vibesGroups = document.querySelector(".vibe-emojis");

    document.querySelectorAll(".vibeEmoji-Container").forEach((container) => {
      if (vibesGroups) HorizontallyBound(vibesGroups, container);
    });
  };

  useEffect(() => {
    checkBoundaries();
  }, []);

  return (
    <Field name={name}>
      {({ field }: FieldProps) => {
        return (
          <>
            <div className="vibe-group">
              Positive
              <div className="vibe-emojis">
                {PositiveVibes.map((vibe) => (
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
            </div>

            <div className="vibe-group">
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
            </div>
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
