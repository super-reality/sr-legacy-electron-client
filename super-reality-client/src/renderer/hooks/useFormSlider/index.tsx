import React, { useEffect, useCallback, useState } from "react";

import { animated, useSpring } from "react-spring";
import "./index.scss";

interface FormSliderProps {
  className?: string;
  children?: React.ReactNode;
  style?: object;
  slides?: number;
}

export default function useFormSlider(steps: number): any {
  const [index, setIndex] = useState(0);

  const [stateSpring, set] = useSpring(
    () =>
      ({
        transform: "translateX(0%)",
      } as any)
  );

  const slideDistance = Math.round(100 / steps);

  console.log(slideDistance);
  console.log(slideDistance * index);

  useEffect(() => {
    set({ transform: `translateX(-${slideDistance * index}%)` });
  });

  const clickGoNext = useCallback(() => {
    setIndex(index + 1);
  }, [index]);

  const clickGoBack = useCallback(() => {
    setIndex(index - 1);
  }, [index]);

  const Slider = ({ children, className }: any) => (
    <FormSlider
      className={className}
      style={stateSpring}
      slides={slideDistance}
    >
      {children}
    </FormSlider>
  );

  return {
    FormSlider: Slider,
    setIndex,
    index,
    stateSpring,
    clickGoNext,
    clickGoBack,
  };
}

function FormSlider(props: FormSliderProps): JSX.Element {
  const { children, style, slides, className } = props;
  console.log(`${slides}%`);
  return (
    <animated.div
      style={{ ...style, ["--slides" as any]: `${slides}%` }}
      className={`sliderForm ${className && className}`}
    >
      {children}
    </animated.div>
  );
}
