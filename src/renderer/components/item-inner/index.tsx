import { PropsWithChildren, CSSProperties } from "react";
import "./index.scss";
import ShareButton from "../share-button";
import CheckButton from "../check-button";

interface InnerItemProps {
  style?: CSSProperties;
  text?: boolean;
  controls?: boolean;
  drag?: boolean;
  onClick?: () => void;
}

export function ItemInner(
  props: PropsWithChildren<InnerItemProps>
): JSX.Element {
  const { drag, style, controls, text, children, onClick } = props;
  return (
    <div
      onClick={onClick}
      className={`item-container ${onClick ? "can-hover" : ""} ${
        drag ? "can-drag" : ""
      } ${controls ? "controls" : ""} ${text ? "text" : ""}`}
      style={{ ...style }}
    >
      {children}
    </div>
  );
}

export function ItemInnerLoader(
  props: PropsWithChildren<InnerItemProps>
): JSX.Element {
  const { style } = props;
  return (
    <div className="item-container loader" style={{ ...style }}>
      <div
        className="item-icon"
        style={{
          ...style,
          width: "100%",
          height: "100%",
          backgroundColor: "var(--color-section-inner-hover)",
          gridArea: "icon",
        }}
      />
      <div
        style={{
          width: "60%",
          height: "10px",
          borderRadius: "4px",
          backgroundColor: "var(--color-section-inner-hover)",
          gridArea: "titleup",
        }}
      />
      <div
        style={{
          width: "40%",
          height: "10px",
          borderRadius: "4px",
          backgroundColor: "var(--color-section-inner-hover)",
          gridArea: "titlebot",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "32px",
          borderRadius: "5px",
          backgroundColor: "var(--color-section-inner-hover)",
          gridArea: "score",
        }}
      />
    </div>
  );
}

export function ContainerTopFace(
  props: PropsWithChildren<{ style?: CSSProperties }>
): JSX.Element {
  const { children, style } = props;
  return (
    <div className="container-topface" style={{ ...style }}>
      {children}
    </div>
  );
}

export function ContainerTop(
  props: PropsWithChildren<{ style?: CSSProperties }>
): JSX.Element {
  const { children, style } = props;
  return (
    <div className="container-top" style={{ ...style }}>
      {children}
    </div>
  );
}

export function ContainerTopBig(
  props: PropsWithChildren<{ style?: CSSProperties }>
): JSX.Element {
  const { children, style } = props;
  return (
    <div className="container-top-big" style={{ ...style }}>
      {children}
    </div>
  );
}

export function ContainerFlex(
  props: PropsWithChildren<{ style?: CSSProperties }>
): JSX.Element {
  const { children, style } = props;
  return (
    <div className="container-flex" style={{ ...style }}>
      {children}
    </div>
  );
}

export function ContainerBottom(
  props: PropsWithChildren<{ style?: CSSProperties }>
): JSX.Element {
  const { children, style } = props;
  return (
    <div className="container-bottom" style={{ ...style }}>
      {children}
    </div>
  );
}

interface IconProps {
  url: string;
  style?: CSSProperties;
  area?: string;
}

export function Icon(props: PropsWithChildren<IconProps>): JSX.Element {
  const { url, area, style, children } = props;
  return (
    <div
      className="item-icon"
      style={{ ...style, gridArea: area, backgroundImage: `url(${url})` }}
    >
      {children}
    </div>
  );
}

interface PointsProps {
  points: number;
  style?: CSSProperties;
}

export function Points(props: PointsProps): JSX.Element {
  const { points, style } = props;
  return (
    <div
      className={`item-points ${points < 0 ? "red" : "green"}`}
      style={{ ...style }}
    >
      {points}
    </div>
  );
}

interface TitleProps {
  style?: CSSProperties;
  area?: string;
  title: string;
  sub?: string;
}

export function Title(props: PropsWithChildren<TitleProps>): JSX.Element {
  const { title, area, sub, style, children } = props;
  return (
    <div className="item-titles" style={{ ...style, gridArea: area }}>
      <div className="item-title">{children || title}</div>
      {sub ? <div className="item-sub">{sub}</div> : <></>}
    </div>
  );
}

interface TextProps {
  style?: CSSProperties;
  area?: string;
}

export function Text(props: PropsWithChildren<TextProps>): JSX.Element {
  const { style, area, children } = props;
  return (
    <div className="item-text" style={{ ...style, gridArea: area }}>
      {children}
    </div>
  );
}

interface SocialProps {
  style?: CSSProperties;
  area?: string;
  rating?: number;
  share?: string;
  checked?: boolean;
  checkButtonCallback?: () => void;
}

export function Social(props: PropsWithChildren<SocialProps>): JSX.Element {
  const { area, rating, checked, share, style, checkButtonCallback } = props;
  return (
    <div className="item-social" style={{ ...style, gridArea: area }}>
      {rating ? <div className="item-rating">{rating}</div> : <></>}
      {share ? (
        <div className="item-share">
          <ShareButton />
        </div>
      ) : (
        <></>
      )}
      {checked !== undefined ? (
        <div className="item-checked">
          <CheckButton checked={checked} callback={checkButtonCallback} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

interface ImageProps {
  src: string;
  style?: CSSProperties;
  area?: string;
  onClick?: any;
}

export function Image(props: PropsWithChildren<ImageProps>): JSX.Element {
  const { src, style, area, onClick } = props;

  return (
    <div
      className="item-image"
      style={{ ...style, gridArea: area }}
      onClick={onClick}
    >
      <img src={src} />
    </div>
  );
}
