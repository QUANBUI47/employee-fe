export interface UserInfo {
  id: number;
  username: string;
  role: string;
}

export const ROLE_LABELS: Record<string, string> = {
  ROLE_ADMIN: 'Quản lý nhân sự',
  ROLE_USER: 'Nhân viên',
};

export interface Language { id: number; name: string; level: string; }
export interface Certificate { id: number; name: string; }
export interface Employee {
  id: number;
  name: string;
  dob: string;
  phone: string;
  address: string;
  languages: Language[];
  certificates: Certificate[];
}

export interface EmployeeRequest {
  name: string;
  dob: string;
  phone: string;
  address: string;
  languageIds: number[];
  certificateIds: number[];
}


export interface Page<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
