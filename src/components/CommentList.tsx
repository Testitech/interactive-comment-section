import { useEffect, useState } from "react";
import data from "../db/data.json";
import CommentCard, { RepliesCard } from "./CommentCard";
import type { Comment, ReplyTarget } from "../types";

type EditTarget = {
  id: number;
  content: string;
} | null;

type DeleteTarget = {
  id: number;
  username: string;
} | null;

type ComposerProps = {
  value: string;
  placeholder: string;
  submitLabel: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
};

function Composer({
  value,
  placeholder,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
  autoFocus = false,
}: ComposerProps) {
  const handleKeyboardSubmit = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:p-5">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyboardSubmit}
        placeholder={placeholder}
        rows={4}
        autoFocus={autoFocus}
        className="custom-scrollbar w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-[15px] leading-6 text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
      />

      <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim()}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:pointer-events-none disabled:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem("comments");

    if (!savedComments) {
      return data.comments;
    }

    try {
      return JSON.parse(savedComments) as Comment[];
    } catch {
      return data.comments;
    }
  });

  const [newComment, setNewComment] = useState("");
  const [composerContent, setComposerContent] = useState("");

  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const currentUser = data.currentUser;

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const changeScore = (id: number, delta: 1 | -1) => {
    setComments((previousComments) =>
      previousComments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            score: Math.max(0, comment.score + delta),
          };
        }

        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === id
              ? {
                  ...reply,
                  score: Math.max(0, reply.score + delta),
                }
              : reply,
          ),
        };
      }),
    );
  };

  const openReplyComposer = (
    commentId: number,
    username: string,
    replyId?: number,
  ) => {
    setEditTarget(null);
    setComposerContent("");
    setReplyTarget({
      commentId,
      replyId,
      username,
    });
  };

  const closeReplyComposer = () => {
    setReplyTarget(null);
    setComposerContent("");
  };

  const addReply = () => {
    const content = composerContent.trim();

    if (!content || !replyTarget) {
      return;
    }

    const newReply = {
      id: Date.now(),
      content,
      createdAt: "just now",
      score: 0,
      replyingTo: replyTarget.username,
      user: currentUser,
    };

    setComments((previousComments) =>
      previousComments.map((comment) =>
        comment.id === replyTarget.commentId
          ? {
              ...comment,
              replies: [...comment.replies, newReply],
            }
          : comment,
      ),
    );

    closeReplyComposer();
  };

  const addComment = () => {
    const content = newComment.trim();

    if (!content) {
      return;
    }

    const newCommentObject: Comment = {
      id: Date.now(),
      content,
      createdAt: "just now",
      score: 0,
      user: currentUser,
      replies: [],
    };

    setComments((previousComments) => [...previousComments, newCommentObject]);

    setNewComment("");
  };

  const openEditor = (id: number, content: string) => {
    setReplyTarget(null);
    setComposerContent(content);
    setEditTarget({ id, content });
  };

  const closeEditor = () => {
    setEditTarget(null);
    setComposerContent("");
  };

  const saveEdit = () => {
    const updatedContent = composerContent.trim();

    if (!editTarget || !updatedContent) {
      return;
    }

    setComments((previousComments) =>
      previousComments.map((comment) => {
        if (comment.id === editTarget.id) {
          return {
            ...comment,
            content: updatedContent,
            createdAt: `${comment.createdAt} · edited`,
          };
        }

        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === editTarget.id
              ? {
                  ...reply,
                  content: updatedContent,
                  createdAt: `${reply.createdAt} · edited`,
                }
              : reply,
          ),
        };
      }),
    );

    closeEditor();
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setComments((previousComments) =>
      previousComments
        .filter((comment) => comment.id !== deleteTarget.id)
        .map((comment) => ({
          ...comment,
          replies: comment.replies.filter(
            (reply) => reply.id !== deleteTarget.id,
          ),
        })),
    );

    setDeleteTarget(null);
  };

  return (
    <>
      <section aria-label="Comments" className="space-y-6">
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Conversation
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {comments.length} {comments.length === 1 ? "thread" : "threads"}
            </p>
          </div>
        </div>

        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-6 py-14 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-indigo-50 text-xl">
              💬
            </div>

            <h3 className="mt-4 font-semibold text-zinc-900">
              No comments yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Start the conversation by sharing the first piece of feedback.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <article key={comment.id} className="space-y-4">
                {editTarget?.id === comment.id ? (
                  <Composer
                    value={composerContent}
                    placeholder="Update your comment"
                    submitLabel="Save changes"
                    onChange={setComposerContent}
                    onSubmit={saveEdit}
                    onCancel={closeEditor}
                    autoFocus
                  />
                ) : (
                  <CommentCard
                    comment={comment}
                    currentUser={currentUser.username}
                    onUpvote={() => changeScore(comment.id, 1)}
                    onDownvote={() => changeScore(comment.id, -1)}
                    onReply={() =>
                      openReplyComposer(comment.id, comment.user.username)
                    }
                    onEdit={() => openEditor(comment.id, comment.content)}
                    onDelete={() =>
                      setDeleteTarget({
                        id: comment.id,
                        username: comment.user.username,
                      })
                    }
                  />
                )}

                {replyTarget?.commentId === comment.id &&
                  replyTarget.replyId === undefined && (
                    <div className="animate-[fadeIn_200ms_ease-out]">
                      <p className="mb-2 text-sm text-zinc-500">
                        Replying to{" "}
                        <span className="font-semibold text-indigo-600">
                          @{replyTarget.username}
                        </span>
                      </p>

                      <Composer
                        value={composerContent}
                        placeholder={`Reply to @${replyTarget.username}`}
                        submitLabel="Post reply"
                        onChange={setComposerContent}
                        onSubmit={addReply}
                        onCancel={closeReplyComposer}
                        autoFocus
                      />
                    </div>
                  )}

                {comment.replies.length > 0 && (
                  <div className="relative ml-4 space-y-4 border-l border-zinc-200 pl-4 sm:ml-10 sm:pl-6">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="space-y-3">
                        {editTarget?.id === reply.id ? (
                          <Composer
                            value={composerContent}
                            placeholder="Update your reply"
                            submitLabel="Save changes"
                            onChange={setComposerContent}
                            onSubmit={saveEdit}
                            onCancel={closeEditor}
                            autoFocus
                          />
                        ) : (
                          <RepliesCard
                            reply={reply}
                            currentUser={currentUser.username}
                            onUpvote={() => changeScore(reply.id, 1)}
                            onDownvote={() => changeScore(reply.id, -1)}
                            onReply={() =>
                              openReplyComposer(
                                comment.id,
                                reply.user.username,
                                reply.id,
                              )
                            }
                            onEdit={() => openEditor(reply.id, reply.content)}
                            onDelete={() =>
                              setDeleteTarget({
                                id: reply.id,
                                username: reply.user.username,
                              })
                            }
                          />
                        )}

                        {replyTarget?.replyId === reply.id && (
                          <div className="animate-[fadeIn_200ms_ease-out]">
                            <p className="mb-2 text-sm text-zinc-500">
                              Replying to{" "}
                              <span className="font-semibold text-indigo-600">
                                @{replyTarget.username}
                              </span>
                            </p>

                            <Composer
                              value={composerContent}
                              placeholder={`Reply to @${replyTarget.username}`}
                              submitLabel="Post reply"
                              onChange={setComposerContent}
                              onSubmit={addReply}
                              onCancel={closeReplyComposer}
                              autoFocus
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="pt-2">
          <div className="mb-3 flex items-center gap-3">
            <img
              src={currentUser.image.png}
              alt={`${currentUser.username}'s avatar`}
              className="size-9 rounded-full object-cover ring-1 ring-zinc-200"
            />

            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Add to the discussion
              </p>

              <p className="text-xs text-zinc-500">
                Posting as @{currentUser.username}
              </p>
            </div>
          </div>

          <Composer
            value={newComment}
            placeholder="Share your thoughts..."
            submitLabel="Post comment"
            onChange={setNewComment}
            onSubmit={addComment}
          />
        </div>
      </section>

      {deleteTarget && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/40 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
          >
            <div className="grid size-11 place-items-center rounded-full bg-rose-50 text-lg">
              🗑️
            </div>

            <h2
              id="delete-dialog-title"
              className="mt-5 text-xl font-semibold tracking-tight text-zinc-950"
            >
              Delete this comment?
            </h2>

            <p
              id="delete-dialog-description"
              className="mt-2 text-sm leading-6 text-zinc-500"
            >
              This will permanently remove @{deleteTarget.username}’s
              contribution. This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                Keep comment
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              >
                Delete permanently
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
