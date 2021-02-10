import React, { useEffect } from "react";
import "./index.scss";
import VibeEmoji from "./VibeEmojiMy";

import emoji1 from "../../../../assets/svg/emoji1.svg";
import emoji2 from "../../../../assets/svg/emoji2.svg";
import emoji3 from "../../../../assets/svg/emoji3.svg";
import emoji4 from "../../../../assets/svg/emoji4.svg";
import emoji5 from "../../../../assets/svg/emoji5.svg";
import emoji6 from "../../../../assets/svg/emoji6.svg";
import emoji7 from "../../../../assets/svg/emoji7.svg";
import emoji8 from "../../../../assets/svg/emoji8.svg";
import emoji9 from "../../../../assets/svg/emoji9.svg";

const PositiveEmojis = [
  { emoji: emoji2, title: "Puke" },
  { emoji: emoji3, title: "Gross" },
  { emoji: emoji4, title: "Curious" },
  { emoji: emoji5, title: "Happy" },
  { emoji: emoji6, title: "Stars" },
];

const NegativeEmojis = [
  { emoji: emoji1, title: "Sad" },
  { emoji: emoji7, title: "Angry" },
  { emoji: emoji8, title: "Angry" },
  { emoji: emoji9, title: "Crying" },
  { emoji: emoji2, title: "puke" },
];
export default function VineGroup(): JSX.Element {
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
    <>
      <div className="vibe-group">
        Positive
        <div className="vibe-emojis">
          <div>
            <VibeEmoji
              title="Cool"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Amusement"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Awe"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Compassion"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Content"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Gratitude"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Hope"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Interest"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Joy"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Love"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Pride"
              checkBoundaries={checkBoundaries}
              emojis={PositiveEmojis}
            />
          </div>
        </div>
      </div>

      <div className="vibe-group">
        Negative
        <div className="vibe-emojis">
          <div>
            <VibeEmoji
              title="Fear"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Anger"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Disgust"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Sadness"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Rage"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Loneliness"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Melancholy"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
          <div>
            <VibeEmoji
              title="Annoyance"
              checkBoundaries={checkBoundaries}
              emojis={NegativeEmojis}
            />
          </div>
        </div>
      </div>
    </>
  );
}
