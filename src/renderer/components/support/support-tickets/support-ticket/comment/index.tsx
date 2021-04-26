import { useState, useRef } from "react";
import "./index.scss";
import Profile from "../../../../../../assets/images/nicks-profile.png";
import { ReactComponent as Downvote } from "../../../../../../assets/svg/down.svg";
import { ReactComponent as Upvote } from "../../../../../../assets/svg/up.svg";
import { ReactComponent as Reply } from "../../../../../../assets/svg/reply.svg";
import { ReactComponent as Share } from "../../../../../../assets/svg/share.svg";
import { ReactComponent as Comments } from "../../../../../../assets/svg/comments.svg";
import NestedComment from "./nested-comment";

export interface IComments {
  comment: string;
  nestedComments?: IComments[];
}

export default function Comment(props: IComments): JSX.Element {
  const { comment, nestedComments } = props;
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
        <p>
          The world ain’t all sunshine and rainbows. It is a very mean and nasty
          place and it will beat you to your knees and keep you there
          permanently if you let it. You, me, or nobody is gonna hit as hard as
          life. But it ain’t how hard you hit; it’s about how hard you can get
          hit, and keep moving forward. How much you can take, and keep moving
          forward. That’s how winning is done. Now, if you know what you’re
          worth, then go out and get what you’re worth. But you gotta be willing
          to take the hit, and not pointing fingers saying you ain’t where you
          are because of him, or her, or anybody. Cowards do that and that ain’t
          you. You’re better than that!
          {comment}
        </p>

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
          <div className="actions">
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
            Reply
          </div>
        </div>

        <div className="comment-reply">
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
            Add Comment
          </button>
        </div>
      </div>

      {displayNestedComments && (
        <div className="nested-comments fade">
          {comments.length > 0 &&
            comments.map((c) => (
              <NestedComment
                key={c.comment}
                comment={c.comment}
                nestedComments={c.nestedComments ?? []}
              />
            ))}
        </div>
      )}
    </div>
  );
}
