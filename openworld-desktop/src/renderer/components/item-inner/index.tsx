import React, { PropsWithChildren, CSSProperties } from "react";
import "./index.scss";
import ShareButton from "../share-button";
import CheckButton from "../check-button";

interface InnerItemProps {
  style?: CSSProperties;
}

export function ItemInner(
  props: PropsWithChildren<InnerItemProps>
): JSX.Element {
  const { style, children } = props;
  return (
    <div className="item-container" style={{ ...style }}>
      {children}
    </div>
  );
}

interface IconProps {
  url: string;
  style?: CSSProperties;
}

export function Icon(props: PropsWithChildren<IconProps>): JSX.Element {
  const { url, style, children } = props;
  return (
    <div
      className="item-icon"
      style={{ ...style, backgroundImage: `url(${url})` }}
    >
      {children}
    </div>
  );
}

interface TitleProps {
  style?: CSSProperties;
  title: string;
  sub?: string;
}

export function Title(props: PropsWithChildren<TitleProps>): JSX.Element {
  const { title, sub, style, children } = props;
  return (
    <div className="item-titles" style={{ ...style }}>
      <div className="item-title">{title}</div>
      {sub ? <div className="item-sub">{sub}</div> : <></>}
    </div>
  );
}

interface TextProps {
  style?: CSSProperties;
}

export function Text(props: PropsWithChildren<TextProps>): JSX.Element {
  const { style, children } = props;
  return (
    <div className="item-text" style={{ ...style }}>
      {children}
    </div>
  );
}

interface SocialProps {
  style?: CSSProperties;
  rating?: number;
  share?: string;
  checked?: boolean;
  checkButtonCallback?: () => void;
}

export function Social(props: PropsWithChildren<SocialProps>): JSX.Element {
  const {
    rating,
    checked,
    share,
    style,
    checkButtonCallback,
    children,
  } = props;
  return (
    <div className="item-social" style={{ ...style }}>
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
