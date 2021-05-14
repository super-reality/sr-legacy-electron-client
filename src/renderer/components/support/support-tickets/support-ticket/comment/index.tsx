import { useState } from "react";
import "./index.scss";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import useRanking from "../../../../../hooks/useRanking";
import useDidUpdateEffect from "../../../../../hooks/useDidUpdateEffect";
import Profile from "../../../../../../assets/images/nicks-profile.png";
import { ReactComponent as Downvote } from "../../../../../../assets/svg/down.svg";
import { ReactComponent as Upvote } from "../../../../../../assets/svg/up.svg";
import { ReactComponent as Reply } from "../../../../../../assets/svg/reply.svg";
import { ReactComponent as Share } from "../../../../../../assets/svg/share.svg";
import { ReactComponent as Comments } from "../../../../../../assets/svg/comments.svg";
import NestedComment from "./nested-comment";
import { IComment } from "../../../../../api/types/support-ticket/supportTicket";

import TextEditor from "../../../../text-editor";
import getNestedComments from "../../support-tickets-utils/getNestedComments";
import postComment from "../../support-tickets-utils/postSupportTicketNestedComment";

const NONE = 0;
const UP = 1;
const DOWN = 2;
/* eslint-disable react/no-danger */
/* eslint-disable  react/jsx-props-no-spreading */
export default function Comment(props: IComment): JSX.Element {
  const {
    _id,
    comment,
    nestedComments,
    nestedCommentsCount,
    username,
    ranking,
    timePostted,
  } = props;
  const [displayNestedComments, setDisplayNestedComments] = useState<boolean>(
    false
  );

  const [comments, setComments] = useState<IComment[]>(nestedComments ?? []);
  const [InputValue, setInputValue] = useState<string>("");
  const [commentState, setCommentState] = useState<string>(comment);
  const [commentCount, setCommentCount] = useState<number>(nestedCommentsCount);
  const [editMode] = useState<boolean>(false);

  const [rank, upvote, handleUpvote, handleDownvote] = useRanking(
    ranking,
    NONE
  );

  useDidUpdateEffect(() => {
    if (displayNestedComments && comments.length == 0) {
      (async () => {
        await getNestedComments(_id)
          .then((nc) => {
            setComments(nc.comments);
          })
          .catch((e) => console.log(e));
      })();
    }
  }, [displayNestedComments]);

  const handleComment = () => {
    (async () => {
      console.log({ ticketId: _id, comment: InputValue });
      await postComment({ parentId: _id, comment: InputValue }).then((nc) => {
        setComments([...comments, nc]);
        setDisplayNestedComments(true);
        setCommentCount(commentCount + 1);
      });
    })();
    setInputValue("");
  };
  return (
    <div className="comment">
      <div className="comment-header">
        <div
          className="profile"
          style={{
            backgroundImage: `url(${Profile})`,
          }}
        />
        <div className="general-info">
          <p>
            <strong>{username}</strong>, Chief Executive Officer at GameGen
            (2000-present)
          </p>
          <span>{moment(timePostted).fromNow()}</span>
        </div>
      </div>

      <div className="comment-content">
        {editMode ? (
          <TextEditor
            value={commentState}
            onChange={(e) => setCommentState(e)}
          />
        ) : (
          <p
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: commentState }}
          />
        )}

        <div className="comment-actions">
          <div className="comment-ranking">
            <div className="comment-upvote" onClick={() => handleUpvote()}>
              <Upvote className={upvote == UP ? "selected" : ""} />
            </div>
            <div className="vote-division" />
            <div className="comment-downvote" onClick={() => handleDownvote()}>
              <Downvote className={upvote == DOWN ? "selected" : ""} />
            </div>
            <span>{rank}</span>
          </div>
          <div className="actions">
            <Reply />
            Reply
          </div>
          <div
            className="actions"
            onClick={() => setDisplayNestedComments(!displayNestedComments)}
          >
            <Comments />
            Comments ({commentCount})
          </div>
          <div className="actions">
            <Share />
            Share
          </div>
        </div>

        <div className="comment-reply">
          <div
            className="profile"
            style={{
              backgroundImage: `url(${Profile})`,
            }}
          />

          <input
            onChange={(e) => setInputValue(e.target.value)}
            value={InputValue}
            type="text"
            placeholder="Add Reply..."
          />

          <button
            type="button"
            onClick={handleComment}
            className="send-comment"
          >
            Add Comment
          </button>
        </div>
      </div>

      {displayNestedComments && (
        <div className="nested-comments fade">
          {comments.length > 0 &&
            comments.map((c) => <NestedComment key={c._id} {...c} />)}
        </div>
      )}
    </div>
  );
}