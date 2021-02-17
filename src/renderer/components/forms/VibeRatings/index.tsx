import React, { useEffect } from "react";
import "./index.scss";
import { Field, /*  ErrorMessage, */ FieldProps } from "formik";
import { InputProps } from "..";
import VibeEmoji from "./VibeEmojiMy";
import { ReactComponent as VibeAmusement } from "../../../../assets/svg/vibe-amusment.svg";
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
import { ReactComponent as VibeSadness } from "../../../../assets/svg/vibe-sadness.svg";

/* const PositiveEmojis = [
  { Emoji: emoji2, title: "Puke" },
  { Emoji: emoji3, title: "Gross" },
  { Emoji: emoji4, title: "Curious" },
  { Emoji: emoji5, title: "Happy" },
  { Emoji: emoji6, title: "Stars" },
];

const NegativeEmojis = [
  { Emoji: emoji1, title: "Sad" },
  { Emoji: emoji7, title: "Level 1" },
  { Emoji: emoji8, title: "Very Angry" },
  { Emoji: emoji9, title: "Crying" },
  { Emoji: emoji2, title: "puke" },
]; */

const PositiveVibes = [
  {
    title: "Cool",
    Emoji: VibeCool,
  },
  {
    title: "Amusement",
    Emoji: VibeAmusement,
  },
  {
    title: "Awe",
    Emoji: VibeAwe,
  },
  {
    title: "Compassion",
    Emoji: VibeCompassion,
  },
  {
    title: "Content",
    Emoji: VibeContent,
  },
  {
    title: "Gratitude",
    Emoji: VibeContent,
  },
  {
    title: "Hope",
    Emoji: VibeHope,
  },
  {
    title: "Interest",
    Emoji: VibeInterest,
  },
  {
    title: "Joy",
    Emoji: VibeJoy,
  },
  {
    title: "Love",
    Emoji: VibeLove,
  },
  {
    title: "Pride",
    Emoji: VibePride,
  },
];

const NegativeVibes = [
  {
    title: "Fear",
    Emoji: VibeFear,
  },
  {
    title: "Anger",
    Emoji: VibeAnger,
  },
  {
    title: "Disgust",
    Emoji: VibeDisgust,
  },
  {
    title: "Sadness",
    Emoji: VibeSadness,
  },
  {
    title: "Rage",
    Emoji: VibeRage,
  },
  {
    title: "Loneliness",
    Emoji: VibeLoneliness,
  },
  {
    title: "Melancholy",
    Emoji: VibeMelancholy,
  },
  {
    title: "Annoyance",
    Emoji: VibeAnnoyance,
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
    console.log(typeof VibeInterest);
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
                  <div key={`${vibe.title}-${vibe.Emoji}`}>
                    <VibeEmoji
                      title={vibe.title}
                      checkBoundaries={checkBoundaries}
                      Emoji={vibe.Emoji}
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
                  <div key={`${vibe.title}-${vibe.Emoji}`}>
                    <VibeEmoji
                      title={vibe.title}
                      checkBoundaries={checkBoundaries}
                      Emoji={vibe.Emoji}
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
    Emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Anger"
    checkBoundaries={checkBoundaries}
    Emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Disgust"
    checkBoundaries={checkBoundaries}
    Emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Sadness"
    checkBoundaries={checkBoundaries}
    Emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Rage"
    checkBoundaries={checkBoundaries}
    Emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Loneliness"
    checkBoundaries={checkBoundaries}
    Emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Melancholy"
    checkBoundaries={checkBoundaries}
    Emoji={NegativeEmojis}
  />
</div>
<div>
  <VibeEmoji
    title="Annoyance"
    checkBoundaries={checkBoundaries}
    Emoji={NegativeEmojis}
  />
</div>
</div> */

/* <div className="vibe-emojis">
          <div>
            <VibeEmoji
              title="Cool"
              checkBoundaries={checkBoundaries}
              Emoji={VibeCool}
            />
          </div>
          <div>
            <VibeEmoji
              title="Amusement"
              checkBoundaries={checkBoundaries}
              Emoji={VibeAmusement}
            />
          </div>
          <div>
            <VibeEmoji
              title="Awe"
              checkBoundaries={checkBoundaries}
              Emoji={VibeAwe}
            />
          </div>
          <div>
            <VibeEmoji
              title="Compassion"
              checkBoundaries={checkBoundaries}
              Emoji={VibeCompassion}
            />
          </div>
          <div>
            <VibeEmoji
              title="Content"
              checkBoundaries={checkBoundaries}
              Emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Gratitude"
              checkBoundaries={checkBoundaries}
              Emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Hope"
              checkBoundaries={checkBoundaries}
              Emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Interest"
              checkBoundaries={checkBoundaries}
              Emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Joy"
              checkBoundaries={checkBoundaries}
              Emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Love"
              checkBoundaries={checkBoundaries}
              Emoji={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Pride"
              checkBoundaries={checkBoundaries}
              Emoji={PositiveEmojis}
            />
          </div>
        </div> */
