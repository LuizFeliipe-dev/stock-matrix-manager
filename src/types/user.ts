
import { UserPermission } from './auth';
import { UserPermissionItem } from '@/components/users/UserPermissionsModal';

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
  permissions?: UserPermissionItem[];
}
