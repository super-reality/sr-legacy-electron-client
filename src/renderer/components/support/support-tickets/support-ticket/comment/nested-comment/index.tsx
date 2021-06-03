import { useState } from "react";
import "./index.scss";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import useRanking from "../../../../../../hooks/useRanking";
import Profile from "../../../../../../../assets/images/nicks-profile.png";
import { ReactComponent as Downvote } from "../../../../../../../assets/svg/down.svg";
import { ReactComponent as Upvote } from "../../../../../../../assets/svg/up.svg";
import { ReactComponent as Reply } from "../../../../../../../assets/svg/reply.svg";
import { ReactComponent as Share } from "../../../../../../../assets/svg/share.svg";
import { ReactComponent as Comments } from "../../../../../../../assets/svg/comments.svg";
import { ReactComponent as Dots } from "../../../../../../../assets/svg/three-dots-h.svg";
import { IComment } from "../../../../../../api/types/support-ticket/supportTicket";
import getNestedComments from "../../../support-tickets-utils/getNestedComments";
import editComment from "../../../support-tickets-utils/editComment";
import postComment from "../../../support-tickets-utils/postSupportTicketNestedComment";
import useDidUpdateEffect from "../../../../../../hooks/useDidUpdateEffect";
import { DeleteComment } from "../..";

const NONE = 0;
const UP = 1;
const DOWN = 2;
/* eslint-disable  react/jsx-props-no-spreading */
export default function NestedComment(props: IComment): JSX.Element {
  const {
    _id,
    username,
    comment,
    timePostted,
    nestedComments,
    nestedCommentsCount,
    ranking,
    deleteComment,
  } = props;

  let commentsArray: JSX.Element[] = [];

  const [willReply, setWillReply] = useState<boolean>(false);
  const [displayNestedComments, setDisplayNestedComments] = useState<boolean>(
    false
  );

  const [rank, upvote, handleUpvote, handleDownvote] = useRanking(
    ranking,
    NONE
  );
  const [comments, setComments] = useState<IComment[]>(nestedComments ?? []);
  const [InputValue, setInputValue] = useState<string>("");
  const [commentCount, setCommentCount] = useState<number>(nestedCommentsCount);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [commentState, setCommentState] = useState<string>(comment);

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
      console.log({ parentId: _id, comment: InputValue });
      await postComment({
        parentId: _id,
        comment: InputValue,
        child: true,
      }).then((nc) => {
        setComments([...comments, nc]);
        setDisplayNestedComments(true);
        setCommentCount(commentCount + 1);
      });
    })();
    setInputValue("");
  };

  const handleEdit = () => {
    setEditMode(false);

    (async () => {
      await editComment({ _id, comment: commentState });
    })();
  };

  const handleDelete = (commentId: string) => {
    setComments(DeleteComment(commentId, _id, comments));
  };

  if (comments.length > 0) {
    commentsArray = comments.map((c) => (
      <NestedComment key={c._id} {...c} deleteComment={handleDelete} />
    ));
  }
  return (
    <div className="nested-comment">
      <div className="nested-comment-side">
        <div
          className="profile"
          style={{
            backgroundImage: `url(${Profile})`,
          }}
        />
        <div className="side-line" />
      </div>
      <div className="nested-comment-info">
        <div className="comment-header">
          <div className="general-info">
            <div className="general-info-name">
              <p>
                <strong>{username}</strong>, Chief Executive Officer at GameGen
                (2000-present)
              </p>
              <div className="options">
                <button type="button">
                  <Dots />
                  <ul>
                    <li onClick={() => setEditMode(!editMode)}>Edit</li>
                    <li onClick={() => deleteComment && deleteComment(_id)}>
                      Delete
                    </li>
                  </ul>
                </button>
              </div>
            </div>
            <span>{moment(timePostted).fromNow()}</span>
          </div>
        </div>

        <div className="comment-content">
          {!editMode ? (
            <p>{commentState}</p>
          ) : (
            <div className="edit-area">
              <textarea
                value={commentState}
                onChange={(e) => setCommentState(e.target.value)}
              />
              <button
                type="button"
                onClick={handleEdit}
                className="send-comment"
              >
                Edit Comment
              </button>
            </div>
          )}
          <div className="comment-actions">
            <div className="comment-ranking">
              <div className="comment-upvote" onClick={() => handleUpvote()}>
                <Upvote className={upvote == UP ? "selected" : ""} />
              </div>
              <div className="vote-division" />
              <div
                className="comment-downvote"
                onClick={() => handleDownvote()}
              >
                <Downvote className={upvote == DOWN ? "selected" : ""} />
              </div>
              <span>{rank}</span>
            </div>
            <div className="actions" onClick={() => setWillReply(!willReply)}>
              <Reply />
              Reply
            </div>
            <div
              className="actions"
              onClick={() => setDisplayNestedComments(!displayNestedComments)}
            >
              <Comments />
              Comments ({commentsArray.length})
            </div>
            <div className="actions">
              <Share />
              Share
            </div>
          </div>

          {willReply && (
            <div className="comment-reply fade">
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
                Reply
              </button>
            </div>
          )}
          {displayNestedComments && (
            <div className="nested-comments fade">
              {commentsArray.length > 0 && commentsArray}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
