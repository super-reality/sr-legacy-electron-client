import { useState, useRef } from "react";
import "./index.scss";
import Profile from "../../../../../../../assets/images/nicks-profile.png";
import { ReactComponent as Downvote } from "../../../../../../../assets/svg/down.svg";
import { ReactComponent as Upvote } from "../../../../../../../assets/svg/up.svg";
import { ReactComponent as Reply } from "../../../../../../../assets/svg/reply.svg";
import { ReactComponent as Share } from "../../../../../../../assets/svg/share.svg";
import { ReactComponent as Comments } from "../../../../../../../assets/svg/comments.svg";

import { IComments } from "..";

export default function NestedComment(props: IComments): JSX.Element {
  const { comment, nestedComments } = props;

  let commentsArray: JSX.Element[] = [];

  const [willReply, setWillReply] = useState<boolean>(false);
  const [displayNestedComments, setDisplayNestedComments] = useState<boolean>(
    false
  );

  const [comments, setComments] = useState<IComments[]>(nestedComments ?? []);
  const commentRef = useRef<HTMLInputElement>(null);

  const handleComment = () => {
    if (commentRef.current) {
      setComments([...comments, { comment: commentRef.current.value }]);
      setDisplayNestedComments(true);
      commentRef.current.value = "";
    }
  };

  if (comments.length > 0) {
    commentsArray = comments.map((c) => (
      <NestedComment
        key={c.comment}
        comment={c.comment}
        nestedComments={c.nestedComments ?? []}
      />
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
            <p>
              <strong>Nick Marks</strong>, Chief Executive Officer at GameGen
              (2000-present)
            </p>
            <span>Answered 23h ago</span>
          </div>

          {/* 
        <div className="comment-buttons">
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div> */}
        </div>

        <div className="comment-content">
          <p>{comment}</p>

          <div className="comment-actions">
            <div className="comment-ranking">
              <div className="comment-upvote">
                <Upvote />
              </div>
              <div className="vote-division" />
              <div className="comment-downvote">
                <Downvote />
              </div>
              <span>62</span>
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
              Comments
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

              <input ref={commentRef} type="text" placeholder="Add Reply..." />

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
