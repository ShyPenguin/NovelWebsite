import { UserTable } from "@/infrastructure/db/schemas/users.js";

export const userAdmin: typeof UserTable.$inferInsert = {
  username: "jawadsnovelwebsite",
  email: "jawadomato@gmail.com",
  name: "Jawad NovelWebsite",
  role: "admin",
  imageUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocKekgiNNov617v7OdUT3bPPoOjKSUoMmxNW2McwjXInc1lIGA=s96-c",
};

export const userSupervisor: typeof UserTable.$inferInsert = {
  username: "domatojawad",
  email: "domatojawad@gmail.com",
  name: "Domato Jawad",
  role: "supervisor",
};

export const userSupervisor2: typeof UserTable.$inferInsert = {
  username: "silfion",
  email: "silfionate@gmail.com",
  name: "Silfion",
  role: "supervisor",
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
