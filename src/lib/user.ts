import { Permission, Role } from "./db/schema";

export type User = {
  role: Role;
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  permissions: Permission[];
};
