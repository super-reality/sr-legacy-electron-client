import React from "react";
import "./index.scss";

export default function VibeEmojis(): JSX.Element {
  return (
    <div className="box">
      <input type="checkbox" id="like" className="field-reactions" />
      <h3 className="text-desc">Press space and after tab key to navigation</h3>
      <label htmlFor="like" className="label-reactions">
        Like
      </label>
      <div className="toolbox" />
      <label className="overlay" htmlFor="like" />
      <button type="button" className="reaction-like">
        <span className="legend-reaction">Like</span>
      </button>
      <button type="button" className="reaction-love">
        <span className="legend-reaction">Love</span>
      </button>
      <button type="button" className="reaction-haha">
        <span className="legend-reaction">Haha</span>
      </button>
      <button type="button" className="reaction-wow">
        <span className="legend-reaction">Wow</span>
      </button>
      <button type="button" className="reaction-sad">
        <span className="legend-reaction">Sad</span>
      </button>
      <button type="button" className="reaction-angry">
        <span className="legend-reaction">Angry</span>
      </button>
    </div>
  );
}
