import { AreaChangeEv, InputChangeEv } from "../../types/utils";

export const dummyFunction = () => {
  console.log("dummy test functinon");
};

export const onTextChange = (
  e: InputChangeEv | AreaChangeEv,
  set: (value: string) => void
) => {
  const { value } = e.currentTarget;
  set(value);
};

export const handleEnterDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  handle: () => void
) => {
  if (e.key === "Enter") {
    handle();
  }
};
