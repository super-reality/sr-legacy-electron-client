import React, { PropsWithChildren, CSSProperties } from "react";
import "./index.scss";
import ShareButton from "../share-button";
import CheckButton from "../check-button";

interface InnerItemProps {
  style?: CSSProperties;
  text?: boolean;
  controls?: boolean;
}

export function ItemInner(
  props: PropsWithChildren<InnerItemProps>
): JSX.Element {
  const { style, controls, text, children } = props;
  return (
    <div
      className={`item-container ${controls ? "controls" : ""} ${
        text ? "text" : ""
      }`}
      style={{ ...style }}
    >
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
      <div className="item-title">{title}</div>
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
  const {
    area,
    rating,
    checked,
    share,
    style,
    checkButtonCallback,
    children,
  } = props;
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
