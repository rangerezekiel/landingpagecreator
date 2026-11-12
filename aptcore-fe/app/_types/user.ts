import { Website } from "./website";

export interface User {
  id: string | null;
  username: string | null;
  email: string | null;
  fullName: string | null;
  websiteId?: string | null;
  countryCode: string | null;
  phoneCode: string | null;
  countryPhoneCode: string | null;
  phoneNumber: string | null;
  phone: string | null;
  avatar: string | null;
  lastLogin: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  website?: Website | null;
}

export interface UserField {
  id: string | null;
  username: string | null;
  password?: string | null | unknown;
  passwordConfirmation?: string | null | unknown;
  email: string | null;
  websiteId?: string[] | null;
  fullName: string | null;
  countryCode: string | null;
  phoneCode: string | null;
  countryPhoneCode: string | null;
  phoneNumber: string | null;
  phone: string | null;
  avatar: string | null;
  roles: string[];
}

export interface UserIndex {
  id: string;
  username: string | null;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  avatar: string | null;
  websiteId: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  website: Website | null;
}

export interface UserIndexResponse {
  meta: object;
  data: UserIndex[];
}

export interface PhoneCode{
  iso : string;
  name : string;
  iso3 : string;
  numcode : string;
  phonecode : string;
}

export interface AuthState {
  user: User | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  login: (data: { user: User; token: string; roles: string[]; permissions: string[] }) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export interface AuthResponseData {
  token: string;
  user: User;
  roles: string[];
  permissions: string[];
}

export interface AuthApiResponse {
  status: number;
  data: AuthResponseData | null;
  error: string | null;
}

export interface MeState {
  user: User | null;
  permissions: string[];
}
