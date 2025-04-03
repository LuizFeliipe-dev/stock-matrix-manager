
import { UserPermission } from './auth';

export interface UserFormValues {
  name: string;
  email: string;
  role: string;
  department: string;
  permission: UserPermission;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permission: string;
  lastAccess: string;
  permissions?: {
    module: string;
    read: boolean;
    write: boolean;
  }[];
}
