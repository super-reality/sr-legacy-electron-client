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
  return (
    <div className="item-container" style={{ ...props.style }}>
      {props.children}
    </div>
  );
}

interface IconProps {
  url: string;
  style?: CSSProperties;
}

export function Icon(props: PropsWithChildren<IconProps>): JSX.Element {
  return (
    <div
      className="item-icon"
      style={{ ...props.style, backgroundImage: `url(${props.url})` }}
    >
      {props.children}
    </div>
  );
}

interface TitleProps {
  style?: CSSProperties;
  title: string;
  sub?: string;
}

export function Title(props: PropsWithChildren<TitleProps>): JSX.Element {
  return (
    <div className="item-titles" style={{ ...props.style }}>
      <div className="item-title">{props.title}</div>
      {props.sub ? <div className="item-sub">{props.sub}</div> : <></>}
    </div>
  );
}

interface SocialProps {
  style?: CSSProperties;
  rating?: number;
  share?: string;
  checked?: boolean;
}

export function Social(props: PropsWithChildren<SocialProps>): JSX.Element {
  return (
    <div className="item-social" style={{ ...props.style }}>
      {props.rating ? <div className="item-rating">{props.rating}</div> : <></>}
      {props.share ? (
        <div className="item-share">
          <ShareButton />
        </div>
      ) : (
          <></>
        )}
      {props.checked !== undefined ? (
        <div className="item-checked">
          <CheckButton checked={props.checked} />
        </div>
      ) : (
          <></>
        )}
    </div>
  );
}
