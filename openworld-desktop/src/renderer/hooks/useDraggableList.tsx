/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useCallback, useState, CSSProperties } from "react";
import { clamp } from "lodash";
// @ts-ignore
import swap from "lodash-move";
import { useDrag } from "react-use-gesture";
import { useSprings, animated } from "react-spring";
import "./styles.scss";

interface ContainerProps {
  style?: CSSProperties;
  className?: string;
}

export default function useDraggableList(
  argItems: JSX.Element[],
  itemHeight: number,
  onChange: (swapA: number, swapB: number) => void
): [
  (props: ContainerProps) => JSX.Element,
  (newItems: JSX.Element[]) => void,
  React.MutableRefObject<number[]>
] {
  // Returns fitting styles for dragged/idle items
  const [items, setItems] = useState(argItems);
  const refOrder = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order

  const resetItems = useCallback((newItems: JSX.Element[]) => {
    setItems(newItems);
    refOrder.current = newItems.map((_, index) => index);
  }, []);

  const changeFn = useCallback(
    (swapA: number, swapB: number) => {
      onChange(swapA, swapB);
    },
    [onChange]
  );

  const fn = useCallback(
    (
      order: number[],
      down?: boolean,
      originalIndex?: number,
      curIndex?: number,
      y?: number
    ) => (index: number) =>
      down && index === originalIndex
        ? {
            y: curIndex! * itemHeight + y!,
            scale: 1.05,
            zIndex: "1",
            shadow: 15,
            immediate: (n: string) => n === "y" || n === "zIndex",
          }
        : {
            y: order.indexOf(index) * itemHeight,
            scale: 1,
            zIndex: "0",
            shadow: 1,
            immediate: false,
          },
    [itemHeight]
  );

  const [springs, setSprings] = useSprings(items.length, fn(refOrder.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const bind = useDrag(({ args: [originalIndex], down, movement: [, y] }) => {
    const curIndex = refOrder.current.indexOf(originalIndex);
    const curRow = clamp(
      Math.round((curIndex * itemHeight + y) / itemHeight),
      0,
      items.length - 1
    );
    const newOrder = swap(refOrder.current, curIndex, curRow);

    setSprings(fn(newOrder, down, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
    if (!down) {
      changeFn(curIndex, curRow);
      refOrder.current = newOrder;
    }
  });

  const Component = (props: ContainerProps) => {
    const { style, className } = props;

    return (
      <div
        className={className}
        style={{
          position: "relative",
          height: items.length * itemHeight,
          ...style,
        }}
      >
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            className="dragList"
            {...bind(i)}
            key={`draggable-list-${items[i].key}`}
            style={
              {
                margin: "0 10px",
                height: `${itemHeight - 8}px`,
                width: `calc(100% - 20px)`,
                zIndex,
                boxShadow: shadow.to(
                  (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                ),
                y,
                scale,
              } as any
            }
          >
            {items[i]}
          </animated.div>
        ))}
      </div>
    );
  };

  return [Component, resetItems, refOrder];
}
