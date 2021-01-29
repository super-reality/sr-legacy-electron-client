import React from "react";
import "./index.scss";

import voteup from "../../../assets/images/voteup.png";
import votedown from "../../../assets/images/votedown.png";
import ticketuser from "../../../assets/images/ticket-user.png";
import emoji1 from "../../../assets/svg/emoji1.svg";
import emoji2 from "../../../assets/svg/emoji2.svg";
import emoji3 from "../../../assets/svg/emoji3.svg";
import emoji4 from "../../../assets/svg/emoji4.svg";
import emoji5 from "../../../assets/svg/emoji5.svg";
import emoji6 from "../../../assets/svg/emoji6.svg";
import emoji7 from "../../../assets/svg/emoji7.svg";
import emoji8 from "../../../assets/svg/emoji8.svg";
/* eslint-disable */
import emoji9 from "../../../assets/svg/emoji9.svg";

import timeposted from "../../../assets/images/timeposted.png";
import chats from "../../../assets/images/chats.png";

export default function SupportTickets(): JSX.Element {
  return (
    <>
      <div className="ticket-title">Filter By</div>
      <div className="ticket-container">
        <div className="ticket-category">
          Category
          <input type="text" value="Select Categories" />
        </div>

        <div className="ticket-search">
          <div className="ticket-wrapper">
            <input type="text" value="Animation" />
            <a href="">Advanced Search</a>
            <div className="request-count">
              20 Help Requests
              <div className="sort-filter">
                <select>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            <div className="ticket-list">
              <div className="single-query">
                <div className="voting">
                  <div className="up-vote">
                    <button type="button">
                      <img src={voteup} alt="" />
                    </button>
                  </div>
                  <div className="vote">12</div>
                  <div className="down-vote">
                    <button type="button">
                      <img src={votedown} alt="" />
                    </button>
                  </div>
                </div>

                <div className="content">
                  <div className="query">I need help Animating</div>
                  <div className="description">
                    I am trying to create an Animation. I was hoping someone
                    could create a lesson. Tempor lorem sociis molestie velit,
                    et etiam bibendum dolor. Amet libero, eleifend viverra
                    feugiat mi interdum risus id. Vel dapibus ut nec pulvinar
                    praesent dolor pharetra.
                  </div>
                  <div className="ticket-user-info">
                    <div className="ticket-user">
                      <img src={ticketuser} alt="" />
                      Nick Marks
                    </div>
                    <div className="vibe-rating">
                      Vibe Rating
                      <div className="emojis">
                        <img src={emoji1} alt="" />
                        <img src={emoji2} alt="" />
                        <img src={emoji3} alt="" />
                      </div>
                    </div>
                    <div className="timeposted">
                      <img src={timeposted} alt="" />
                      30mins ago
                    </div>
                    <div className="ticket-chats">
                      <img src={chats} alt="" />
                      50+
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-query">
                <div className="voting">
                  <div className="up-vote">
                    <button type="button">
                      <img src={voteup} alt="" />
                    </button>
                  </div>
                  <div className="vote">12</div>
                  <div className="down-vote">
                    <button type="button">
                      <img src={votedown} alt="" />
                    </button>
                  </div>
                </div>

                <div className="content">
                  <div className="query">I need help Animating</div>
                  <div className="description">
                    I am trying to create an Animation. I was hoping someone
                    could create a lesson. Tempor lorem sociis molestie velit,
                    et etiam bibendum dolor. Amet libero, eleifend viverra
                    feugiat mi interdum risus id. Vel dapibus ut nec pulvinar
                    praesent dolor pharetra.
                  </div>
                  <div className="ticket-user-info">
                    <div className="ticket-user">
                      <img src={ticketuser} alt="" />
                      Nick Marks
                    </div>
                    <div className="vibe-rating">
                      Vibe Rating
                      <div className="emojis">
                        <img src={emoji4} alt="" />
                        <img src={emoji5} alt="" />
                        <img src={emoji6} alt="" />
                        <img src={emoji6} alt="" />
                      </div>
                    </div>
                    <div className="timeposted">
                      <img src={timeposted} alt="" />
                      30mins ago
                    </div>
                    <div className="ticket-chats">
                      <img src={chats} alt="" />
                      50+
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-query">
                <div className="voting">
                  <div className="up-vote">
                    <button type="button">
                      <img src={voteup} alt="" />
                    </button>
                  </div>
                  <div className="vote">12</div>
                  <div className="down-vote">
                    <button type="button">
                      <img src={votedown} alt="" />
                    </button>
                  </div>
                </div>

                <div className="content">
                  <div className="query">I need help Animating</div>
                  <div className="description">
                    I am trying to create an Animation. I was hoping someone
                    could create a lesson. Tempor lorem sociis molestie velit,
                    et etiam bibendum dolor. Amet libero, eleifend viverra
                    feugiat mi interdum risus id. Vel dapibus ut nec pulvinar
                    praesent dolor pharetra.
                  </div>
                  <div className="ticket-user-info">
                    <div className="ticket-user">
                      <img src={ticketuser} alt="" />
                      Nick Marks
                    </div>
                    <div className="vibe-rating">
                      Vibe Rating
                      <div className="emojis">
                        <img src={emoji7} alt="" />
                        <img src={emoji8} alt="" />
                        <img src={emoji9} alt="" />
                      </div>
                    </div>
                    <div className="timeposted">
                      <img src={timeposted} alt="" />
                      30mins ago
                    </div>
                    <div className="ticket-chats">
                      <img src={chats} alt="" />
                      50+
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-query">
                <div className="voting">
                  <div className="up-vote">
                    <button type="button">
                      <img src={voteup} alt="" />
                    </button>
                  </div>
                  <div className="vote">12</div>
                  <div className="down-vote">
                    <button type="button">
                      <img src={votedown} alt="" />
                    </button>
                  </div>
                </div>

                <div className="content">
                  <div className="query">I need help Animating</div>
                  <div className="description">
                    I am trying to create an Animation. I was hoping someone
                    could create a lesson. Tempor lorem sociis molestie velit,
                    et etiam bibendum dolor. Amet libero, eleifend viverra
                    feugiat mi interdum risus id. Vel dapibus ut nec pulvinar
                    praesent dolor pharetra.
                  </div>
                  <div className="ticket-user-info">
                    <div className="ticket-user">
                      <img src={ticketuser} alt="" />
                      Nick Marks
                    </div>
                    <div className="vibe-rating">
                      Vibe Rating
                      <div className="emojis">
                        <img src={emoji7} alt="" />
                        <img src={emoji8} alt="" />
                      </div>
                    </div>
                    <div className="timeposted">
                      <img src={timeposted} alt="" />
                      30mins ago
                    </div>
                    <div className="ticket-chats">
                      <img src={chats} alt="" />
                      50+
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
