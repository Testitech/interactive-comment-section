import type { Comment, Reply } from "../types";

const icons = {
  plus: "/images/icon-plus.svg",
  minus: "/images/icon-minus.svg",
  reply: "/images/icon-reply.svg",
  delete: "/images/icon-delete.svg",
  edit: "/images/icon-edit.svg",
};

type CommentCardProps = {
  comment: Comment;
  currentUser: string;
  onUpvote: () => void;
  onDownvote: () => void;
  onReply: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

type ReplyCardProps = {
  reply: Reply;
  currentUser: string;
  onUpvote: () => void;
  onDownvote: () => void;
  onReply: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

type VoteControlProps = {
  score: number;
  onUpvote: () => void;
  onDownvote: () => void;
};

type CommentActionsProps = {
  isCurrentUser: boolean;
  onReply: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

function VoteControl({ score, onUpvote, onDownvote }: VoteControlProps) {
  return (
    <div className="inline-flex items-center rounded-xl bg-indigo-50 p-1 sm:flex-col">
      <button
        type="button"
        onClick={onUpvote}
        aria-label="Increase score"
        className="grid size-9 place-items-center rounded-lg transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <img src={icons.plus} alt="" aria-hidden="true" />
      </button>

      <span
        aria-label={`Score: ${score}`}
        className="min-w-9 text-center text-sm font-semibold text-indigo-600"
      >
        {score}
      </span>

      <button
        type="button"
        onClick={onDownvote}
        aria-label="Decrease score"
        className="grid size-9 place-items-center rounded-lg transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <img src={icons.minus} alt="" aria-hidden="true" />
      </button>
    </div>
  );
}

function CommentActions({
  isCurrentUser,
  onReply,
  onDelete,
  onEdit,
}: CommentActionsProps) {
  if (isCurrentUser) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <img src={icons.delete} alt="" aria-hidden="true" />
          <span className="hidden sm:inline">Delete</span>
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <img src={icons.edit} alt="" aria-hidden="true" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onReply}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <img src={icons.reply} alt="" aria-hidden="true" />
      Reply
    </button>
  );
}

type CardLayoutProps = {
  id: number;
  username: string;
  avatar: string;
  createdAt: string;
  content: React.ReactNode;
  score: number;
  isCurrentUser: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
  onReply: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isReply?: boolean;
};

function CardLayout({
  id,
  username,
  avatar,
  createdAt,
  content,
  score,
  isCurrentUser,
  onUpvote,
  onDownvote,
  onReply,
  onDelete,
  onEdit,
  isReply = false,
}: CardLayoutProps) {
  return (
    <article
      id={`comment-${id}`}
      className={[
        "group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white",
        "p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-200",
        "hover:border-zinc-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)]",
        "sm:p-5",
        isReply ? "w-full" : "",
      ].join(" ")}
    >
      <div className="grid gap-4 sm:grid-cols-[44px_1fr]">
        <div className="order-2 sm:order-1">
          <VoteControl
            score={score}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
          />
        </div>

        <div className="order-1 min-w-0 sm:order-2">
          <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <img
              src={avatar}
              alt={`${username}'s avatar`}
              className="size-9 rounded-full object-cover ring-1 ring-zinc-200"
            />

            <strong className="text-sm font-semibold text-zinc-900 sm:text-[15px]">
              {username}
            </strong>

            {isCurrentUser && (
              <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                You
              </span>
            )}

            <span className="text-xs text-zinc-400 sm:text-sm">
              {createdAt}
            </span>

            <div className="ml-auto hidden sm:block">
              <CommentActions
                isCurrentUser={isCurrentUser}
                onReply={onReply}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          </header>

          <div className="mt-4 text-[15px] leading-7 text-zinc-600">
            {content}
          </div>
        </div>

        <div className="order-3 ml-auto sm:hidden">
          <CommentActions
            isCurrentUser={isCurrentUser}
            onReply={onReply}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </div>
    </article>
  );
}

export default function CommentCard({
  comment,
  currentUser,
  onUpvote,
  onDownvote,
  onReply,
  onDelete,
  onEdit,
}: CommentCardProps) {
  const isCurrentUser = comment.user.username === currentUser;

  return (
    <CardLayout
      id={comment.id}
      username={comment.user.username}
      avatar={comment.user.image.png}
      createdAt={comment.createdAt}
      content={<p>{comment.content}</p>}
      score={comment.score}
      isCurrentUser={isCurrentUser}
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      onReply={onReply}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
}

export function RepliesCard({
  reply,
  currentUser,
  onUpvote,
  onDownvote,
  onReply,
  onDelete,
  onEdit,
}: ReplyCardProps) {
  const isCurrentUser = reply.user.username === currentUser;

  return (
    <CardLayout
      id={reply.id}
      username={reply.user.username}
      avatar={reply.user.image.png}
      createdAt={reply.createdAt}
      content={
        <p>
          <span className="mr-1 font-semibold text-indigo-600">
            @{reply.replyingTo}
          </span>
          {reply.content}
        </p>
      }
      score={reply.score}
      isCurrentUser={isCurrentUser}
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      onReply={onReply}
      onDelete={onDelete}
      onEdit={onEdit}
      isReply
    />
  );
}
