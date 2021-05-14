import "./index.scss";
import "react-quill/dist/quill.snow.css";

import moment from "moment";
import { useSelector } from "react-redux";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { useEffect, useState } from "react";
import { AppState } from "../../../../redux/stores/renderer";
import { setSidebarWidth } from "../../../../../utils/setSidebarWidth";
import { ReactComponent as Reload } from "../../../../../assets/svg/reload.svg";
import {
  singleSupportTicketsPayload,
  IGetComments,
} from "../../../../api/types/support-ticket/supportTicket";
import getTicket from "../support-tickets-utils/getSingleSupportTicket";
import postComment from "../support-tickets-utils/postSupportTicketComment";
import getBaseComments from "../support-tickets-utils/getBaseComments";
import SuperSpinner from "../../../super-spinner";
import TextEditor from "../../../text-editor";
import {
  SkillsRenderer,
  VibesRenderer,
  getVibes,
  ImagesPreviewString,
} from "../../../forms";
import createGPT3Question from "../../../../../utils/api/createGPT3Question";
import { IPostQuestion, IGetQuestion } from "../../../../api/types/gpt-3/GPT3";

import Comment from "./comment";
/* eslint import/no-webpack-loader-syntax: off */

export interface IComments {
  comment: string;
  nestedComments?: IComments[];
}

interface ISingleSupportTicket extends RouteComponentProps {
  ticketId?: string;
}
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable  react/jsx-props-no-spreading */
export default function SupportTicket({
  ticketId,
}: ISingleSupportTicket): JSX.Element {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<singleSupportTicketsPayload>();
  const [loading, setLoading] = useState<boolean>(true);
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<IGetComments["comments"]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  /* {
      comment: `The world ain’t all sunshine and rainbows. It is a very mean and nasty
          place and it will beat you to your knees and keep you there
          permanently if you let it. You, me, or nobody is gonna hit as hard as
          life. But it ain’t how hard you hit; it’s about how hard you can get
          hit, and keep moving forward. How much you can take, and keep moving
          forward. That’s how winning is done. Now, if you know what you’re
          worth, then go out and get what you’re worth. But you gotta be willing
          to take the hit, and not pointing fingers saying you ain’t where you
          are because of him, or her, or anybody. Cowards do that and that ain’t
          you. You’re better than that!`,
      nestedComments: [
        {
          comment: "Prueba1",
          nestedComments: [
            {
              comment: "pruebaA",
              nestedComments: [
                { comment: "PruebaA1" },
                {
                  comment: "PruebaA2",
                  nestedComments: [{ comment: "PruebaA21" }],
                },
              ],
            },
            {
              comment: "pruebaB",
              nestedComments: [{ comment: "PruebaB1" }],
            },
          ],
        },
      ],
    },
   */
  console.log(setComments);

  const [question, setQuestion] = useState<IPostQuestion>({
    question: "",
    document_name: "",
    engine_name: "",
  });
  const [gpt3Suggestions, setGpt3Suggestions] = useState<IGetQuestion[]>([]);

  const gpt3SuggestionsCopy: IGetQuestion[] = [];

  const { vibeData } = useSelector(
    (state: AppState) => state.createSupportTicket
  );

  const handleComment = () => {
    console.log(ticketId);
    (async () => {
      await postComment({ comment: inputValue, ticketId: ticketId! }).then(
        (fc) => {
          console.log(fc);
          setComments([...comments, fc]);
        }
      );
    })();
  };

  const getAnswers = (q: IPostQuestion) => {
    (async () => {
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < 3; i += 1) {
        await createGPT3Question(q)
          .then((resp) => {
            console.log(resp);
            gpt3SuggestionsCopy.push(resp);
            if (i == 2) {
              setGpt3Suggestions(gpt3SuggestionsCopy);

              setQuestionsLoading(false);
              setLoading(false);
            }
          })
          .catch((e: any) => console.log(e));
      }
    })();
  };

  const reloadAnswer = () => {
    setQuestionsLoading(true);
    console.log(question);
    (async () => {
      await getAnswers(question);
    })();
  };

  useEffect(() => {
    setSidebarWidth(1000);

    if (ticketId) {
      getTicket(ticketId).then((tick) => {
        console.log(tick);
        setTicket(tick);

        getBaseComments(ticketId).then((cs) => {
          setComments(cs.comments);
          (async () => {
            await getAnswers({
              question: tick.title,
              engine_name: "curie",
              document_name: tick._id,
            });
            setQuestion({
              question: tick.title,
              engine_name: "curie",
              document_name: tick._id,
            });
          })();
        });
      });
    }
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
              <div className="title">
                Suggest Solutions
                <Reload onClick={reloadAnswer} />
              </div>
              {questionsLoading ? (
                <div>
                  <SuperSpinner size="80px" text="Loading suggestions" />
                </div>
              ) : (
                <ul className="AI-suggestion">
                  {gpt3Suggestions.length > 0 &&
                    gpt3Suggestions.map((suggestion) => (
                      <li
                        onClick={() => {
                          if (inputValue == "") {
                            setInputValue(`<p>${suggestion.answer}</p>`);
                          } else {
                            setInputValue(
                              `${inputValue}<br><p>${suggestion.answer}</p>`
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
              )}
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

              {/*              <img src={formbuttons} alt="" />

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              /> */}

              <div data-text-editor="name">
                <TextEditor
                  value={inputValue}
                  onChange={(e) => setInputValue(e)}
                />
                <button
                  type="button"
                  onClick={handleComment}
                  className="send-comment"
                >
                  Add Comment
                </button>
              </div>

              <div className="comment-section">
                {comments.map((c) => (
                  <Comment key={c._id} {...c} />
                ))}
              </div>

              <div className="help-buttons">
                <button type="button" onClick={() => navigate("/give")}>
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
