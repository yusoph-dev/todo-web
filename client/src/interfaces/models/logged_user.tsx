export interface LoggedUser {
  token: string;
  email: string;
  file_name: string;
  first_name: string;
  last_name: string;
  menu: object;
  role: string;
  user_id: number;
  access: object;
  is_active: any;
}
