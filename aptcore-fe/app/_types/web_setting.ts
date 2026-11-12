export interface Key {
  id: string;
  key: string | null;
  value: string | null;
}

export interface KeyIndexResponse {
  meta: object;
  data: Key[];
}