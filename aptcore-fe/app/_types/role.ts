import { Permission } from "./permission";

export interface Role {
  id: string;
  slug: string | null;
  title: string | null;
}

export interface RoleIndexResponse {
  meta: object;
  data: Role[];
}

export interface RolePermission {
  role: Role;
  permissions: Permission[];
}

export type RolePermissionsMap = Record<string, Record<string, string | null>>;