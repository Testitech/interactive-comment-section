export type User = {
  username: string;
  image: {
    png: string;
    webp?: string;
  };
};

export type Reply = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  user: User;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: Reply[];
};

export type CommentItem = Comment | Reply;

export type VoteDirection = 1 | -1;

export type ReplyTarget = {
  commentId: number;
  replyId?: number;
  username: string;
};

export type DialogState = {
  type: "delete";
  itemId: number;
  itemType: "comment" | "reply";
} | null;
