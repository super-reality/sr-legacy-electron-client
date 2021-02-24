import "./index.scss";
import React from "react";
import moment from "moment";
import { setSidebarWidth } from "../../../../../utils/setSidebarWidth";
import formbuttons from "../../../../../assets/images/suggest-form-btns.png";
import { singleSupportTicketsPayload } from "../../../../api/types/support-ticket/supportTicket";
import getTicket from "../support-tickets-utils/getSingleSupportTicket";
import SuperSpinner from "../../../super-spinner";
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

  React.useEffect(() => {
    setSidebarWidth(600);
    getTicket(id).then((tick) => {
      setTicket(tick);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading ? (
        <SuperSpinner size="30%" text="Loading Ticket" />
      ) : (
        <div className="solution-container">
          <div className="solution-search">
            <div className="solution-wrapper">
              <div className="query-title">{ticket?.title}</div>
              <span className="white">{ticket?.category}</span>
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
              <ul>
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
              <ol>
                <li>
                  Try this lesson!{" "}
                  <div className="blue">
                    Animating Cubes In Blender ( RASA )
                  </div>
                </li>
                <li>
                  What type of program are you trying to animate in? Your goals
                  have you learning Blender. Is that correct? ( RASA )
                </li>
                <li>What are you trying to animate? ( GPT-3 )</li>
              </ol>
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

              <input type="text" />

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
