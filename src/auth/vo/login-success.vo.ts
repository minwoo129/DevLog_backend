export interface LoginSuccessVO {
  id: number;
  name: string;
  email: string;
  nickname: string;
  isAdmin: boolean;
  authToken: string;
}
