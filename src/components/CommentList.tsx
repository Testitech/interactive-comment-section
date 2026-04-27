import { useState } from "react";
import data from "../db/data.json";
import CommentCard, { RepliesCard } from "./CommentCard";

export default function CommentList() {
  const [comments, setComments] = useState(data.comments);

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

  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  const deleteComment = (id: number) => {
    console.log("trying to delete comment", id, typeof id);
    console.log("current comments", comments);

    setComments(comments.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-4">
          <CommentCard
            comment={comment}
            currentUser={data.currentUser.username}
            onUpvote={() => changeScore(comment.id, 1)}
            onDownvote={() => changeScore(comment.id, -1)}
            onReply={() => setReplyingToId(comment.id)}
            onDelete={() => deleteComment(comment.id)}
          />

          {replyingToId === comment.id && (
            <div className="bg-white p-4 max-w-2xl border border-gray-50 rounded-lg flex flex-col space-y-4">
              <textarea
                name="reply"
                id="r"
                placeholder="Add a reply"
                rows={2}
                cols={35}
                className="outline-gray-600 border border-gray-100 p-3"
              ></textarea>

              <div className="flex justify-start space-x-5 mt-3">
                <button
                  className="bg-[#45429b] hover:bg-[#817fbe] text-white px-6 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-300"
                  onClick={() => setReplyingToId(null)}
                >
                  Send
                </button>
                <button
                  className="bg-red-600 hover:bg-red-400 text-red-100 px-6 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-300"
                  onClick={() => setReplyingToId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* replies */}
          {comment.replies.length > 0 && (
            <div className="sm:ml-20 ml-16 flex flex-col gap-3 border-l border-gray-400 pl-4">
              {comment.replies.map((reply) => (
                <RepliesCard
                  key={reply.id}
                  reply={reply}
                  currentUser={data.currentUser.username}
                  onUpvote={() => changeScore(reply.id, +1)}
                  onDownvote={() => changeScore(reply.id, -1)}
                  onReply={() => setReplyingToId(reply.id)}
                  onDelete={() => deleteComment(reply.id)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
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
