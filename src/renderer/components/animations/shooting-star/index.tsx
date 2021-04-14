import { CSSProperties } from "react";

interface ShootingStarProps {
  /** The direction to which the light will move */
  direction: "left" | "right" | "bottom" | "top";
  /** This prop is for to customize the animation entirely, like changing glow color */
  style: CSSProperties;
}

const ShootingStar = (props: ShootingStarProps) => {
  const { style, direction } = props;
  return <span style={style} id={`shooting-star-to-${direction}`} />;
};

export default ShootingStar;
