import { UserTable } from "@/infrastructure/db/schemas/users.ts";

export const userAdmin: typeof UserTable.$inferInsert = {
  username: "jawadsnovelwebsite",
  email: "jawadomato@gmail.com",
  name: "Jawad NovelWebsite",
  role: "admin",
  imageUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocKekgiNNov617v7OdUT3bPPoOjKSUoMmxNW2McwjXInc1lIGA=s96-c",
};

export const userStaff: typeof UserTable.$inferInsert = {
  username: "motanokiseo",
  email: "kiseo@gmail.com",
  name: "Montano Kiseo",
  role: "staff",
};

export const userStaff2: typeof UserTable.$inferInsert = {
  username: "olalo",
  email: "miggy@gmail.com",
  name: "Miggy Olalo",
  role: "staff",
};

export const readerFirst: typeof UserTable.$inferInsert = {
  username: "meikosalubre",
  email: "meiko@gmail.com",
  name: "Meiko Salubre",
  role: "user",
};

export const readerSecond: typeof UserTable.$inferInsert = {
  username: "lileanor",
  email: "anor@gmail.com",
  name: "Lile Anor",
  role: "user",
};

export const reviewMockData = {
  rating: 4.5,
  review: "I love it",
};

export const reviewMockData2 = {
  rating: 3,
  review: "It's mid",
};

export const reviewMockData3 = {
  rating: 1,
  review: "I hate this one",
};

export const reviewMockData4 = {
  rating: 4,
  review: "This one cook",
};

export const commentMockData = {
  comment: "Wow I love this chapter. THis got 3 replies",
};

export const commentMockData2 = {
  comment: "Wow I hate this chapter",
};

export const commentMockData3 = {
  comment: "Dinner this chapter",
};

export const commentMockData4 = {
  comment: "Testing my comment",
};
export const commentMockData5 = {
  comment: "Testing Reply my mock data",
};

export const commentReplyMockData = {
  comment: "Reply: I dont like you",
};
export const commentReplyMockData2 = {
  comment: "Reply: Dont mind that guy, they a hater",
};
export const commentReplyMockData3 = {
  comment: "REply: That guy an incel bro dont mind him",
};
