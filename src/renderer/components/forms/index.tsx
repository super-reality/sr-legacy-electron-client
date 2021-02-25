/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { FormikProps } from "formik";
import InputText from "./InputText";
import RadioButtons from "./RadioButtons";
import TextArea from "./TextArea";
import DropFile, { uploadFiles } from "./DropFile";
import SkillsCheckbox from "./SkillsCheckbox";
import EditableText from "./EditableText";
import AutoCompleteInput, { capitalize } from "./AutoCompleteInput";
import FormObserver from "./FormObserver";
import VibeRatings from "./VibeRatings";
import {
  IData,
  singleSupportTicketsPayload,
  IVibe,
} from "../../api/types/support-ticket/supportTicket";

/* EMOJIS */

import VibeAmusement from "../../../assets/images/VibeAmusement.png";
import VibeAnger from "../../../assets/images/VibeAnger.png";
import VibeAnnoyance from "../../../assets/images/VibeAnnoyance.png";
import VibeAwe from "../../../assets/images/VibeAwe.png";
import VibeCompassion from "../../../assets/images/VibeCompasion.png";
import VibeContent from "../../../assets/images/VibeContent.png";
import VibeCool from "../../../assets/images/VibeCool.png";
import VibeDisgust from "../../../assets/images/VibeDisgust.png";
import VibeFear from "../../../assets/images/VibeFear.png";
import VibeHope from "../../../assets/images/VibeHope.png";
import VibeInterest from "../../../assets/images/VibeInterest.png";
import VibeJoy from "../../../assets/images/VibeJoy.png";
import VibeLoneliness from "../../../assets/images/VibeLoneliness.png";
import VibeLove from "../../../assets/images/VibeLove.png";
import VibeMelancholy from "../../../assets/images/VibeMelancholy.png";
import VibePride from "../../../assets/images/VibePride.png";
import VibeRage from "../../../assets/images/VibeRage.png";
import VibeSadness from "../../../assets/images/VibeSadness.png";

import ImagesPreview from "./DropFile/ImagePreview";

export { capitalize };
export { uploadFiles };
export { ImagesPreview };

export const getNames = (array: string[], arrayData: IData[]): IData[] => {
  const resultArray: IData[] = [];
  array.forEach((el) => {
    const i = arrayData.map((ele) => ele._id).indexOf(el);
    if (i !== -1) resultArray.push(arrayData[i]);
  });

  return resultArray;
};

export const valuetoIData = (array: string[]): IData[] => {
  let ArrayData: IData[] = [];
  ArrayData = array.map((e) => ({ _id: e, name: e }));

  return ArrayData;
};

export const singleValuetoIData = (value: string): IData => {
  return { _id: value, name: value, new: true };
};

export const getSingleName = (name: string, array: IData[]): string => {
  const i = array.map((el) => el._id).indexOf(name);
  if (i !== -1) return array[i].name;
  return name;
};

export interface InputProps extends FormikProps<any> {
  name: string;
  secondaryName?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  options?: IData[];
  action?: (value: IData) => void;
  valuesSet?: (value: any) => void;
  filter?: (value: any) => any[];
}

interface FormControlInput extends InputProps {
  control: string;
}

/* export VibesRenderer =(vibes:{_id:string; name:string;}[])=>vibes.map((vibe) => {
  const VibesArray = PositiveVibes.concat(NegativeVibes);
  return (
    <li className="review-skill" key={vibe._id}>
      {vibe.title}
      <img
        className={`result-${vibe.level}`}
        src={
          VibesArray[VibesArray.map((v) => v.title).indexOf(vibe.title)].emoji
        }
      />
    </li>
  );
}) */

export const PositiveVibes = [
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

export const NegativeVibes = [
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

interface ISkillsRendererProps {
  skills: singleSupportTicketsPayload["skill"];
}

export function SkillsRenderer({ skills }: ISkillsRendererProps): JSX.Element {
  return (
    <ul className="skills-list">
      {skills.map((skill) => (
        <li className="review-skill" key={skill._id}>
          {skill.name}
        </li>
      ))}
    </ul>
  );
}

interface IVibesRendererProps {
  vibes: IVibe[];
}

export function VibesRenderer({ vibes }: IVibesRendererProps): JSX.Element {
  return (
    <ul className="skills-list">
      {vibes.map((vibe) => {
        const VibesArray = PositiveVibes.concat(NegativeVibes);
        return (
          <li className="review-skill" key={vibe._id}>
            {vibe.title}
            <img
              className={`result-${vibe.level}`}
              src={
                VibesArray[VibesArray.map((v) => v.title).indexOf(vibe.title)]
                  .emoji
              }
            />
          </li>
        );
      })}
    </ul>
  );
}

export { FormObserver };

export default function FormControl({
  control,
  ...rest
}: FormControlInput): JSX.Element {
  switch (control) {
    case "text":
      return <InputText {...rest} />;
    case "radio":
      return <RadioButtons {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "file":
      return <DropFile {...rest} />;
    case "skills":
      return <SkillsCheckbox {...rest} />;
    case "autocomplete":
      return <AutoCompleteInput {...rest} />;
    case "editable":
      return <EditableText {...rest} />;
    case "vibes":
      return <VibeRatings {...rest} />;

    default:
      return <></>;
  }
}
