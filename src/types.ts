export type Reply = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  user: {
    username: string;
    image: {
      png: string;
    };
  };
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: {
    username: string;
    image: {
      png: string;
    };
  };
  replies?: Reply[];
};
