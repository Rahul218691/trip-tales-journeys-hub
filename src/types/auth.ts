export interface User {
  _id: string;
  username: string;
  email: string;
  profileImg: string;
  profileImgSecureUrl: string;
  usertype: string;
  totalStories?: number;
  totalTrips?: number;
  followers?: number;
  following?: number;
  bio?: string;
}

export interface LoginResponse {
  user: User;
  auth: boolean;
}

export interface LogoutResponse {
  message: string;
} 