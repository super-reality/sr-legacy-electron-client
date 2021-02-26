import React from "react";
import moment from "moment";
import voteup from "../../../../../assets/images/voteup.png";
import votedown from "../../../../../assets/images/votedown.png";
import ticketuser from "../../../../../assets/images/ticket-user.png";
/* import emoji1 from "../../../../../assets/svg/emoji1.svg";
import emoji2 from "../../../../../assets/svg/emoji2.svg";
import emoji3 from "../../../../../assets/svg/emoji3.svg";

import emoji4 from "../../../../../assets/svg/emoji4.svg";
import emoji5 from "../../../../../assets/svg/emoji5.svg";
import emoji6 from "../../../../../assets/svg/emoji6.svg";

import emoji7 from "../../../../../assets/svg/emoji7.svg";
import emoji8 from "../../../../../assets/svg/emoji8.svg";

import emoji9 from "../../../../../assets/svg/emoji9.svg";
 */
/* eslint-disable */

import timepostedIcon from "../../../../../assets/images/timeposted.png";
import chats from "../../../../../assets/images/chats.png";

import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/stores/renderer";
import { getVibes as getVibesName, AllVibes } from "../../../forms";

interface ICreatorInfo {
  firstname: string;
  lastname: string;
  username: string;
}

interface IsingleTicket {
  onClick: () => void;
  index: number;
  title: string;
  description: string;
  timeposted: string;
  creatorInfo?: ICreatorInfo;
  vibes: string[];
  vibesLevels: number[];
}

export default function singleTicket(props: IsingleTicket): JSX.Element {
  const {
    title,
    description,
    timeposted,
    creatorInfo,
    onClick,
    vibes,
    vibesLevels,
  } = props;

  const { vibeData } = useSelector(
    (state: AppState) => state.createSupportTicket
  );

  return (
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

      <div className="content" onClick={onClick}>
        <div className="query">{title}</div>
        <div className="description">{description}</div>
        <div className="ticket-user-info">
          <div className="ticket-user">
            <img src={ticketuser} alt="" />
            {creatorInfo ? creatorInfo.firstname : "Nick Marks"}
          </div>
          <div className="vibe-rating">
            Vibe Rating
            <div className="emojis">
              {getVibesName(
                vibes,
                vibeData.negativeVibes.concat(vibeData.positiveVibes)
              ).map((v, index) => {
                const vibeIndex = AllVibes.map((vi) => vi.title).indexOf(
                  v.title
                );
                if (vibeIndex != -1) {
                  if (index < 3) {
                    return (
                      <img
                        src={AllVibes[vibeIndex].emoji}
                        className={`result-${vibesLevels[index]}`}
                        alt=""
                      />
                    );
                  }
                }
              })}
            </div>
          </div>
          <div className="timeposted">
            <img src={timepostedIcon} alt="" />
            {moment(timeposted).fromNow()}
          </div>
          <div className="ticket-chats">
            <img src={chats} alt="" />
            50+
          </div>
        </div>
      </div>
    </div>
  );
}

/*{index == 0 && (
                <>
                  <img src={emoji1} alt="" />
                  <img src={emoji2} alt="" />
                  <img src={emoji3} alt="" />
                </>
              )}

              {index == 1 && (
                <>
                  <img src={emoji4} alt="" />
                  <img src={emoji5} alt="" />
                  <img src={emoji6} alt="" />
                </>
              )}

              {index == 2 && (
                <>
                  <img src={emoji7} alt="" />
                  <img src={emoji8} alt="" />
                  <img src={emoji9} alt="" />
                </>
              )}

              {index > 2 && (
                <>
                  <img src={emoji4} alt="" />
                  <img src={emoji5} alt="" />
                  <img src={emoji6} alt="" />
                </>
              )} */
