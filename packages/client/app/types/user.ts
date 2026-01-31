export type User = {
  email: string;
  name?: string;
};

export type ProfileBody = {
  user: User;
};
