export interface Permission {
  id: string;
  slug: string | null;
  title: string | null;
}

export interface PermissionIndexResponse {
  meta: object;
  data: Permission[];
}