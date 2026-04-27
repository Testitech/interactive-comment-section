import plus from "/public/images/icon-plus.svg";
import minus from "/public/images/icon-minus.svg";
import replyIcon from "/public/images/icon-reply.svg";
import deleteIcon from "/public/images/icon-delete.svg";
import editIcon from "/public/images/icon-edit.svg";

import { type Comment, type Reply } from "../types";

type CommentCardProps = {
  comment: Comment;
  currentUser: string;
  onUpvote: () => void;
  onDownvote: () => void;
  onReply: () => void;
  onDelete: () => void;
};

type ReplyCardProps = {
  reply: Reply;
  currentUser:string
  onUpvote: () => void;
  onDownvote: () => void;
  onReply: () => void;
  onDelete: () => void;
};

export default function CommentCard({
  comment,
  currentUser,
  onUpvote,
  onDownvote,
  onReply,
  onDelete,
}: CommentCardProps) {
  const isCurrentUser = comment.user.username === currentUser;

  return (
    <article
      id={`${comment.id}`}
      className="comment-card border border-gray-50 p-4 rounded-lg shadow-sm bg-white max-w-2xl"
    >
      <header className="flex items-center gap-3">
        <img
          src={comment.user.image.png}
          alt={`${comment.user.username} avatar`}
          className="h-8 w-8 rounded-full"
        />
        <strong className="text-base">{comment.user.username}</strong>

        {isCurrentUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-white bg-[#45429b] px-2 py-1 rounded">
              you
            </span>

            <span className="text-sm text-gray-400">{comment.createdAt}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">{comment.createdAt}</span>
        )}

        {isCurrentUser ? (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onDelete}
              className="flex items-center gap-2 text-red-400"
            >
              <img src={deleteIcon} alt="delete" /> Delete
            </button>
            <button className="flex items-center gap-2 text-[#45429b]">
              <img src={editIcon} alt="edit" /> Edit
            </button>
          </div>
        ) : (
          <button
            onClick={onReply}
            className="flex items-center gap-2 ml-auto text-[#5f5da7] font-semibold cursor-pointer"
          >
            <img src={replyIcon} alt="reply icon" /> Reply
          </button>
        )}
      </header>
      <p className="mt-2 text-sm text-gray-600 sm:text-base">
        {comment.content}
      </p>
      <footer className="flex mt-3 items-center gap-3">
        <button className="cursor-pointer" onClick={onUpvote}>
          <img src={plus} alt="upvote" />
        </button>
        <span className="font-bold text-gray-500">{comment.score}</span>
        <button className="cursor-pointer" onClick={onDownvote}>
          <img src={minus} alt="downvote" />
        </button>
      </footer>
    </article>
  );
}

export function RepliesCard({
  reply,
  currentUser,
  onUpvote,
  onDownvote,
  onReply,
  onDelete,
}: ReplyCardProps) {

const isCurrentUser = reply.user.username === currentUser

  return (
    <article
      id={`${reply.id}`}
      className="reply-card border border-gray-50 p-4 rounded-lg shadow-sm bg-white max-w-xl"
    >
      <header className="flex items-center gap-3">
        <img
          src={reply.user.image.png}
          alt={`${reply.user.username} avatar`}
          className="h-8 w-8 rounded-full"
        />
        <strong>{reply.user.username}</strong>

        {isCurrentUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-white bg-[#45429b] px-2 py-1 rounded">
              you
            </span>

            <span className="text-sm text-gray-400">{reply.createdAt}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">{reply.createdAt}</span>
        )}
        {isCurrentUser ? (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onDelete}
              className="flex items-center gap-2 text-[16px] font-medium text-red-400 cursor-pointer"
            >
              <img src={deleteIcon} alt="delete-icon" /> Delete
            </button>
            <button className="flex items-center gap-2 text-[16px] font-medium text-[#45429b] cursor-pointer">
              <img src={editIcon} alt="edit" /> Edit
            </button>
          </div>
        ) : (
          <button
            onClick={onReply}
            className="flex items-center gap-2 ml-auto cursor-pointer sm:text-[16px] text-[14px] font-semibold text-[#5f5da7] hover:text-[#9c9ada] transition-colors duration-300"
          >
            <img src={replyIcon} alt="reply icon" /> Reply
          </button>
        )}
      </header>

      <p className="mt-2 text-sm text-gray-600 sm:text-base">
        {reply.replyingTo && (
          <span className="text-[#5f5da7] font-semibold">
            @{reply.replyingTo}{" "}
          </span>
        )}
        {reply.content}
      </p>

      <footer className="flex mt-3 items-center gap-3">
        <button className="cursor-pointer" onClick={onUpvote}>
          <img src={plus} alt="upvote" />
        </button>
        <span className="font-bold text-gray-500">{reply.score}</span>
        <button className="cursor-pointer" onClick={onDownvote}>
          <img src={minus} alt="downvote" />
        </button>
      </footer>
    </article>
  );
}
