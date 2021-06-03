import { useState, useEffect } from "react";
import "./index.scss";
import "react-quill/dist/quill.snow.css";
import { shell } from "electron";
import open from "open";
import moment from "moment";
import { useSelector } from "react-redux";
import useRanking from "../../../../../hooks/useRanking";
import { AppState } from "../../../../../redux/stores/renderer";
import useDidUpdateEffect from "../../../../../hooks/useDidUpdateEffect";
import Profile from "../../../../../../assets/images/nicks-profile.png";
import { ReactComponent as Downvote } from "../../../../../../assets/svg/down.svg";
import { ReactComponent as Upvote } from "../../../../../../assets/svg/up.svg";
import { ReactComponent as Reply } from "../../../../../../assets/svg/reply.svg";
import { ReactComponent as Dots } from "../../../../../../assets/svg/three-dots-h.svg";
import { ReactComponent as Share } from "../../../../../../assets/svg/share.svg";
import { ReactComponent as Comments } from "../../../../../../assets/svg/comments.svg";
import NestedComment from "./nested-comment";
import { IComment } from "../../../../../api/types/support-ticket/supportTicket";
import TextEditor from "../../../../text-editor";
import getNestedComments from "../../support-tickets-utils/getNestedComments";
import editComment from "../../support-tickets-utils/editComment";
import postComment from "../../support-tickets-utils/postSupportTicketNestedComment";
import { DeleteComment } from "..";

const NONE = 0;
const UP = 1;
const DOWN = 2;
/* eslint-disable react/no-danger */
/* eslint-disable  react/jsx-props-no-spreading */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */

export const handleAnchors = () => {
  const anchors = document.getElementsByTagName("a");
  const handleOpenLink = (event: MouseEvent) => {
    event.preventDefault();
    console.log(event);
    const anchor = event.target as HTMLAnchorElement;
    const url = anchor.href;
    console.log(url);
    console.log(anchor);
    open(url);
    shell.openExternal(url);
  };
  console.log("LOOOPS");
  for (let i = 0; i < anchors.length; i += 1) {
    console.log(anchors[i]);
    if (anchors[i].href) {
      anchors[i].onclick = handleOpenLink;
    }
  }
};

export default function Comment(props: IComment): JSX.Element {
  const {
    _id,
    comment,
    nestedComments,
    nestedCommentsCount,
    username,
    ranking,
    timePostted,
    deleteComment,
  } = props;
  const [displayNestedComments, setDisplayNestedComments] = useState<boolean>(
    false
  );

  const auth = useSelector((state: AppState) => state.auth);

  const [comments, setComments] = useState<IComment[]>(nestedComments ?? []);
  const [InputValue, setInputValue] = useState<string>("");
  const [commentState, setCommentState] = useState<string>(comment);
  const [commentCount, setCommentCount] = useState<number>(nestedCommentsCount);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [rank, upvote, handleUpvote, handleDownvote] = useRanking(
    ranking,
    NONE
  );
  useEffect(handleAnchors, [comments]);

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
        console.log(nc);
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
          <div className="general-info-name">
            <p>
              <strong>{username}</strong>, Chief Executive Officer at GameGen
              (2000-present)
            </p>
            <div className="options">
              <button type="button">
                <Dots />
                {username === auth.username && (
                  <ul>
                    <li onClick={() => setEditMode(!editMode)}>Edit</li>
                    <li onClick={() => deleteComment && deleteComment(_id)}>
                      Delete
                    </li>
                  </ul>
                )}
              </button>
            </div>
          </div>
          <span>{moment(timePostted).fromNow()}</span>
        </div>
      </div>
      <div className="comment-content">
        {editMode ? (
          <div className="edit-area">
            <TextEditor
              value={commentState}
              onChange={(e) => setCommentState(e)}
            />
            <button type="button" className="send-comment" onClick={handleEdit}>
              Edit Comment
            </button>
          </div>
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
            comments.map((c) => (
              <NestedComment key={c._id} {...c} deleteComment={handleDelete} />
            ))}
        </div>
      )}
    </div>
  );
}
