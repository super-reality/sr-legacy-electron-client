const ShootingStar = (props: ShootingStarWrapperProps) => {
  const {
    top,
    bottom,
    left,
    right,
    triggerOnComponentUpdate,
    children,
  } = props;
  const isReversed: {
    [key: string]: boolean | undefined;
  } = {
    top: top && typeof top === "object" && top.reverse,
    bottom: bottom && typeof bottom === "object" && bottom.reverse,
    left: left && typeof left === "object" && left.reverse,
    right: right && typeof right === "object" && right.reverse,
  };
  return (
    <>
      {Object.keys(props).map((item: string, index: number) => {
        if (["top", "bottom", "left", "right"].includes(item))
          return (
            <span
              key={
                triggerOnComponentUpdate
                  ? Math.random()
                      .toString(36)
                      .replace(/[^a-z]+/g, "")
                      .substr(0, 5)
                  : index + 1
              }
              style={
                typeof props[item] === "object"
                  ? {
                      [item]: 0,
                      ...props[item]?.style,
                    }
                  : { [item]: 0 }
              }
              id={
                ["top", "bottom"].includes(item)
                  ? `shooting-star-to-${isReversed[item] ? "left" : "right"}`
                  : `shooting-star-to-${isReversed[item] ? "top" : "bottom"}`
              }
            />
          );
        return null;
      })}
      {children}
    </>
  );
};

export default ShootingStar;
