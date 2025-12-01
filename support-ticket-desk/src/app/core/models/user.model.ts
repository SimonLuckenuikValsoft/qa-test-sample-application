export type UserRole = 'admin' | 'agent';

export interface User {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoggedInUser {
  username: string;
  role: UserRole;
}


