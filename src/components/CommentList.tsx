import { useEffect, useState } from "react";
import data from "../db/data.json";
import CommentCard, { RepliesCard } from "./CommentCard";
import { type Comment } from "../types";

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem("comments");

    return savedComments ? JSON.parse(savedComments) : data.comments;
  });

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const [newComment, setNewComment] = useState("");

  const changeScore = (id: number, delta: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        // 1. Is it the main comment?
        if (comment.id === id) {
          return { ...comment, score: Math.max(0, comment.score + delta) };
        }

        // 2. If not, is it one of the replies?
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === id
                ? { ...reply, score: Math.max(0, reply.score + delta) }
                : reply,
            ),
          };
        }

        return comment;
      }),
    );
  };

  const [replyTargetId, setReplyTargetId] = useState<{
    commentId: number;
    replyId?: number;
  } | null>(null);

  const [newContent, setNewContent] = useState("");
  const [editContentId, setEditContentId] = useState<number | string | null>(
    null,
  );

  const [replyingToUsername, setReplyingToUsername] = useState("");

  const deleteComment = (id: number) => {
    console.log("trying to delete comment", id, typeof id);
    console.log("current comments", comments);

    setComments((prev) =>
      prev
        .filter((comment) => comment.id !== id)
        .map((comment) => ({
          ...comment,
          replies: comment.replies.filter((reply) => reply.id !== id),
        })),
    );
  };

  const editContent = (id: number, newData: string) => {
    setComments((eoc) =>
      eoc.map((newcon) => {
        if (newcon.id === id) {
          return { ...newcon, content: newData };
        }

        if (newcon.replies && newcon.replies.length > 0) {
          return {
            ...newcon,
            replies: newcon.replies.map((rep) =>
              rep.id === id ? { ...rep, content: newData } : rep,
            ),
          };
        }

        return newcon;
      }),
    );
  };

  const handleSend = (newContent: string) => {
    const newReply = {
      id: Date.now(),
      content: newContent,
      createdAt: "now",
      score: 0,
      replyingTo: replyingToUsername,
      user: data.currentUser,
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === replyTargetId?.commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      }),
    );
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      content: newComment,
      createdAt: "now",
      score: 0,
      user: data.currentUser,
      replies: [],
    };

    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-36">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-4">
            <CommentCard
              comment={comment}
              currentUser={data.currentUser.username}
              onUpvote={() => changeScore(comment.id, 1)}
              onDownvote={() => changeScore(comment.id, -1)}
              onReply={() => {
                setReplyTargetId({ commentId: comment.id });
                setReplyingToUsername(comment.user.username);
              }}
              onDelete={() => deleteComment(comment.id)}
              onEdit={() => {
                setEditContentId(comment.id);
                setNewContent(comment.content);
              }}
            />

            {replyTargetId?.commentId === comment.id &&
              !replyTargetId?.replyId && (
                <div className="bg-white p-4 max-w-2xl border border-gray-50 rounded-lg flex flex-col space-y-4">
                  <textarea
                    name="reply"
                    id="r"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Add a reply"
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none outline-none focus:border-[#45429b] transition-colors duration-200"
                  />

                  <div className="flex justify-start space-x-5 mt-3">
                    <button
                      className="bg-[#45429b] hover:bg-[#817fbe] text-white px-6 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-300"
                      onClick={() => {
                        if (!newContent.trim()) return;
                        handleSend(newContent);
                        setNewContent("");
                        setReplyTargetId(null);
                      }}
                    >
                      Send
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-400 text-red-100 px-6 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-300"
                      onClick={() => setReplyTargetId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            {editContentId === comment.id ? (
              <div
                key={comment.id}
                className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col gap-3"
              >
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none outline-none focus:border-[#45429b] transition-colors duration-200"
                />
                <div className="flex justify-end">
                  <button
                    className="bg-[#45429b] hover:bg-[#817fbe] text-white px-6 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors duration-300"
                    onClick={() => {
                      editContent(comment.id, newContent);
                      setEditContentId(null);
                      setNewContent("");
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            ) : null}

            {/* replies */}
            {comment.replies.length > 0 && (
              <div className="sm:ml-20 ml-16 flex flex-col gap-3 border-l border-gray-400 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex flex-col gap-3">
                    {editContentId === reply.id ? (
                      <div className="bg-white border border-gray-100 rounded-lg p-4 max-w-2xl flex flex-col gap-3">
                        <textarea
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          rows={3}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none outline-none focus:border-[#45429b]"
                        />

                        <div className="flex justify-end">
                          <button
                            className="bg-[#45429b] text-white px-6 py-2 rounded-lg"
                            onClick={() => {
                              if (!newContent.trim()) return;

                              editContent(reply.id, newContent);
                              setEditContentId(null);
                              setNewContent("");
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ) : (
                      <RepliesCard
                        reply={reply}
                        currentUser={data.currentUser.username}
                        onUpvote={() => changeScore(reply.id, 1)}
                        onDownvote={() => changeScore(reply.id, -1)}
                        onReply={() => {
                          setReplyTargetId({
                            commentId: comment.id,
                            replyId: reply.id,
                          });

                          setReplyingToUsername(reply.user.username);
                        }}
                        onDelete={() => deleteComment(reply.id)}
                        onEdit={() => {
                          setEditContentId(reply.id);
                          setNewContent(reply.content);
                        }}
                      />
                    )}

                    {/* reply textarea under exact reply */}
                    {replyTargetId?.replyId === reply.id && (
                      <div className="bg-white p-4 border border-gray-100 rounded-lg flex flex-col gap-3">
                        <textarea
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          rows={3}
                          placeholder={`Replying to @${reply.user.username}`}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none outline-none focus:border-[#45429b]"
                        />

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              handleSend(newContent);
                              setNewContent("");
                              setReplyTargetId(null);
                            }}
                            className="bg-[#45429b] text-white px-5 py-2 rounded-lg"
                          >
                            Send
                          </button>

                          <button
                            onClick={() => {
                              setReplyTargetId(null);
                              setNewContent("");
                            }}
                            className="bg-red-500 text-white px-5 py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex items-start gap-4 max-w-2xl mx-auto shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <img
          src={data.currentUser.image.png}
          alt={data.currentUser.username}
          className="w-9 h-9 rounded-full mt-1 shrink-0"
        />
        <textarea
          name="c"
          id="cc"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-200 rounded-lg p-3 text-sm resize-none outline-none focus:border-[#45429b] transition-colors duration-200"
        />
        <button
          onClick={addComment}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addComment();
            }
          }}
          disabled={!newComment.trim()}
          className="bg-[#45429b] disabled:bg-gray-300 hover:bg-[#817fbe] text-white px-6 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors duration-300 shrink-0"
        >
          Send
        </button>
      </div>
    </>
  );
}

/* 
React map rule

👉 One parent <div> per comment
👉 Replies live inside it
👉 Relationship preserved


<div>
  comment UI
  replies UI
</div>


*/
