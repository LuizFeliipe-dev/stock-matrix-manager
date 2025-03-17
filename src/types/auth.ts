
export type UserPermission = 'initial' | 'second' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  permission: UserPermission;
}
