export interface UserInfo {
    id: number;
    username: string;
    role: string;
}

export const ROLE_LABELS: Record<string, string> = {
    ROLE_ADMIN: 'Quản lý nhân sự',
    ROLE_USER: 'Nhân viên',
};

export interface Employee {
    id: number;
    name: string;
    dob: string;
    phone: string;
    address: string;
    languages: string[];
    certificates: string[];
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