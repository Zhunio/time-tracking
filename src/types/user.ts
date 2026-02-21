export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  isAdmin: boolean;
};

export type UpdateUserRequest = Partial<CreateUserRequest>;
