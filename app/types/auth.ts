import { User } from "~/models";

export type LoginBody = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type ProfileResponse = {
  error?: string;
  loggedIn: boolean;
  token: string;
  user: User;
};
