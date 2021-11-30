import { useEffect, CSSProperties, ReactNode } from "react";
import { animated, useSpring } from "react-spring";
import "./index.scss";

interface FormSliderProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  slides?: number;
  width?: number;
}

function FormSlider(props: FormSliderProps): JSX.Element {
  const { children, style, slides, className, width } = props;
  return (
    <animated.div
      style={
        {
          ...style,
          ["--slides" as any]: `${slides}%`,
          ["--width" as any]: `${width}%`,
        } as any
      }
      className={`sliderForm ${className && className}`}
    >
      {children}
    </animated.div>
  );
}

let index = 0;
export default function useFormSlider(steps: number): any {
  console.log(index);

  useEffect(() => {
    index = 0;
  }, []);
  const [stateSpring, set] = useSpring(
    () =>
      ({
        transform: "translateX(0%)",
      } as any)
  );

  const slideDistance = 100 / steps;
  const slideWidth = Math.round(100 / steps);

  const clickGoNext = () => {
    index += 1;
    set({ transform: `translateX(-${slideDistance * index}%)` });
  };

  const clickGoBack = () => {
    index -= 1;
    set({ transform: `translateX(-${slideDistance * index}%)` });
  };

  const setIndex = (i: number) => {
    if (i <= steps && i > 0) {
      index = i;
    }
  };

  /*   const clickGoNext = useCallback(() => {
    setIndex(index + 1);
  }, [index]);

  const clickGoBack = useCallback(() => {
    setIndex(index - 1);
  }, [index]); */
  const Slider = ({ children, className }: any) => (
    <FormSlider
      width={steps * 100}
      className={className}
      style={stateSpring}
      slides={slideWidth}
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
