export interface UserDetails {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  displayName: string;
  displayTitle: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  token: string;
  communities: Array<string>;
  rolePermissions: object;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface DeleteUserPayload {
  username: string;
  userId: string;
}