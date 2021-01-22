import "./index.scss";
import React from "react";

import voting from "../../../assets/images/voting.png";

export default function Support(): JSX.Element {
  return (
    <>
      <div className="title">Filter By</div>
      <div className="support-container">
        <div className="support-category">
          Category
          <input type="text" placeholder="Select Categories" />
        </div>

        <div className="support-search">
          <div className="support-wrapper">
            <input type="text" placeholder="Animation" />
            <a href="">Advanced Search</a>
            <div className="request-count">
              20 Help Requests
              <div className="sort-filter">
                <span>Sort:</span>
                <select>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          </div>
          <div className="support-list">
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need help Animating</div>
                <div className="description">
                  I am trying to create an Animation. I was hoping someone could
                  create a lesson
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">How do I use key frames in Blender?</div>
                <div className="description">
                  I really want to learn how to animate in Blender using
                  keyframes kinda like stopmotion.
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need an Animator to help me!</div>
                <div className="description">Can someone animate my ships!</div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need help Animating</div>
                <div className="description">
                  I am trying to create an Animation. I was hoping someone could
                  create a lesson
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need help Animating</div>
                <div className="description">
                  I am trying to create an Animation. I was hoping someone could
                  create a lesson
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need help Animating</div>
                <div className="description">
                  I am trying to create an Animation. I was hoping someone could
                  create a lesson
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need help Animating</div>
                <div className="description">
                  I am trying to create an Animation. I was hoping someone could
                  create a lesson
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need help Animating</div>
                <div className="description">
                  I am trying to create an Animation. I was hoping someone could
                  create a lesson
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
            <div className="single-query">
              <div className="voting">
                <button type="button">
                  <img src={voting} />
                </button>
              </div>
              <div className="content">
                <div className="query">I need help Animating</div>
                <div className="description">
                  I am trying to create an Animation. I was hoping someone could
                  create a lesson
                </div>
                <div className="member-count">Member: 22d</div>
              </div>

              <div className="timestamp">30m</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
