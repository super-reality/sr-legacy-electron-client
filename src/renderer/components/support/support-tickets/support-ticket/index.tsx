import "./index.scss";
import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/stores/renderer";
import { setSidebarWidth } from "../../../../../utils/setSidebarWidth";
import formbuttons from "../../../../../assets/images/suggest-form-btns.png";
import { singleSupportTicketsPayload } from "../../../../api/types/support-ticket/supportTicket";
import getTicket from "../support-tickets-utils/getSingleSupportTicket";
import SuperSpinner from "../../../super-spinner";

import {
  SkillsRenderer,
  VibesRenderer,
  getVibes,
  ImagesPreviewString,
} from "../../../forms";
import createGPT3Question from "../../../../../utils/api/createGPT3Question";
import { IPostQuestion, IGetQuestion } from "../../../../api/types/gpt-3/GPT3";

/* import futurecar from "../../../../../assets/images/future-car.png"; */

interface ISupportTicketProps {
  id: string;
  goback: () => void;
}

export default function SupportTicker({
  id,
  goback,
}: ISupportTicketProps): JSX.Element {
  const [ticket, setTicket] = React.useState<singleSupportTicketsPayload>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [gpt3Suggestions, setGpt3Suggestions] = React.useState<IGetQuestion[]>(
    []
  );

  const [inputValue, setInputValue] = React.useState("");

  const gpt3SuggestionsCopy: IGetQuestion[] = [];

  const { vibeData } = useSelector(
    (state: AppState) => state.createSupportTicket
  );

  React.useEffect(() => {
    setSidebarWidth(600);
    getTicket(id).then((tick) => {
      console.log(tick);
      setTicket(tick);
      const question: IPostQuestion = {
        question: tick.title,
        engine_name: "curie",
        document_name: tick._id,
      };

      (async () => {
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < 3; i += 1) {
          await createGPT3Question(question)
            .then((resp) => {
              console.log(resp);
              gpt3SuggestionsCopy.push(resp);
              if (i == 2) {
                setGpt3Suggestions(gpt3SuggestionsCopy);
                setLoading(false);
              }
            })
            .catch((e: any) => console.log(e));
        }
      })();
    });
  }, []);

  return (
    <>
      {loading ? (
        <div className="support-ticket-spinner">
          <SuperSpinner size="30%" text="Loading Ticket" />
        </div>
      ) : (
        <div className="solution-container">
          <div className="solution-search">
            <div className="solution-wrapper">
              <div className="query-title">{ticket?.title}</div>
              <span className="white">{ticket?.category?.name}</span>
              <div>Posted {moment(ticket?.createdAt).fromNow()}</div>
              <div className="border-bottom">
                <div className="white">1</div> Mentor Helping
              </div>
              <div className="border-bottom">{ticket?.description}</div>
              <div className="border-bottom">
                AI Summary: Cesar has been watching a lot of YouTube and has
                moments of sadness. But every time he uses Blender 3D and
                listens to music he always marks his current emotion as
                happiness.
              </div>

              <div className="border-bottom">
                <span className="white">Skills</span>
                {ticket?.skill && <SkillsRenderer skills={ticket.skill} />}
              </div>
              {/* <div className="border-bottom">
                {ticket?.vibes && <VibesRenderer vibes={ticket.vibes} />}
              </div> */}

              <div className="border-bottom">
                <span className="white">Vibes</span>
                {ticket?.skill && (
                  <VibesRenderer
                    vibes={getVibes(
                      ticket?.vibes,
                      vibeData.negativeVibes.concat(vibeData.positiveVibes)
                    ).map((vib, index) => ({
                      ...vib,
                      level: ticket?.vibesLevels[index],
                    }))}
                  />
                )}
              </div>

              {ticket?.files && ticket?.files?.length > 0 && (
                <div className="border-bottom">
                  <span className="white">Files</span>

                  <ImagesPreviewString values={ticket?.files} columns={3} />
                </div>
              )}
              <ul className="list-arrow">
                <li>
                  Engagement in last <div className="blue">3 days</div>
                </li>
                <li>
                  Emotions in last <div className="blue">3 days</div>
                </li>
                <li>
                  Accomplishments in last <div className="blue">3 days</div>
                </li>
              </ul>
            </div>
            <div className="suggest-solution">
              <div className="title">Suggest Solutions</div>
              <ul className="AI-suggestion">
                {gpt3Suggestions.length > 0 &&
                  gpt3Suggestions.map((suggestion) => (
                    <li
                      onClick={() => {
                        if (inputValue == "") {
                          setInputValue(`${suggestion.answer}`);
                        } else {
                          setInputValue(
                            `${inputValue} \n\n${suggestion.answer}`
                          );
                        }
                      }}
                      key={`${suggestion.answer}`}
                    >
                      <b>Gaia says: </b>
                      {suggestion.answer}
                    </li>
                  ))}

                <li
                  onClick={() => {
                    if (inputValue == "") {
                      setInputValue(`The answer is always on your heart`);
                    } else {
                      setInputValue(
                        `${inputValue} \n\nThe answer is always on your heart`
                      );
                    }
                  }}
                >
                  <b>Nick Marks says: </b>
                  The answer is always on your heart
                </li>
                <li
                  onClick={() => {
                    if (inputValue == "") {
                      setInputValue(`Idk go ask manwe`);
                    } else {
                      setInputValue(`${inputValue} \n\nIdk go ask manwe`);
                    }
                  }}
                >
                  <b>Nick Marks says: </b>
                  Idk go ask manwe
                </li>

                {/*
                <div className="blue">
                  Animating Cubes In Blender ( RASA )
                </div>{" "}
                */}
              </ul>
              <div className="title">
                Create Your Own Solution
                <div className="purple">
                  Goals and techniques to think about ( AI suggestions )
                </div>
              </div>
              <ul>
                <li>
                  Remember to stress the student self sufficiency. They are
                  seeking that.
                </li>
                <li>
                  Encourage them that you will be there for this. They need
                  support to finish.
                </li>
                <li>
                  Music. This student loves music. Student completes tasks when
                  88% of the time when listening.
                </li>
              </ul>

              <img src={formbuttons} alt="" />

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              <div className="help-buttons">
                <button type="button" onClick={goback}>
                  Save & Exit
                </button>
                <button type="button">Send</button>
              </div>
            </div>
            <hr />
          </div>
        </div>
      )}
    </>
  );
}
/* <div className="solution-wrapper">
            <div className="query-title">I need help Animating</div>
            <span className="white">Animation</span>
            <div> Posted 30 minutes ago</div>
            <div className="border-bottom">
              <div className="white">1</div> Mentor Helping
            </div>
            <div className="border-bottom">
              I am trying to create an Animation. I was hoping someone could
              create a lesson
            </div>
            <div className="border-bottom">
              AI Summary: Cesar has been watching a lot of YouTube and has
              moments of sadness. But every time he uses Blender 3D and listens
              to music he always marks his current emotion as happiness.
            </div>
            <ul>
              <li>
                Engagement in last <div className="blue">3 days</div>
                <div className="progress">
                  <span>Blender 3D</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "30%" }}
                    />
                  </div>
                </div>
                <div className="progress">
                  <span>Construct 3</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "10%" }}
                    />
                  </div>
                </div>
                <div className="progress">
                  <span>YouTube</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>
                <div className="progress">
                  <span>Super Realities</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>
              </li>
              <li>
                Emotions in last <div className="blue">3 days</div>
                <div className="solution-images">
                  <img src={futurecar} alt="" />
                </div>
              </li>
              <li>
                Accomplishments in last <div className="blue">3 days</div>
                <div className="progress">
                  <span>Blender 3D</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "30%" }}
                    />
                  </div>
                </div>
                <div className="progress">
                  <span>Construct 3</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "10%" }}
                    />
                  </div>
                </div>
                <div className="progress">
                  <span>YouTube</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>
                <div className="progress">
                  <span>Super Realities</span>
                  <div className="blue-bar">
                    <div
                      className="pink-bar-progress"
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div> */
